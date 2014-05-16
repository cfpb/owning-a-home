var $ = require('jquery');
var debounce = require('debounce');
var payment = require('./payment-calc');
var interest = require('./total-interest-calc');
require('./local-storage-polyfill');
require('./mega-expand');
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
  var termLength = $('.term-timeline .current').data('term'),
      loanAmt = $('#loan-amount-value').val(),
      // parseFloat to ingnore % signs
      loanRate = parseFloat($('#loan-interest-value').val());

  // convert a currency string to an integer
  loanAmt = Number(loanAmt.replace(/[^0-9\.]+/g,''));

  // convert the term length to months
  termLength = termLength * 12;

  // perform calculations
  var monthlyPayment = payment(loanRate, termLength, loanAmt),
      totalInterest = interest(loanRate, termLength, loanAmt);

  // add calculations to the dom
  $('#monthly-payment').html(monthlyPayment);
  $('#total-interest').html(totalInterest);

};

// update values on keyup
$('.value').on('keyup', debounce(loanToggle, 500));