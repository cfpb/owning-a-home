var debounce = require('debounce');
var cost = require('overall-loan-cost');
var formatUSD = require('format-usd');
var unFormatUSD = require('unformat-usd');
var isMoney = require('is-money-usd');
var amortize = require('amortize');

function updateComparisons() {

  var $monthly = $('#monthly-payment span'),
      $overall = $('#overall-costs span'),
      loanInfo = getLoanInfo(),
      costs = calcCosts( loanInfo );

  $monthly.text( formatUSD(costs.monthlyPayment) );
  $overall.text( formatUSD(costs.overallCost) );

}

function getLoanInfo() {

  function _sanitizeMoney( val ) {
    return isMoney( val ) ? unFormatUSD( val ) : 0;
  }

  return {
    location: $('#location').val(),
    creditScore: $('#credit-score-select').val(),
    amountBorrowed: _sanitizeMoney( $('#house-price-input').val() - $('#down-payment-input').val() ),
    rateStructure: $('#rate-structure-select').val(),
    termLength: $('#loan-term-select').val(),
    loanType: $('#loan-type-select').val(),
    armType: $('#arm-type-select').val(),
    rate: $('#interest-rate-select').val()
  };

}

/**
 * Calculate loan costs given loan details provided by the user.
 * @return {object} monthly payment and overall cost of the loan
 */
function calcCosts( opts ) {

  var loan,
      overall;

  opts = opts || {};

  loan = amortize({
    amount: opts.amountBorrowed,
    rate: opts.rate,
    totalTerm: opts.termLength,
    amortizeTerm: 60
  });

  overall = cost({
    amountBorrowed: opts.amountBorrowed,
    rate: opts.rate,
    totalTerm: opts.termLength,
  });

  return {
    monthlyPayment: loan.payment,
    overallCosts: overall.overallCost
  };

}

$('.comparisons').on( 'change', '.recalc', updateComparisons );