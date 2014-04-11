var Financial = require('financial');
var MakeMoney = require('./make-money.js');

// calculate the amount of a monthly payment
module.exports = function(loanRate, termLength, loanAmt) {
  var monthlyPayment = Financial.PMT(loanRate / 100 / 12, termLength * 12, loanAmt);
  return MakeMoney(monthlyPayment);
};