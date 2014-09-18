var $ = require('jquery');
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

  // rate comparison select #1
  $('#rate-compare-1').on('change', function() {
    var value = $(this).val();
    try{track('OAH rate tool', 'Interest cost 1', value);}
    catch( error ) {}
  });

  // rate comparison select #2
  $('#rate-compare-2').on('change', function() {
    var value = $(this).val();
    try{track('OAH rate tool', 'Interest cost 1', value);}
    catch( error ) {}
  });

  // page reload link
  $('#reload-link').on('click', function() {
    try{track('OAH rate tool', 'Revert', '/owning-a-home/rate-checker');}
    catch( error ) {}
  });

  //comparison summary links
  $('#ask-rate-points').on('click', function() {
    try{track('Page Interactions', 'Internal link', '/askcfpb/136/what-are-discount-points-or-points.html');}
    catch( error ) {}
  });

  $('#ask-closing-costs').on('click', function() {
    try{track('Page Interactions', 'Internal link', '/askcfpb/139/what-are-closing-costs.html');}
    catch( error ) {}
  });

  $('#go-ask-cost').on('click', function() {
    try{track('Page Interactions', 'Internal link', '/askcfpb/153/what-costs-will-i-have-to-pay-as-part-of-taking-out-a-mortgage-loan.html');}
    catch( error ) {}
  });

  $('#ask-more-mortgages').on('click', function() {
    try{track('Page Interactions', 'Internal link', '/askcfpb/search/?selected_facets=category_exact:mortgages');}
    catch( error ) {}
  });

  // next steps: I plan to buy in the next couple of months
  $('#plan-to-buy-tab').on('click', function() {
    try{track('Page Interactions', 'Click', 'Collapsed_Tabs_Buying');}
    catch( error ) {}
  });

  $('#ask-gfe').on('click', function() {
    try{track('Page Interactions', 'Internal link', 'askcfpb/146/what-is-a-good-faith-estimate-what-is-a-gfe.html');}
    catch( error ) {}
  });

  // next steps: I won't buy for several months
  $('#wont-buy-tab').on('click', function() {
    try{track('Page Interactions', 'Click', 'Collapsed_Tabs_Not_Buying');}
    catch( error ) {}
  });

  $('#go-ask-credit-score').on('click', function() {
    try{track('Page Interactions', 'Internal link', '/askcfpb/315/what-is-my-credit-score.html');}
    catch( error ) {}
  });

  $('#go-ask-good-credit').on('click', function() {
    try{track('Page Interactions', 'Internal link', '/askcfpb/318/how-do-i-get-and-keep-a-good-credit-score.html');}
    catch( error ) {}
  });

  $('#go-ask-down-payment-affect').on('click', function() {
    try{track('Page Interactions', 'Internal link', '/askcfpb/120/what-kind-of-down-payment-do-i-need-how-does-the-amount-of-down-payment-i-make-affect-the-terms-of-my-mortgage-loan.html');}
    catch( error ) {}
  });

  // credit report alert
  $('#annualcreditreport').on('click', function() {
    try{track('Page Interactions', 'Exit link', 'https://www.annualcreditreport.com/index.action');}
    catch( error ) {}
  });

  $('#ask-dispute-credit-report').on('click', function() {
    try{track('Page Interactions', 'Internal link', '/askcfpb/314/how-do-i-dispute-an-error-on-my-credit-report.html');}
    catch( error ) {}
  });

  // about
  $('#informars').on('click', function() {
    try{track('Page Interactions', 'Exit link', 'https://www.informars.com/');}
    catch( error ) {}
  });

  $('#about-email-link').on('click', function() {
    try{track('Page Interactions', 'Email', 'mailto:owning-a-home@cfpb.gov');}
    catch( error ) {}
  });

});