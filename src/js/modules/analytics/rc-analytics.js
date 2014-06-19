var track = require('./track');
var delay = require('./delay');

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
    var value = $(this).val();
    try{track('OAH rate tool', 'Select state', value);}
    catch( error ) {}
  });

  // house price
  $('#house-price').keyup(function() {
    var value = $(this).val();
    delay(function(){
      try{track('OAH rate tool', 'House price', value);}
      catch( error ) {}
    }, 900 );
  });

  // down payment percentage
  $('#percent-down').keyup(function() {
    var value = $(this).val();
    delay(function(){
      try{track('OAH rate tool', 'House price', value);}
      catch( error ) {}
    }, 900 );
  });

  // down payment $
  $('#down-payment').keyup(function() {
    var value = $(this).val();
    delay(function(){
      try{track('OAH rate tool', 'House price', value);}
      catch( error ) {}
    }, 900 );
  });

  // rate structure
  $('#rate-structure').on('change', function() {
    var value = $(this).val();
    try{track('OAH rate tool', 'Rate structure', value);}
    catch( error ) {}
  });

  // loan term
  $('#loan-term').on('change', function() {
    var value = $(this).val();
    try{track('OAH rate tool', 'Loan term', value);}
    catch( error ) {}
  });

  // loan type
  $('#loan-type').on('change', function() {
    var value = $(this).val();
    try{track('OAH rate tool', 'Loan type', value);}
    catch( error ) {}
  });

  // arm type
  $('#arm-type').on('change', function() {
    var value = $(this).val();
    try{track('OAH rate tool', 'ARM type', value);}
    catch( error ) {}
  });

  // discount points link
  $('#ask-discount-points').on('click', function() {
    try{track('OAH rate tool', 'Internal link ', '/askcfpb/136/what-are-discount-points-or-points.html');}
    catch( error ) {}
  });

  // discount points link
  $('#ask-rate-lock').on('click', function() {
    try{track('OAH rate tool', 'Internal link ', '/askcfpb/143/whats-a-lock-in-or-a-rate-lock.html');}
    catch( error ) {}
  });

});
