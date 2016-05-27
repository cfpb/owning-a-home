'use strict';

var utils = {};

utils.cleanNumber = function (num) {
  num = num ? num.toString().replace(/,/g,'') : '';
  return parseFloat(num) || 0;
}

utils.sum = function (arr) {
  var result = 0;
  for (var i = 0; i < arr.length; i++) {
    result += utils.cleanNumber(arr[i]);
  }
  return result || '';
}

utils.roundBy = function (val, factor) {
  if (val > factor) {
    return Math.floor(val/factor) * factor;
  }
  return val;
}

module.exports = utils;
