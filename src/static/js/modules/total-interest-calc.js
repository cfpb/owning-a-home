var LoanCalc = require('loan-calc');
var formatUSD = require('format-usd');

// calculate the total interest paid on a loan
var calcInterest = function(loanRate, termLength, loanAmt) {
  var totalInterest = LoanCalc.totalInterest({
    amount: loanAmt,
    rate: loanRate,
    termMonths: termLength
  });
  return formatUSD(totalInterest);
};

module.exports = calcInterest;