var debounce = require('debounce');
var cost = require('overall-loan-cost');
var objectify = require('cf-objectify');
var formatUSD = require('format-usd');
var unFormatUSD = require('unformat-usd');
var isMoney = require('is-money-usd');
var amortize = require('amortize');
require('./object.observe-polyfill');

var loan = objectify([
  {
    name: 'location',
    source: 'location'
  },{
    name: 'minfico',
    source: 'credit-score'
  },{
    name: 'maxfico',
    source: 'credit-score + 20'
  },{
    name: 'amount-borrowed',
    source: 'house-price - down-payment'
  },{
    name: 'down-payment',
    source: 'down-payment'
  },{
    name: 'rate-structure',
    source: 'rate-structure'
  },{
    name: 'loan-term',
    source: 'loan-term'
  },{
    name: 'loan-type',
    source: 'loan-type'
  },{
    name: 'arm-type',
    source: 'arm-type'
  },{
    name: 'interest-rate',
    source: 'interest-rate'
  },{
    name: 'monthly-payment',
    source: function() {
      return amortize({
        amount: loan['amount-borrowed'],
        rate: loan['interest-rate'],
        totalTerm: loan['loan-term'] * 12,
        amortizeTerm: 60
      }).payment;
    }
  },{
    name: 'overall-cost',
    source: function() {
      return cost({
        amountBorrowed: loan['amount-borrowed'],
        rate: loan['interest-rate'],
        totalTerm: loan['loan-term'],
      }).overallCost;
    }
  }
]);

// Cache these for later
var $monthly = $('.monthly-payment-display'),
    $overall = $('.overall-costs-display'),
    $amount = $('.loan-amount-display');

function updateComparisons( changes ) {

  // Take care of special use cases by monitoring the object's changes.
  // The down payment and percent down fields are wonky and require special handling.
  for ( var i = 0, len = changes.length; i < len; i++ ) {
    var $el,
        val;
    console.log(changes[i]);
    
    if ( changes[i].name === 'percent-down' ) {
      $el = $('#percent-down-input');
      val = unFormatUSD( $el.val() || $el.attr('placeholder') );
      val = val / 100 * loan.price;
      $('#down-payment-input').val( val ).trigger('change');
    }
    if ( changes[i].name === 'down-payment' ) {
      $el = $('#down-payment-input');
      val = unFormatUSD( $el.val() || $el.attr('placeholder') );
      val = Math.round( val * 100 ) / 100;
      $('#percent-down-input').val( val ).trigger('change');
    }
  }

  $monthly.text( formatUSD(loan['monthly-payment']) );
  $overall.text( formatUSD(loan['overall-cost']) );
  $amount.text( formatUSD(loan['amount-borrowed'],{decimalPlaces:0}) );

  window.loan = loan;

}

Object.observe( loan, updateComparisons );

// The down payment and percent down fields are wonky
// $('#percent-down').on('keyup', function(){
//   var val = $( this ).val() / 100 * loan.price;
//   formalize.update();
  
// });

// $('#down-payment').on('keyup', function(){
//   var val = $( this ).val() / loan.price * 100;
  
// });

// $('.comparisons').on( 'change keyup', '.recalc', debounce(updateComparisons, 500) );

// toggle the inputs on mobile
$('.lc-toggle').click(function(e) {
  e.preventDefault();
  var $parent = $(this).parents('.lc-comparison'),
      $inputs = $parent.find('.lc-inputs'),
      $editLink = $('.lc-edit-link');
  $inputs.toggleClass('input-open');
  $editLink.toggle();
});