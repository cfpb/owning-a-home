'use strict';

var $ = require( 'jquery' );
var debounce = require( 'debounce' );
var payment = require( './payment-calc' );
var interest = require( './total-interest-calc' );
var formatUSD = require( 'format-usd' );
var unformatUSD = require( 'unformat-usd' );
require( './local-storage-polyfill' );
require( '../../vendor/jquery.easing/jquery.easing.js' );
require( '../../vendor/cf-expandables/cf-expandables.js' );
require( 'jquery.scrollto' );

var $timelineLinks = $( '.term-timeline a' );

// Toggles for the term amounts
$timelineLinks.on( 'click', function( evt ) {
  evt.preventDefault();

  $timelineLinks.removeClass( 'current' );
  $( this ).addClass( 'current' );

  loanToggle();
} );

function loanToggle() {

  // get loan values
  var termLength = $( '.term-timeline .current' ).data( 'term' );
  var loanAmt = ( $( '#loan-amount-value' ).val() );
  // Remove non-numeric characters (excluding period) from loanRate then parseFloat.
  var loanRate = parseFloat( $( '#loan-interest-value' ).val().replace( /[^\d.]+/g, '' ) );
  // Store a USD formatted version.
  var formatted = formatUSD( loanAmt, { decimalPlaces: 0 } );

  // If field is blank (for instance, when page loads), use placeholder value
  if ( loanAmt === '' ) {
    loanAmt = $( '#loan-amount-value' ).attr( 'placeholder' );
    formatted = formatUSD( loanAmt, { decimalPlaces: 0 } );
  }
  if ( $( '#loan-interest-value' ).val() === '' ) {
    loanRate = parseFloat( $( '#loan-interest-value' ).attr( 'placeholder' ) );
  }

  // convert a currency string to an integer
  loanAmt = unformatUSD( loanAmt );
  // convert the term length to months
  termLength *= 12;

  // If loanRate is still NaN, set it to 0 to prevent error in calculations.
  if ( isNaN( loanRate ) ) {
    loanRate = 0;
  }

  // Perform calculations.
  var monthlyPayment = payment( loanRate, termLength, loanAmt );
  var totalInterest = interest( loanRate, termLength, loanAmt );

  // Add calculations to the dom.
  $( '#monthly-payment' ).html( monthlyPayment );
  $( '#total-interest' ).html( totalInterest );
  // Replace inputs with clean, formatted values.
  $( '#loan-amount-value' ).val( formatted );
  $( '#loan-interest-value' ).val( loanRate + '%' );

}

// Update values on keyup.
$( '.value' ).on( 'keyup', debounce( loanToggle, 500 ) );

// TODO: Investigate consolidating this with jumpToAnchorLink in process.js.
function jumpToAnchorLink() {
  // check for hash value - hash is first priority
  var hash = window.location.hash.substr( 1 ).toLowerCase();
  var re = /^[a-zA-Z\-0-9]*$/;

  // Only allow letters, digits and - symbols in hashes.
  if ( !re.test( hash ) ) { return; }

  var $el = $( '#' + hash );
  var $expandable = $el.closest( '.expandable' );

  if ( hash !== '' && $expandable.length && !$expandable.hasClass( 'expandable__expanded' ) ) {
    $expandable.find( '.expandable_target' )[0].click();
    $.scrollTo( $el, {
      duration: 600,
      offset:   -30
    } );
  }
}

$( document ).ready( function() {
  jumpToAnchorLink();
  $( window ).on( 'hashchange', function() { jumpToAnchorLink(); } );
} );
