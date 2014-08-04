var debounce = require('debounce');
var cost = require('overall-loan-cost');
var objectify = require('cf-objectify');
var formatUSD = require('format-usd');
var unFormatUSD = require('unformat-usd');
var isMoney = require('is-money-usd');
var amortize = require('amortize');

var loan = objectify([
  {
    name: 'location',
    source: 'location'
  },{
    name: 'credit-score',
    source: 'credit-score'
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
  }
]);

function updateComparisons() {

  var $monthly = $('#monthly-payment span'),
      $overall = $('#overall-costs span'),
      costs = calcCosts();

  $monthly.text( formatUSD(costs.monthlyPayment) );
  $overall.text( formatUSD(costs.overallCost) );

  console.log(loan);

}

/**
 * Calculate loan costs given loan details provided by the user.
 * @return {object} monthly payment and overall cost of the loan
 */
function calcCosts() {

  var amortized,
      overall;

  amortized = amortize({
    amount: loan['amount-borrowed'],
    rate: loan['interest-rate'],
    totalTerm: loan['loan-term'],
    amortizeTerm: 60
  });

  overall = cost({
    amountBorrowed: loan['amount-borrowed'],
    rate: loan['interest-rate'],
    totalTerm: loan['loan-term'],
  });

  return {
    monthlyPayment: amortized.payment,
    overallCosts: overall.overallCost
  };

}

$('.comparisons').on( 'change keyup', '.recalc', debounce(updateComparisons, 500) );