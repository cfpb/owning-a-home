var positive = require('stay-positive');
var cost = require('overall-loan-cost');
var amortize = require('amortize');
var humanizeLoanType = require('../humanize-loan-type');

var mortgage = {};

mortgage['loan-amount'] = function (loan) {
    return loan['price'] - loan['downpayment'] || 0;
};

mortgage['discount'] = function (loan) {
    return (loan['points'] / 100) * loan['loan-amount'];
};

mortgage['downpayment-percent'] = function (loan) {
  return Math.round(+loan['downpayment'] / +loan['price'] * 100) || 0;
};

mortgage['downpayment'] = function (loan) {
  return Math.round((+loan['downpayment-percent'] / 100) * +loan['price']);
};

mortgage['processing'] = function (loan) {
    return loan['loan-amount'] / 100;
};

mortgage['third-party-services'] = function (loan) {
    return 3000;
};

mortgage['insurance'] = function (loan) {
    var upfront = loan['mtg-ins-data'].upfront;
    if (upfront) {
        return Math.round((upfront / 100) * loan['price']);
    }
    return 0;
};

mortgage['taxes-gov-fees'] = function (loan) {
    return 1000;
};

mortgage['prepaid-expenses'] = function (loan) {
    return 500;
};

mortgage['initial-escrow'] = function (loan) {
    return 500;
};

mortgage['monthly-taxes-insurance'] = function (loan) {
    var propertyTaxes = (loan['price'] / 100) / 12,
        homeInsurance = (.005 * loan['price']) / 12;
    return propertyTaxes + homeInsurance;
};

mortgage['monthly-hoa-dues'] = function (loan) {
    return 0;
};

mortgage['monthly-principal-interest'] = function (loan) {
    return amortize({
      amount: positive(loan['loan-amount']),
      rate: loan['interest-rate'],
      totalTerm: loan['loan-term'] * 12,
      amortizeTerm: 60 // @todo loan term * 12?
    }).payment;
};

mortgage['monthly-mortgage-insurance'] = function (loan) {
    var monthly = loan['mtg-ins-data'].monthly;
    if (monthly) {
        return Math.round((monthly / 100) * loan['price']);
    }
    return 0;
};

mortgage['monthly-payment'] = function (loan) {
    return loan['monthly-taxes-insurance']
            + loan['monthly-mortgage-insurance']
            + loan['monthly-hoa-dues']
            + loan['monthly-principal-interest'];
};

mortgage['closing-costs'] = function (loan) {
    return loan['downpayment']
            + loan['discount']
            + loan['processing']
            + loan['third-party-services']
            + loan['insurance']
            + loan['taxes-gov-fees']
            + loan['prepaid-expenses']
            + loan['initial-escrow'];
};

mortgage['get-cost'] = function (loan) {
    return cost({
        amountBorrowed: positive(loan['loan-amount']),
        rate: loan['interest-rate'],
        totalTerm: loan['loan-term'] * 12,
        downPayment: loan['downpayment'],
        closingCosts: loan['closing-costs']
    });
};

mortgage['principal-paid'] = function (loan) {
    return mortgage['get-cost'](loan).totalEquity;
};

mortgage['interest-fees-paid'] = function (loan) {
    return mortgage['get-cost'](loan).totalCost;
};

mortgage['overall-cost'] = function (loan) {
    return mortgage['get-cost'](loan).overallCost;
}

mortgage['loan-summary'] = function (loan) {
    if (loan['rate-structure'] === 'arm') {
        return loan['arm-type'].split('-').join('/') + ' ARM';
    } else {
        return loan['loan-term'] + '-year ' + loan['rate-structure'] + ' ' + humanizeLoanType(loan['loan-type']);
    }
};

module.exports = mortgage;