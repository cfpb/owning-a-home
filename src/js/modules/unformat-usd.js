var unFormatUSD = function( str ) {
  if ( typeof str === 'string' ) {
    return parseFloat( str.replace(/[,\$]/g, '') );
  }
  return str;
};

module.exports = unFormatUSD;