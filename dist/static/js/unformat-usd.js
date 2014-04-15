var unFormatUSD = function(str) {
  return parseFloat(str.replace(/[,\$]/g, ''));
};

module.exports = unFormatUSD;
