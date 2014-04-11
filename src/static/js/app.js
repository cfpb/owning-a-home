var $ = require('jquery');
module.exports = window.jQuery;
var Payment = require('./payment-calc');
var TotalInterest = require('./total-interest-calc');

$(document).ready(function() {

  'use strict';

  var $timelineLinks = $('.term-timeline a');

  // Toggles for the term amounts
  $timelineLinks.on( 'click', function(e) {
    e.preventDefault();

    $timelineLinks.removeClass('current');
    $(this).addClass('current');

    loanToggle();

  });

  // update values on keyup
  $('.value').keyup(function(event) {
    loanToggle();
  });

  var loanToggle = function() {

    // get loan values
    var termLength = $('.current').data('term'),
        loanAmt = $('#loan-amount-value').val(),
        // parseFloat to ingnore % signs
        loanRate = parseFloat($('#loan-interest-value').val());

    // convert a currency string to an integer
    loanAmt = Number(loanAmt.replace(/[^0-9\.]+/g,''));

    // perform calculations
    var monthlyPayment = Payment(loanRate, termLength, loanAmt),
        totalInterest = TotalInterest(loanRate, termLength, loanAmt, 1, termLength, 0);

    // add calculations to the dom
    $('#monthly-payment').html(monthlyPayment);
    $('#total-interest').html(totalInterest);

  };

});