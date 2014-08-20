var debounce = require('debounce');
var cost = require('overall-loan-cost');
var objectify = require('objectified');
var formatUSD = require('format-usd');
var unFormatUSD = require('unformat-usd');
var isMoney = require('is-money-usd');
var positive = require('stay-positive');
var amortize = require('amortize');
var humanizeLoanType = require('./humanize-loan-type');

var loans = {};

function createNewForm( id ) {

  var loan = objectify('#lc-input-' + id, [
    {
      name: 'location',
      source: 'location'
    },{
      name: 'minfico',
      source: 'credit-score-select'
    },{
      name: 'maxfico',
      source: 'credit-score-select'
    },{
      name: 'amount-borrowed',
      source: 'house-price-input - down-payment-input'
    },{
      name: 'price',
      source: 'house-price-input'
    },{
      name: 'down-payment',
      source: 'down-payment-input'
    },{
      name: 'rate-structure',
      source: 'rate-structure-select'
    },{
      name: 'loan-term',
      source: 'loan-term-select'
    },{
      name: 'loan-type',
      source: 'loan-type-select'
    },{
      name: 'arm-type',
      source: 'arm-type-select'
    },{
      name: 'interest-rate',
      source: 'interest-rate-select'
    },{
      name: 'discount',
      source: function() {
        var points = $('#points-' + id + ' input:checked' ).val() / 100;
        return points * loan['amount-borrowed'];
      }
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
          totalTerm: loan['loan-term'] * 12,
          downPayment: loan['down-payment'],
          closingCosts: 3000 + loan['discount'] // hard coded $3000 value for now
        }).overallCost;
      }
    }
  ]);

  // Cache these for later
  var $amount = $('.loan-amount-display-' + id),
      $closing = $('.closing-costs-display-' + id),
      $monthly = $('.monthly-payment-display-' + id),
      $overall = $('.overall-costs-display-' + id),
      $interest = $('.interest-rate-display-' + id),
      $percent = $('#percent-down-input-' + id),
      $down = $('#down-payment-input-' + id),
      $summaryYear = $('#lc-summary-year-' + id),
      $summaryStruct = $('#lc-summary-structure-' + id),
      $summaryType = $('#lc-summary-type-' + id);

  // Keep track of the last down payment field that was accessed.
  var percentDownAccessedLast;

  function updateComparisons( changes ) {

    for ( var i = 0, len = changes.length; i < len; i++ ) {
      if ( changes[i].name == 'down-payment' && typeof percentDownAccessedLast !== 'undefined' && !percentDownAccessedLast ) {
        var val = loan['down-payment'] / loan['price'] * 100;
        $percent.val( Math.round(val) );
        percentDownAccessedLast = false;
      }
    }

    $amount.text( formatUSD(positive(loan['amount-borrowed']), {decimalPlaces:0}) );
    $closing.text( formatUSD(3000 + parseInt(loan['down-payment'], 10)) );
    $monthly.text( formatUSD(loan['monthly-payment'], {decimalPlaces:0}) );
    $overall.text( formatUSD(loan['overall-cost'], {decimalPlaces:0}) );
    $interest.text( loan['interest-rate'] );
    $closing.text( formatUSD(3000 + loan['discount'], {decimalPlaces:0}) );
    $summaryYear.text( loan['loan-term'] );
    $summaryStruct.text( loan['rate-structure'] );
    $summaryType.text( humanizeLoanType(loan['loan-type']) );

  }

  // Observe the loan object for changes
  Object.observe( loan, updateComparisons );

  function _updateDownPayment( ev ) {

    var val;

    if ( /percent/.test(ev.target.id) ) {
      val = $percent.val() / 100 * loan.price;
      loan.update();
      $down.val( Math.round(val) ).trigger('keyup');
      percentDownAccessedLast = true;
      return;
    }

    if ( /down\-payment/.test(ev.target.id) ) {
      percentDownAccessedLast = false;
    }

    if ( /house\-price/.test(ev.target.id) && percentDownAccessedLast !== undefined ) {
      if ( percentDownAccessedLast ) {
        val = $percent.val() / 100 * loan.price || 0;
        loan.update();
        $down.val( Math.round(val) ).trigger('keyup');
      } else {
        val = loan['down-payment'] / loan['price'] * 100 || 0;
        $percent.val( Math.round(val) );
      }
    }

  }

  // The pricing fields (price, dp, dp %) are wonky and require special handling.
  $('#lc-input-' + id).on( 'keyup', '.pricing input', _updateDownPayment );

  // update when the radio buttons are updated
  // todo: there's certainly a cleaner way to do this
  $('#points-' + id).on( 'click', 'input', function updatePoints() {
    loan.update();
  });

  loan.update();
  loans[ id ] = loan;

  return loans;

}

module.exports = createNewForm;