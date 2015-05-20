var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var LoanConstants = require('../constants/loan-constants');
var ScenarioConstants = require('../constants/scenario-constants');
var assign = require('object-assign');
var jumbo = require('jumbo-mortgage');
var mortgageCalculations = require('../mortgage-calculations');
var common = require('../common');
var utils = require('../utils');
var api = require('../api');
var $ = jQuery = require('jquery');
var ScenarioStore = require('./scenario-store');


var calculatedProperties = ['loan-summary', 'loan-amount'];
var calculatedPropertiesBasedOnIR = [
    'discount', 
    'processing', 
    'third-party-services',
    'insurance', 
    'taxes-gov-fees', 
    'prepaid-expenses', 
    'initial-escrow',
    'monthly-taxes-insurance', 
    'monthly-hoa-dues', 
    'monthly-principal-interest',
    'monthly-mortgage-insurance', 
    'monthly-payment', 
    'closing-costs', 
    'principal-paid', 
    'interest-fees-paid', 
    'overall-costs'
];
var CHANGE_EVENT = 'change';

var defaultLoanData = {
    'credit-score': 700,
    'downpayment': 20000,
    'price': 200000,
    'rate-structure': 'fixed',
    'points': 0,
    'loan-term': 30,
    'loan-type': 'conf',
    'arm-type': '5-1',
    'state': 'CA'
};

var _loans = [];

function resetLoans (keepLoanData) {
    var len = _loans.length || common.loanCount;
    var scenario = ScenarioStore.getScenario();
    var scenarioLoanData = scenario ? scenario.loanProps : {};
    
    for (i = 0; i < len; i++) {
        var currentLoanData = (!scenario && keepLoanData) ? _loans[i] : {edited: false};
        var loan = assign({id: i}, defaultLoanData, currentLoanData, scenarioLoanData[i]);
        
        var dependencies = updateDependencies(loan);
        var calculatedProps = generateCalculatedProperties(loan);
        var loanState = getInitialLoanState(loan);
        _loans[i] = assign(loan, dependencies, calculatedProps, loanState);
    }
    
    if (scenario) {
        updateRates();
    } else if (!keepLoanData) {
        for (i = 0; i < len; i++) {
            updateRates(i);
        }
    }
}

function updateAll(prop, val) {
    for (var id in _loans) {
        update(id, prop, val);
    }
}

function update(id, prop, val) {
    var loan = _loans[id];
    var rateChange = (prop === 'interest-rate');
    
    loan[prop] = val;
    
    loan['edited'] = rateChange ? false : true;
    
    if (loan['rate-request']) {
        updateRates(id);
    }
    
    assign(loan, updateDependencies(loan, prop));
    _loans[id] = assign(loan, generateCalculatedProperties(loan, rateChange), updateLoanState(loan, prop));
}

function fetchRates(loan) {
    if (loan['rate-request']) {
        api.stopRequest(loan['rate-request']);
    }   
    return api.fetchRateData(loan);
}

function processRatesResults(results) {
    var rates = [];
    for ( key in results.data ) {
        if ( results.data.hasOwnProperty( key ) ) {
            rates.push(key);
        }
    }
    var medianRate = utils.median(rates);
    var processedRates = $.map(rates, function( rate, i ) {
      return {val: rate, label: rate + '%'};
    });
    return {vals: processedRates, median: medianRate};
}

function updateRates(id) {
    var loans = ScenarioStore.getScenario() ? _loans : [_loans[id]];
    var dfd = fetchRates(loans[0])
                .done(function(results) {
                    var rates = processRatesResults(results);
                    for (var i=0; i< loans.length; i++) {
                        loans[i]['edited'] = false;
                        loans[i]['rates'] = rates.vals;
                        loans[i]['interest-rate'] = rates.median;
                        assign(loans[i], generateCalculatedProperties(loans[i], true));
                    }
                })
                .always(function() {
                    for (var i=0; i< loans.length; i++) {
                        loans[i]['rate-request'] = null;
                    }
                    // TODO: maybe this fetch should be an api action?
                    LoanStore.emitChange();
                });
    
    for (var i=0; i< loans.length; i++) { 
        loans[i]['rate-request'] = dfd;
    }
}


function updateDependencies (loan, prop) {
    var obj = {};
    if (!prop || prop === 'price' || prop === 'downpayment') {
        obj['downpayment-percent'] = mortgageCalculations['downpayment-percent'](loan);
    } else if (prop === 'downpayment-percent') {
        obj['downpayment'] = mortgageCalculations['downpayment'](loan);
    }
    return obj;
}

function generateCalculatedProperties (loan, rateChange) {
    var props = rateChange 
                ? calculatedPropertiesBasedOnIR 
                : calculatedProperties;
    for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        loan[prop] = mortgageCalculations[prop](loan);
    }
    return loan;
}

function getInitialLoanState (loan) {
    var obj = {};
    assign(obj, isArm(loan));
    //obj['is-jumbo'] = isJumbo(loan);
    obj['downpayment-too-high'] = isDownpaymentTooHigh(loan);
    obj['downpayment-too-low'] = isDownpaymentTooLow(loan);
    return obj;
}

function updateLoanState (loan, prop) {
    var obj = {};
    switch (prop) {
        case 'edited': 
            obj['interest-rate'] = null;
            break;
        case 'rate-structure':
            assign(obj, isArm(loan));
            break;
        case 'loan-type':
        case 'loan-amount':
            obj['is-jumbo'] = isJumbo(loan);
        case 'loan-type':
        case 'downpayment':
        case 'downpayment-percent':
        case 'price':
            obj['downpayment-too-high'] = isDownpaymentTooHigh(loan);
            obj['downpayment-too-low'] = isDownpaymentTooLow(loan);
    }
    return obj;
}

function isArm (loan) {
    var obj = {
        'errors': {},
        'is-arm': loan['rate-structure'] === 'arm'
    };
    if (obj['is-arm']) {
        if ($.inArray(loan['loan-term'], common.armDisallowedOptions['loan-term']) >= 0) {
            obj.errors['loan-term'] = loan['loan-term'];
            obj['loan-term'] = '30';
        }
        if ($.inArray(loan['loan-type'], common.armDisallowedOptions['loan-type']) >= 0) {            
            obj.errors['loan-type'] = loan['loan-type'];
            obj['loan-type'] = 'conf';
        }
    }
    return obj;
}

function isJumbo (loan) {
    // TODO: finish this
    var jumbos = ['jumbo', 'agency', 'fha-hb', 'va-hb'],
        bounces = { 'fha-hb' : 'fha', 'va-hb': 'va' };
    
    var jumboTest = jumbo({
        loanType: loan['loan-type'],
        loanAmount: loan['loan-amount']
    });
        
    return false;
}

function isDownpaymentTooHigh (loan) {
    return loan['downpayment'] > loan['price'];
}

function isDownpaymentTooLow (loan) {
    switch (loan['loan-type']) {
        case 'conf':                
            return loan['downpayment'] < common.minDownpaymentPcts.conf * loan['price'];
            break;
        case 'fha':
        case 'fha-hb':
            return loan['downpayment'] < common.minDownpaymentPcts.fha * loan['price'];
            break;
        default:
            return false;
    }
}

function isPropLinked(prop) {
    var scenario = ScenarioStore.getScenario();
    return (scenario && $.inArray(prop, scenario.independentInputs) === -1);
}

var LoanStore = assign({}, EventEmitter.prototype, {
    /**
    * Get the entire collection of loans.
    * @return {object}
    */
    getAll: function() {
        return _loans;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
    * @param {function} callback
    */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
    * @param {function} callback
    */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// Initial setup on loans, using default scenario.
resetLoans();

// Register callback to handle all updates
LoanStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.actionType) {

        case LoanConstants.UPDATE_LOAN:
            // update both loans or single loan, dep. on whether the prop changed
            // is independent or linked in the current scenario
            if (isPropLinked(action.prop)) {
                updateAll(action.prop, action.val);
            } else {
                update(action.id, action.prop, action.val);
            }
            LoanStore.emitChange();
            break;
        
        case LoanConstants.UPDATE_ALL:
            updateAll(action.prop, action.val);
            LoanStore.emitChange();
            break;
            
        case LoanConstants.UPDATE_RATES:
            updateRates(action.id);
            LoanStore.emitChange();
            break;
        
        case ScenarioConstants.UPDATE_SCENARIO:

            AppDispatcher.waitFor([ScenarioStore.dispatchToken]);
            resetLoans(action.keepLoanData);
            LoanStore.emitChange();
            break;
            
        case ScenarioConstants.CUSTOM_SCENARIO:
        
            AppDispatcher.waitFor([ScenarioStore.dispatchToken]);
            resetLoans(action.keepLoanData);
            LoanStore.emitChange();
            break;
        
        default:
        // no op
    }
});

module.exports = LoanStore;