var LoanCalc = require('loan-calc');
var MakeMoney = require('./make-money.js');

// calculate the amount of a monthly payment
module.exports = function(loanRate, termLength, loanAmt) {
  var monthlyPayment = LoanCalc.paymentCalc({
    amount: loanAmt,
    rate: loanRate,
    termMonths: termLength
});
  return MakeMoney(monthlyPayment);
};