// Intelligent defaults
var getState = require('./geolocation');

var defaults = {
  // This is a hideous temporary hack. Need to figure out what to 
  // do if they haven't selected a state.
  state: localStorage.getItem('state') === 'AL' ? false : localStorage.getItem('state'),
  score: localStorage.getItem('score') ? localStorage.getItem('score').split(',') : undefined,
  type: localStorage.getItem('type'),
  price: localStorage.getItem('price'),
  down: localStorage.getItem('down')
};

var setScore = function() {
  $('#slider').slider( 'values', defaults.score );
};

var setState = function() {
  $('#location').val( defaults.state );
};

var setType = function() {
  $('#loan-type').val( defaults.type );
};

var setPrice = function() {
  $('#house-price').val( defaults.price );
};

var setDownPayment = function() {
  $('#down-payment').val( defaults.down );
};

var loadDefaults = function( cb ) {

  // If defaults are in local storage, set them.
  !defaults.score || setScore();
  !defaults.type || setType();
  !defaults.price || setPrice();
  !defaults.down || setDownPayment();

  // If a location default isn't set, geolocate the user.
  if ( defaults.state ) {

    setState();
    cb();

  } else {

    var loadState = function( pos ){
      defaults.state = getState( pos );
      localStorage.setItem( 'state', defaults.state );
      setState();
      cb();
    };

    var noLocation = function() {
      cb();
    };

    // Get their state using the HTML5 gelocation API.
    navigator.geolocation.getCurrentPosition( loadState, noLocation );

  }

};

var saveDefaults = function() {
  localStorage.setItem( 'state', $('#location').val() );
  localStorage.setItem( 'score', $('#slider').slider('values') );
  localStorage.setItem( 'type', $('#loan-type').val() );
  localStorage.setItem( 'price', $('#house-price').val() );
  localStorage.setItem( 'down', $('#down-payment').val() );
};

module.exports.load = loadDefaults;
module.exports.save = saveDefaults;
