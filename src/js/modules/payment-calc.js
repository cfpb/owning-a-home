var loanCalc = require('loan-calc');
var formatUSD = require('./format-usd.js');

// calculate the amount of a monthly payment
module.exports = function(loanRate, termLength, loanAmt) {
  var monthlyPayment = loanCalc.paymentCalc({
      amount: loanAmt,
      rate: loanRate,
      termMonths: termLength
    });
  return formatUSD(monthlyPayment);
};
