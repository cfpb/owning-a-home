var supportsAccessors = (function supportsAccessors() {
  var obj = {};
  if ( !Object.defineProperty ) {
    return false;
  }
  try {
    Object.defineProperty( obj, 'foo', {} );
    return 'foo' in obj;
  } catch ( e ) {}
})();

// Force it to boolean, we don't want no `undefined` tomfoolery.
module.exports = supportsAccessors ? true : false;