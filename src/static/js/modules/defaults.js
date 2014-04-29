// Intelligent defaults
var getState = require('./geolocation');

var loadDefaults = function( cb ) {

  // Get their state using the HTML5 gelocation API.
  navigator.geolocation.getCurrentPosition( loadState, noLocation );

  function loadState( pos ){
    var state = getState( pos );
    $('#location').val( state );
    cb();
  }

  function noLocation() {
    cb();
  }

};

module.exports = loadDefaults;
