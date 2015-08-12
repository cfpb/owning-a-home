var $ = require('jquery');
var debounce = require('debounce');
var payment = require('./payment-calc');
var interest = require('./total-interest-calc');
var formatUSD = require('format-usd');
var unformatUSD = require('unformat-usd')
require('./local-storage-polyfill');
require('./secondary-nav');
require('jquery.scrollto');

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
    loanAmt = ( $('#loan-amount-value').val() ),
    // remove non-numeric characters (excluding period) from loanRate then parseFloat
    loanRate = parseFloat( $('#loan-interest-value').val().replace(/[^\d.]+/g,'') ),
    // store a USD formatted version
    formatted = formatUSD(loanAmt, {decimalPlaces: 0});

  // If field is blank (for instance, when page loads), use placeholder value
  if ( loanAmt === "" )  {
    loanAmt = $('#loan-amount-value').attr('placeholder');
    formatted = formatUSD(loanAmt, {decimalPlaces: 0});
  }
  if ( $('#loan-interest-value').val() === "" ) {
    loanRate = parseFloat( $('#loan-interest-value').attr('placeholder') );
  }

  // convert a currency string to an integer
  loanAmt = unformatUSD(loanAmt);
  // convert the term length to months
  termLength = termLength * 12;

  //if loanRate is still NaN, set it to 0 to prevent error in calculations
  if ( isNaN( loanRate ) ) {
    loanRate = 0;
  }

  // perform calculations
  var monthlyPayment = payment(loanRate, termLength, loanAmt),
      totalInterest = interest(loanRate, termLength, loanAmt);

  // add calculations to the dom
  $('#monthly-payment').html(monthlyPayment);
  $('#total-interest').html(totalInterest);
  // replace inputs with clean, formatted values
  $('#loan-amount-value').val(formatted);
  $('#loan-interest-value').val(loanRate + "%")

};

// update values on keyup
$('.value').on('keyup', debounce(loanToggle, 500));

function jumpToAnchorLink() {
  // check for hash value - hash is first priority
  var hash = window.location.hash.substr(1).toLowerCase(),
    re = /^[a-zA-Z\-0-9]*$/;

  // only allow letters, digits and - symbols in hashes
  if (!re.test(hash)) return;

  var  $el = $('#' + hash),
      $expandable = $el.closest('.expandable');

  if (hash !== "" && $expandable.length && !$expandable.hasClass('expandable__expanded')) {
    $expandable.find('.expandable_target')[0].click();
    $.scrollTo( $el, {
      duration: 600,
      offset: -30
    });
  }
}

$(document).ready( function() {
  jumpToAnchorLink();
  $(window).on('hashchange', function () {jumpToAnchorLink();});
});


