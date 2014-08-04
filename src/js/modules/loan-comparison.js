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
      var amortized = amortize({
        amount: loan['amount-borrowed'],
        rate: loan['interest-rate'],
        totalTerm: loan['loan-term'],
        amortizeTerm: 60
      });
      return amortized.payment;
    }
  },{
    name: 'overall-cost',
    source: function() {
      var overall = cost({
        amountBorrowed: loan['amount-borrowed'],
        rate: loan['interest-rate'],
        totalTerm: loan['loan-term'],
      });
      return overall.overallCost;
    }
  }
]);

function updateComparisons() {

  var $monthly = $('#monthly-payment span'),
      $overall = $('#overall-costs span');

  $monthly.text( formatUSD(loan['monthly-payment']) );
  $overall.text( formatUSD(loan['overall-cost']) );

  console.log(loan);

}

$('.comparisons').on( 'change keyup', '.recalc', debounce(updateComparisons, 500) );

// toggle the inputs on mobile
$('.lc-toggle').click(function(e) {
  e.preventDefault();
  var $parent = $(this).parents('.lc-comparison'),
      $inputs = $parent.find('.lc-inputs'),
      $editLink = $('.lc-edit-link');
  $inputs.toggleClass('input-open');
  $editLink.toggle();
});