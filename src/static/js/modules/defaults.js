// Intelligent defaults
var getState = require('./geolocation');

var defaults = {
  state: localStorage.getItem( 'state' )
};

var loadDefaults = function( cb ) {

  if ( defaults.state ) {
    setState();
    return cb();
  }

  // Get their state using the HTML5 gelocation API.
  navigator.geolocation.getCurrentPosition( loadState, noLocation );

  function loadState( pos ){
    defaults.state = getState( pos );
    localStorage.setItem( 'state', defaults.state );
    setState();
    cb();
  }

  function noLocation() {
    cb();
  }

  function setState() {
    $('#location').val( defaults.state );
  }

};

module.exports = loadDefaults;