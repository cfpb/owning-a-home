var Financial = require('financial');
var formatUSD = require('./format-usd.js');

// calculate the total interest paid on a loan
module.exports = function(loanRate, termLength, loanAmt, startPeriod, endPeriod, type) {
  var totalInterest = Financial.CUMIPMT(loanRate / 100 / 12, termLength * 12, loanAmt, startPeriod, endPeriod * 12, type);
  return formatUSD(totalInterest);
};