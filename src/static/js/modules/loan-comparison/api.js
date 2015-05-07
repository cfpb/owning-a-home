var $ = jQuery = require('jquery');
var fetchRates = require('../rates');

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

api.stopRequest = function (dfd) {
    if (dfd && typeof dfd === 'object') {
        dfd.abort();
    }
}

function prepLoanData(loan) {
    return {
        price: loan['price'],
        loan_amount: loan['loan-amount'],
        minfico: loan['minfico'],
        maxfico: loan['maxfico'],
        state: loan['state'],
        rate_structure: loan['rate-structure'],
        loan_term: loan['loan-term'],
        loan_type: loan['loan-type'],
        arm_type: loan['arm-type'],
        points: loan['points']
    }
}


module.exports = api;