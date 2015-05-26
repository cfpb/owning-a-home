var $ = jQuery = require('jquery');
var fetchRates = require('../rates');
var fetchMortgageInsurance = require('../mortgage-insurance');

var api = {};

api.fetchCounties = function (appState) {
    //dropdown('input-county').hideLoadingAnimation();
    return $.get(config.countyAPI, {
        state: appState['state']
    });
}

api.fetchRateData = function (loan) {      
    return fetchRates(prepLoanData(loan));
}

api.fetchMortgageInsuranceData =  function(loan) {
    return fetchMortgageInsurance(prepLoanDataForMtgIns(loan));
}

api.stopRequest = function (dfd) {
    if (dfd && typeof dfd === 'object') {
        dfd.abort();
    }
}

function prepLoanData(loan) {
    var minfico = parseInt(loan['credit-score']) || 0;
    return {
        price: loan['price'],
        loan_amount: loan['loan-amount'],
        minfico: minfico,
        maxfico: minfico + (minfico === 840 ? 10 : 19),
        state: loan['state'],
        rate_structure: loan['rate-structure'],
        loan_term: loan['loan-term'],
        loan_type: loan['loan-type'],
        arm_type: loan['arm-type'],
        points: loan['points']
    }
}

function prepLoanDataForMtgIns(loan) {
    var minfico = parseInt(loan['credit-score']) || 0;
    return {
        price: loan['price'],
        loan_amount: loan['loan-amount'],
        minfico: minfico,
        maxfico: minfico + (minfico === 840 ? 10 : 19),
        rate_structure: loan['rate-structure'],
        loan_term: loan['loan-term'],
        loan_type: loan['loan-type'],
        arm_type: loan['arm-type'],
        //@TODO: These are placeholders for the VA parameters, need to revisit
        va_status: 'REGULAR',
        va_first_use: 1
    }
}
module.exports = api;