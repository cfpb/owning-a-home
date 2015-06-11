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
    'third-party-fees',
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

var validators;

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
            updateLoan(i);
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
    
    // If a prop was passed in, update it on the loan
    if (prop) {
        loan[prop] = val || null;
    }
    
    // Changing any loan property but interest-rate
    // will prompt user to request new rates.
    loan['edited'] = !rateChange;
    
    // Update dependencies & calculated properties
    // and validate loan based on changed prop.
    updateDependencies(loan, prop);
    validateLoan(loan);
    generateCalculatedProperties(loan, rateChange);
    
    // If a rate request is in progress, update it.
    if (loan['edited'] && loan['rate-request']) {
        updateLoanRates(id);
    }
}

function updateDependencies (loan, prop) {
    if (prop === 'price' || prop === 'downpayment') {
        loan['downpayment-percent'] = mortgageCalculations['downpayment-percent'](loan);
    } else if (!prop || prop === 'downpayment-percent') {
        loan['downpayment'] = mortgageCalculations['downpayment'](loan);        
    }
    return loan;
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
    var medianRate = common.median(totalRates) || 0;
    var processedRates = $.map(rates, function( rate, i ) {
        return {val: Number(rate), label: rate + '%'};
    });
    return {vals: processedRates, median: Number(medianRate)};
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

validators = {
    'loan-type': function (loan) {
        if (loan['rate-structure'] === 'arm' && $.inArray(loan['loan-type'], common.armDisallowedOptions['loan-type']) >= 0) {
            loan['loan-type'] = 'conf';
            return common.errorMessages['loan-type'];
        }
    },
    'loan-term': function (loan) {
        if (loan['rate-structure'] === 'arm' && $.inArray(loan['loan-term'], common.armDisallowedOptions['loan-term']) >= 0) {
            loan['loan-term'] = 30;
            return common.errorMessages['loan-term'];
        }
    },
    'downpayment': function (loan) {
        if (isDownpaymentTooHigh(loan)) {
            return common.errorMessages['downpayment-too-high'];
        } else if (isDownpaymentTooLow(loan)) {
            return common.errorMessages['downpayment-too-low' + '-' + loan['loan-type']];
        }
    }
}

function validateLoan (loan) {
    loan['errors'] = {};
    
    $.each(validators, function (prop, validator) {
        loan['errors'][prop] = validator(loan);
    });
    //loan['is-jumbo'] = isJumbo(loan);    
    return loan;
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
            return loan['downpayment'] < common.minDownpaymentPcts.fha * loan['price'];
            break;
        default:
            return false;
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
    },
    validators: validators
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