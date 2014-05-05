// opts = {decimalPlaces: `number`}
var formatMoney = function(num, opts) {
  var opts = opts || {},
      decPlaces = isNaN(opts.decimalPlaces = Math.abs(opts.decimalPlaces)) ? 2 : opts.decimalPlaces,
      sign = num < 0 ? "-" : "",
      i = parseInt(num = Math.abs(+num || 0).toFixed(decPlaces)) + "",
      j = (j = i.length) > 3 ? j % 3 : 0;
  return sign + "$" + (j ? i.substr(0, j) + "," : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1,") + (decPlaces ? "." + Math.abs(num - i).toFixed(decPlaces).slice(2) : "");
};

module.exports = formatMoney;
