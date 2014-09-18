var guessState = require('fuzzy-state-search');

module.exports.getState = function ( options, callback ) {

  if (!window.navigator.geolocation) {
    return closestState = {
      name: 'AL'
    };
  }

  var opts = options || {},
      timeout = opts.timeout || 10000,
      cb = typeof options === 'function' ? options : callback,
      reallyIndecisive = true;

  function success( pos ){
    var state = guessState( pos );
    reallyIndecisive = false;
    if ( cb ) {
      cb( state );
    }
  }

  function fail() {
    cb();
  }

  // Get their state using the HTML5 gelocation API.
  navigator.geolocation.getCurrentPosition( success, fail );

  // For users who don't see the geolocate permission bar in their
  // browser, fail after X milliseconds.
  setTimeout(function(){
    if ( reallyIndecisive ) {
      fail();
    }
  }, timeout);

};