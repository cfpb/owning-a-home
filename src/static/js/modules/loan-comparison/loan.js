var $ = jQuery = require('jquery');

var jumbo = require('jumbo-mortgage');
var loanUI = require('./loan-ui');
var api = require('./api');
var common = require('./common');
var mortgageCalculations = require('./mortgage-calculations');

var loans = [];

var defaultLoan = {
    'credit-score': 700,
    'downpayment': 20000,
    'price': 400000,
    'rate-structure': 'fixed',
    'points': 0,
    'loan-term': 30,
    'loan-type': 'conf',
    'arm-type': '5-1',
    'state': 'CA'
};


function resetLoans (scenario) {
    for (var i = 0; i < common.loanCount; i ++) {
        loans[i] || (loans[i] = {id: i});
    }
    return loans;
}

function resetLoan (loan, scenario) { 
    var props = scenario ? scenario.loanProps : defaultLoan;  
     
    // stop any current requests on loan
    api.stopRequest(loan['rate-request']);
    
    // set new data on loan
    var id = loan.id;
    loan = $.extend({id: id}, props);
    
    updateDependentProperties(loan);
    updateLoanCalculations(loan);

    var dfd = api.fetchRateData(loan);
    return loan;
}

function isArm (loan) {
    return loan['rate-structure'] === 'arm';
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

function updateLoanProperty (loan, prop, val) {
    var rateChange = (prop === 'interest-rate' || prop === 'rate-request');
    
    loan[prop] = val;
    
    // make updates to dependent properties and state
    // based on the changed property
    if (rateChange) {
        loan['edited'] = false;
    } else {
        loan['edited'] = true;
        updateDependentProperties(loan, prop);
        // if we're in the middle of a rates request, restart it
        if (loan['rate-request']) {
            api.fetchRateData(loan);
        }
        updateLoanState(loan, prop);
    }
    
    updateLoanCalculations(loan, rateChange);
    loanUI.updateLoanOutputs(loan, rateChange);
}

function updateLoanState (loan, prop) {
    switch (prop) {
        case 'edited': 
            loan['interest-rate'] = null;
            loanUI.interestRate(loan);
            break;
        case 'rate-structure':
            loan['is-arm'] = isArm(loan);
            loanUI.arm(loan);
            break;
        case 'loan-type':
        case 'loan-amount':
            loan['is-jumbo'] = isJumbo(loan);
            loanUI.jumbo(loan);
        case 'loan-type':
        case 'downpayment':
        case 'downpayment-percent':
        case 'price':
            var tooHigh = isDownpaymentTooHigh(loan);
            loan['downpayment-too-high'] = tooHigh;
            if (!tooHigh) {
                loan['downpayment-too-low'] = isDownpaymentTooLow(loan);
            }
            loanUI.downpayment(loan);
    }
}

function getRates (loan) {
    api.stopRequest(loan['rate-request']);
    var dfd = api.fetchRateData
        .done(function(results) {
            updateRates(loan, results.data);
        })
        .always(function() {
            updateLoanProperty(loan, 'rate-request');
        }); 
        
    updateLoanProperty(loan, 'rate-request', dfd);
}

function updateRates (loan, rates) {
    updateLoanProp(loan, 'interest-rate', rateOptions[0].val);
    loanUI.updateRateSelect(loan, rates);
}

function updateLoanCalculations (loan, rateChange) {
    var outputs = rateChange ? loanUI.calculatedOutputsBasedOnIR : 
                               loanUI.calculatedOutputs;
    $.each(outputs, function (ind, val) {
        loan[val] = mortgageCalculations[val](loan);
    });
}

// Update property dependencies.
function updateDependentProperties(loan, changedProps) {
    changedProps || (changedProps = ['downpayment', 'credit-score']);
    $.isArray(changedProps) || (changedProps = [changedProps]);
    
    $.each(changedProps, function (ind, prop) {
        switch (prop) {
            case 'price':
            case 'downpayment':
                updateDownpayment(loan, 'downpayment-percent');
                break;
            case 'downpayment-percent':
                updateDownpayment(loan, 'downpayment');
                break;
            case 'credit-score':
                updateCreditScore(loan);
                break;
        }
    });
}

// Keep downpayment & price inputs in sync.
function updateDownpayment(loan, prop) {
    loan[prop] = mortgageCalculations[prop](loan);
    loanUI.updateDownpaymentUI(loan, prop);
}

// Parse credit score.
function updateCreditScore (loan) {
    var minfico = parseInt(loan['credit-score']) || 0;
    loan['minfico'] = minfico;
    loan['maxfico'] = minfico + (minfico === 840 ? 10 : 19);
}

function updateSharedProperty(prop, val) {
    $.each(loans, function (loan) {
        updateLoanProperty(loan, prop, val);
    });
}

module.exports = {
    updateSharedProperty: updateSharedProperty,
    updateLoanProperty: updateLoanProperty,
    resetLoans: resetLoans,
    resetLoan: resetLoan,
    loans: loans
};