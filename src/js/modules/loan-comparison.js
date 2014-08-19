var debounce = require('debounce');
var cost = require('overall-loan-cost');
var objectify = require('objectified');
var formatUSD = require('format-usd');
var unFormatUSD = require('unformat-usd');
var isMoney = require('is-money-usd');
var positive = require('stay-positive');
var amortize = require('amortize');
var humanizeLoanType = require('./humanize-loan-type');
var templates = {
  form: require('../templates/loan-form.hbs'),
  button: require('../templates/loan-add-button.hbs')
};
require('./object.observe-polyfill');

$('.lc-inputs .wrap').append( templates.form({form_id: 'a'}) );
$('.lc-inputs .wrap').append( templates.button() );
$('.add-btn').on('click', 'a', function(){
  $('#lc-add-button').before( templates.form({form_id: 'b'}) );
});

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
    name: 'discount',
    source: function() {
      var points = $( 'input:checked' ).val() / 100;
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

objectify.update();

// update when the radio buttons are updated
// todo: there's certainly a cleaner way to do this
$( 'input:radio' ).on( 'click', function() {
  objectify.update();
});

window.loan = loan;

// Cache these for later
var $amount = $('.loan-amount-display'),
    $closing = $('.closing-costs-display'),
    $monthly = $('.monthly-payment-display'),
    $overall = $('.overall-costs-display'),
    $interest = $('.interest-rate-display'),
    $percent = $('#percent-down-input'),
    $closing = $('.closing-costs-display'),
    $summaryYear = $('#lc-summary-year'),
    $summaryStruct = $('#lc-summary-structure'),
    $summaryType = $('#lc-summary-type');

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

  $amount.text( formatUSD( positive(loan['amount-borrowed']),{decimalPlaces:0}) );
  $closing.text( formatUSD( 3000 + parseInt(loan['down-payment'], 10)) );
  $monthly.text( formatUSD(loan['monthly-payment']) );
  $overall.text( formatUSD(loan['overall-cost']) );
  $interest.text( loan['interest-rate'] );
  $closing.text( formatUSD(3000 + loan['discount']) );
  $summaryYear.text( loan['loan-term'] );
  $summaryStruct.text( loan['rate-structure'] );
  $summaryType.text( humanizeLoanType(loan['loan-type']) );

}

// Observe the loan object for changes
Object.observe( loan, updateComparisons );

function _updateDownPayment( ev ) {

  var val;

  if ( /percent/.test(ev.target.id) ) {
    val = $('#percent-down-input').val() / 100 * loan.price;
    // objectify.update();
    $('#down-payment-input').val( Math.round(val) ).trigger('keyup');
    percentDownAccessedLast = true;
    return;
  }

  if ( /down\-payment/.test(ev.target.id) ) {
    percentDownAccessedLast = false;
  }

  if ( /house\-price/.test(ev.target.id) && percentDownAccessedLast !== undefined ) {
    if ( percentDownAccessedLast ) {
      val = $('#percent-down-input').val() / 100 * loan.price || 0;
      objectify.update();
      $('#down-payment-input').val( Math.round(val) ).trigger('keyup');
    } else {
      val = loan['down-payment'] / loan['price'] * 100 || 0;
      $('#percent-down-input').val( Math.round(val) );
    }
  }

}

// The pricing fields (price, dp, dp %) are wonky and require special handling.
$('.pricing').on( 'keyup', 'input', _updateDownPayment );

// toggle the inputs on mobile
$('.lc-toggle').click(function(e) {
  e.preventDefault();
  var $link = $(this).attr('href'),
      $inputs = $($link),
      $editLink = $('.lc-edit-link');
  $inputs.toggleClass('input-open');
  $editLink.toggle();
});
