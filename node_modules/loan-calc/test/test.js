var LoanCalc = require('../index.js');

// test that we're calculating the correct monthly payment
exports['A 30 year, $100,000 loan with a 6% interest rate should be repaid at $599.55 per month'] = function (test) {
  test.equal(LoanCalc.paymentCalc({amount: 100000, rate: 6, termMonths: 360}), 599.55);
  test.done();
};

exports['A 15 year, $200,000 loan with a 5% interest rate should be repaid at $1,581.59 per month'] = function (test) {
  test.equal(LoanCalc.paymentCalc({amount: 200000, rate: 5, termMonths: 180}), 1581.59);
  test.done();
};

exports['A 15 year, $389,253 loan with a 5.3% interest rate should be repaid at $3,139.36 per month'] = function (test) {
  test.equal(LoanCalc.paymentCalc({amount: 389253, rate: 5.3, termMonths: 180}), 3139.36);
  test.done();
};

// test that we're calculating the correct total interest paid
exports['A 30 year, $200,000 loan with a 5% interest rate should have a total interest of $186,511.57'] = function (test) {
  test.equal(LoanCalc.totalInterest({amount: 200000, rate: 5, termMonths: 360}), 186511.57);
  test.done();
};

exports['A 40 year, $200,000 loan with a 5% interest rate should have a total interest of $262,908.74'] = function (test) {
  test.equal(LoanCalc.totalInterest({amount: 200000, rate: 5, termMonths: 480}), 262908.74);
  test.done();
};

exports['A 15 year, $389,253 loan with a 5.3% interest rate should have a total interest of $175,831.99'] = function (test) {
  test.equal(LoanCalc.totalInterest({amount: 389253, rate: 5.3, termMonths: 180}), 175831.99);
  test.done();
};

exports['Accept a loan ammount in US currency format'] = function (test) {
  test.equal(LoanCalc.totalInterest({amount: '$200,000', rate: 5, termMonths: 480}), 262908.74);
  test.done();
};

// error checks
exports['Throw an error if a string is passed'] = function (test) {
  test.throws(function() {
    LoanCalc.paymentCalc({amount: 'hello', rate: 5, termMonths: 480});
  },
  Error, 'Please specify a loan amount as a positive number');
  test.done();
};

exports['Throw an error if a string is passed even when it contains currency symbols'] = function (test) {
  test.throws(function() {
    LoanCalc.paymentCalc({amount: '$hello, friend', rate: 5, termMonths: 480});
  },
  Error, 'Please specify a loan amount as a positive number');
  test.done();
};

exports['Throw an error if a negative value is passed'] = function (test) {
  test.throws(function() {
    LoanCalc.paymentCalc({amount: -300000, rate: 5, termMonths: 360});
  },
  Error, 'Please specify a loan amount as a positive number');
  test.done();
};