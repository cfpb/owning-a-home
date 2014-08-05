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
    name: 'price',
    source: 'house-price'
  },{
    name: 'percent-down',
    source: 'percent-down'
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

objectify.update();

window.loan = loan;

// Cache these for later
var $amount = $('.loan-amount-display'),
    $closing = $('.closing-costs-display'),
    $monthly = $('.monthly-payment-display'),
    $overall = $('.overall-costs-display');

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
      val = parseFloat( val, 10 ) / 100 * loan['price'];
      $('#down-payment-input').val( val ).trigger('change');
    }
    if ( changes[i].name === 'down-payment' ) {
      $el = $('#down-payment-input');
      val = unFormatUSD( $el.val() || $el.attr('placeholder') );
      val = val / unFormatUSD( $('#house-price-input').val() ) * 100;
      val = Math.round( val * 10 ) / 10;
      console.log(val);
      $('#percent-down-input').val( val ).trigger('change');
    }
  }

  $amount.text( formatUSD(loan['amount-borrowed'],{decimalPlaces:0}) );
  $closing.text( formatUSD( 3000 + parseInt(loan['down-payment'], 10)) );
  $monthly.text( formatUSD(loan['monthly-payment']) );
  $overall.text( formatUSD(loan['overall-cost']) );
  

}

// Observe the loan object for changes
Object.observe( loan, updateComparisons );

// toggle the inputs on mobile
$('.lc-toggle').click(function(e) {
  e.preventDefault();
  var $parent = $(this).parents('.lc-comparison'),
      $inputs = $parent.find('.lc-inputs'),
      $editLink = $('.lc-edit-link');
  $inputs.toggleClass('input-open');
  $editLink.toggle();
});