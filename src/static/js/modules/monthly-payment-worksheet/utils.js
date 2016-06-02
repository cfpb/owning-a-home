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

utils.subtract = function (min, sub) {
  var m = utils.cleanNumber(min);
  var s = utils.cleanNumber(sub);
  return m ? m - s : 0;
}

utils.multiply = function (f1, f2) {
  var a = utils.cleanNumber(f1);
  var b = utils.cleanNumber(f2);
  return a && b ? a * b : 0;
}

utils.divide = function (num, denom) {
  var n = utils.cleanNumber(num);
  var d = utils.cleanNumber(denom);
  return (n && d) ? n / d : 0;
}

utils.roundBy = function (val, factor) {
  if (val > factor) {
    return Math.round(val/factor) * factor;
  }
  return val;
}

module.exports = utils;
