var LoanCalc = require('loan-calc');
var formatUSD = require('./format-usd');

// calculate the total interest paid on a loan
module.exports = function(loanRate, termLength, loanAmt) {
  var totalInterest = LoanCalc.totalInterest({
    amount: loanAmt,
    rate: loanRate,
    termMonths: termLength
});
  return formatUSD(totalInterest);
};