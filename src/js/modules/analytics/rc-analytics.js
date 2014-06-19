// Add in Google Analytics tracking check wrapper
// http://ejohn.org/blog/fixing-google-analytics-for-ghostery/
var track = function(category, name, value) {
  if (window._gaq) {
    window._gaq.push(['_trackEvent', category, name, value]);
  }
}; // End Google Analytics tracking check

// delay helper
// http://stackoverflow.com/questions/1909441/jquery-keyup-delay
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

$(document).ready(function() {

  // beta sign up button
  $('#beta-btn').on('click', function() {
    try{track('Page Interactions', 'Sign up', 'beta group');}
    catch( error ) {}
  });

  // credit score slider
  $('.rangeslider__handle, .rangeslider__fill').mouseup(function() {
    var score = $('#slider-range').text();
    try{track('OAH rate tool', 'Score range', score);}
    catch( error ) {}
  });

  // credit score learn more
  $('#ask-cfpb-credit').on('click', function() {
    try{track('OAH rate tool', 'Internal link', '/askcfpb/319/how-does-my-credit-score-affect-my-ability-to-get-a-mortgage-loan.html');}
    catch( error ) {}
  });

  // state select
  $('#location').on('change', function() {
    var state = $(this).val();
    try{track('OAH rate tool', 'Select state', state);}
    catch( error ) {}
  });

  // house price
  $('#house-price').keyup(function() {
    var price = $(this).val();
    delay(function(){
      try{track('OAH rate tool', 'House price', price);}
      catch( error ) {}
    }, 900 );
  });

  // down payment percentage
  $('#percent-down').keyup(function() {
    var price = $(this).val();
    delay(function(){
      try{track('OAH rate tool', 'House price', price);}
      catch( error ) {}
    }, 900 );
  });

  // down payment $
  $('#down-payment').keyup(function() {
    var price = $(this).val();
    delay(function(){
      try{track('OAH rate tool', 'House price', price);}
      catch( error ) {}
    }, 900 );
  });

});
