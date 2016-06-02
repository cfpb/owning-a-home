'use strict';

var utils = {};

utils.cleanNumber = function (num) {
  num = num ? num.toString().replace(/,/g,'') : '';
  return utils.ensureNumber(num);
}

utils.ensureNumber = function (num) {
  return parseFloat(num) || 0;
}

utils.sum = function () {
  var result = 0;
  for (var i = 0; i < arguments.length; i++) {
    result += utils.ensureNumber(arguments[i]);
  }
  return result;
}

utils.subtract = function (min, sub) {
  var m = utils.ensureNumber(min);
  var s = utils.ensureNumber(sub);
  return m ? m - s : 0;
}

utils.multiply = function (f1, f2) {
  var a = utils.ensureNumber(f1);
  var b = utils.ensureNumber(f2);
  return a && b ? a * b : 0;
}

utils.divide = function (num, denom) {
  var n = utils.ensureNumber(num);
  var d = utils.ensureNumber(denom);
  return (n && d) ? n / d : 0;
}

utils.roundBy = function (val, factor) {
  if (val > factor) {
    return Math.round(val/factor) * factor;
  }
  return val;
}

module.exports = utils;
