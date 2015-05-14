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


module.exports = api;