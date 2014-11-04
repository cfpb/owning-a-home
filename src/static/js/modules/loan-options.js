var $ = require('jquery');
var debounce = require('debounce');
var payment = require('./payment-calc');
var interest = require('./total-interest-calc');
var formatUSD = require('format-usd');
var unformatUSD = require('unformat-usd')
require('./local-storage-polyfill');
require('./mega-expand');
require('./secondary-nav');
require('./nemo');
require('./nemo-shim');

var $timelineLinks = $('.term-timeline a');

// Toggles for the term amounts
$timelineLinks.on( 'click', function(e) {
  e.preventDefault();

  $timelineLinks.removeClass('current');
  $(this).addClass('current');

  loanToggle();
});

var loanToggle = function() {

  // get loan values
  var termLength = $('.term-timeline .current').data('term');
  
  // parseFloat to ingnore % signs, Use placeholder if field is blank
  var loanAmt = ( $('#loan-amount-value').val() );
  if ( loanAmt === "" )  loanAmt = $('#loan-amount-value').attr('placeholder');
  var loanRate = parseFloat( $('#loan-interest-value').val() );
  if ( $('#loan-interest-value').val() === "" ) loanRate = parseFloat( $('#loan-interest-value').attr('placeholder') );

  // store a USD formatted version
  var formatted = formatUSD(loanAmt, {decimalPlaces: 0});
  // convert a currency string to an integer
  loanAmt = unformatUSD(loanAmt);
  // convert the term length to months
  termLength = termLength * 12;

  // perform calculations
  var monthlyPayment = payment(loanRate, termLength, loanAmt),
      totalInterest = interest(loanRate, termLength, loanAmt);

  // add calculations to the dom
  $('#monthly-payment').html(monthlyPayment);
  $('#total-interest').html(totalInterest);
  $('#loan-amount-value').val(formatted);

};

// update values on keyup
$('.value').on('keyup', debounce(loanToggle, 500));
