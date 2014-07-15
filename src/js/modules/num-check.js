/**
 * Check if a value is a number/currency
 * @param  val
 * @return boolean
 */
module.exports = function(val) {

  var numReg = new RegExp('^\\$?[0-9\\.,]+([0-9]+%)?$');

  if (numReg.test(val)) {
    return true;
  } else {
    return false;
  }
};