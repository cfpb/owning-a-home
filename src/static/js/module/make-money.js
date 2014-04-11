var Money = require('accounting');

module.exports = function(num) {
  num = Math.abs(num); // make a positive integer
  return Money.accounting.formatMoney(num); // turn integers into $USD formatted strings
};