'use strict';

// calculate the raw monthly payment
// pass the total amount of the loan, the APR, and the length of the loan in months
var paymentCalc = function(loanAmt, loanRate, loanTerm) {

  // monthly interest rate
  var monthlyRate = (loanRate/100)/12;

  // calculate the monthly payment
  // MonthlyPayment = Principal * ( MonthlyInterest / (1 - (1 + MonthlyInterest)^ -Months))
  return loanAmt * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -(loanTerm))));
};

// round numbers to two decimal places
var roundNum = function(num) {
  return Math.round(num * 100) / 100;
};

var cleanOpts = function(opts) {
  // clean up US currency formatted strings
  if (isNaN(opts.amount)) {
    opts.amount = parseFloat(opts.amount.replace(/[^0-9\.]+/g,''));
  }

  // throw errors for strings and unsupported numerical valuess
  if (typeof opts.amount === 'undefined' || isNaN(parseFloat(opts.amount)) || opts.amount <= 0) {
    throw new Error('Please specify a loan amount as a positive number');
  }

  if (typeof opts.rate === 'undefined' || isNaN(parseFloat(opts.rate)) || opts.rate < 0) {
    throw new Error('Please specify a loan rate as a number');
  }

  if (typeof opts.termMonths === 'undefined' || isNaN(parseFloat(opts.termMonths)) || opts.termMonths <= 0) {
    throw new Error('Please specify the length of the term as a positive number');
  }

  return {
    amount: opts.amount,
    rate: opts.rate,
    termMonths: opts.termMonths || 360
  };
};

// pass the amount of the loan, percentage rate, and length of the loan in months
exports.paymentCalc = function(opts) {

  opts = cleanOpts(opts);

  // calculate monthly payment
  var monthlyPayment = paymentCalc(opts.amount, opts.rate, opts.termMonths);

  // round the payment to two decimal places
  return roundNum(monthlyPayment);
};

exports.totalInterest = function(opts) {

  opts = cleanOpts(opts);

  // calculate the monthly payment
  var monthlyPayment = paymentCalc(opts.amount, opts.rate, opts.termMonths);

  // subtract the original loan amount from the total amount paid to get the raw interest paid
  var rawInterest = (monthlyPayment * opts.termMonths) - opts.amount;

  // round the value to two decimal places
  return roundNum(rawInterest);
};