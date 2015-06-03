var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var LoanConstants = require('../constants/loan-constants');
var ScenarioConstants = require('../constants/scenario-constants');
var assign = require('object-assign');
var jumbo = require('jumbo-mortgage');
var mortgageCalculations = require('../mortgage-calculations');
var common = require('../common');
var api = require('../api');
var $ = jQuery = require('jquery');
var ScenarioStore = require('./scenario-store');


var calculatedProperties = ['loan-summary', 'loan-amount'];
var calculatedPropertiesBasedOnIR = [
    'discount', 
    'processing',
    'lender-fees', 
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
    'state': 'AL'
};

var _loans = [];

function init () {
    resetLoans(true);
}

function resetLoans (init) {
    var len = _loans.length || 2;
    var scenario = ScenarioStore.getScenario();
    
    // if initial setup or a new scenario has been chosen, 
    // set data on loans
    if (init || scenario) {
        // get scenario-specific loan data
        var scenarioLoanData = scenario ? scenario.loanProps : {};
        
        // If we're moving into a scenario with existing loans,
        // make sure they have matching values by copying A's vals to B.
        // The scenario-specific differences will be set below.
        if (scenario && _loans[0] && _loans[1]) {
            assign(_loans[1], _loans[0]);
            _loans[1].id = 1;
        }
        
        // create each loan from default + current + scenario loan data,
        // then generate loan's calculated & state-based properties,
        // and finally fetch interest rates 
        for (i = 0; i < len; i++) {
            var currentLoanData = _loans[i];
            _loans[i] = assign({id: i}, defaultLoanData, currentLoanData, scenarioLoanData[i]);
            generateCalculatedProperties(_loans[i]);
            updateLoanState(_loans[i]);
            updateLoanRates(i);
        }
    }    
}

// update all the loans
function updateAllLoans(prop, val) {
    for (var id in _loans) {
        updateLoan(id, prop, val);
    }
}

// update a single loan
function updateLoan(id, prop, val) {
    var loan = _loans[id];
    var rateChange = (prop === 'interest-rate');
    
    loan[prop] = val;
    
    if (rateChange) {
        loan['edited'] = false;
    } else {
        loan['edited'] = true;
        if (loan['rate-request']) {
            updateLoanRates(id);
        }
    }
    generateCalculatedProperties(loan, rateChange);
    updateLoanState(loan);
}

function fetchRates(loan) {
    if (loan['rate-request']) {
        api.stopRequest(loan['rate-request']);
    }   
    return api.fetchRateData(loan);
}

function fetchIns(loan) {
    if (loan['mtg-ins-request']) {
        api.stopRequest(loan['mtg-ins-request']);
    }
    return api.fetchMortgageInsuranceData(loan);
}

function processRatesResults(results) {
    var rates = [];
    var totalRates = [];
    for (key in results.data) {
        if (results.data.hasOwnProperty(key)) {
            rates.push(key);
            var len = results.data[key];
            for (var i=0; i<len; i++){
                totalRates.push(key)
            }
        }
    }
    rates = rates.sort();
    var medianRate = common.median(rates) || 0;
    var processedRates = $.map(rates, function( rate, i ) {
        return {val: rate, label: rate + '%'};
    });
    return {vals: processedRates, median: medianRate};
}

function updateLoanRates(id) {
    var loans = $.isNumeric(id) ? [_loans[id]] : _loans;
    $.each(loans, function (ind, loan) {
        var dfd = fetchRates(loan);
        var insDfd = fetchIns(loan);
        dfd
            .done(function(results) {
                var rates = processRatesResults(results);
                loan['edited'] = false;
                loan['rates'] = rates.vals;
                loan['interest-rate'] = rates.median;
                generateCalculatedProperties(loan, true);
            });
        insDfd
            .done(function(results) {
                loan['mtg-ins-data'] = results.data;
             });
        $.when(dfd, insDfd)
            .done(function () {
                generateCalculatedProperties(loan, true);
            })
            .always(function() {
                    loan['rate-request'] = null;
                    loan['mtg-ins-request'] = null;
                // TODO: maybe this fetch should be an api action?
                LoanStore.emitChange();
            });
        loan['rate-request'] = dfd;
        loan['mtg-ins-request'] = insDfd;
    });  
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

function updateLoanState (loan) {
    isArm(loan);
    //loan['is-jumbo'] = isJumbo(loan);
    loan['downpayment-too-high'] = isDownpaymentTooHigh(loan);
    loan['downpayment-too-low'] = isDownpaymentTooLow(loan);
    return loan;
}

function isArm (loan) {
    loan['errors'] || (loan['errors'] = {});
    loan['is-arm'] = loan['rate-structure'] === 'arm';
    if (loan['is-arm']) {
        if ($.inArray(loan['loan-term'], common.armDisallowedOptions['loan-term']) >= 0) {
            loan.errors['loan-term'] = loan['loan-term'];
            loan['loan-term'] = '30';
        }
        if ($.inArray(loan['loan-type'], common.armDisallowedOptions['loan-type']) >= 0) {            
            loan.errors['loan-type'] = loan['loan-type'];
            loan['loan-type'] = 'conf';
        }
    } else {
        loan['errors']['loan-term'] = null;
        loan['errors']['loan-type'] = null;
    }
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
    return +loan['downpayment'] > +loan['price'];
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

// Register callback to handle all updates
LoanStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.actionType) {

        case LoanConstants.UPDATE_LOAN:
            // update both loans or single loan, dep. on whether the prop changed
            // is independent or linked in the current scenario
            if (isPropLinked(action.prop)) {
                updateAllLoans(action.prop, action.val);
            } else {
                updateLoan(action.id, action.prop, action.val);
            }
            LoanStore.emitChange();
            break;
        
        case LoanConstants.UPDATE_ALL:
            updateAllLoans(action.prop, action.val);
            LoanStore.emitChange();
            break;
            
        case LoanConstants.UPDATE_RATES:
            // update both loans if both are edited
            var id = action.id;
            var otherLoan = _loans[id == 1 ? 0 : 1];
            if (otherLoan.edited) {
                id = null;
            }
            updateLoanRates(id);
            LoanStore.emitChange();
            break;
        
        case ScenarioConstants.UPDATE_SCENARIO:
            AppDispatcher.waitFor([ScenarioStore.dispatchToken]);
            resetLoans();
            LoanStore.emitChange();
            break;
        
        default:
        // no op
    }
});

// INITIAL SETUP
init(true);

module.exports = LoanStore;