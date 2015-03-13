var $ = require('jquery');
var debounce = require('debounce');
var cost = require('overall-loan-cost');
var objectify = require('objectified');
var formatUSD = require('format-usd');
var unFormatUSD = require('unformat-usd');
var isMoney = require('is-money-usd');
var positive = require('stay-positive');
var amortize = require('amortize');
var humanizeLoanType = require('./humanize-loan-type');
var supportsAccessors = require('./supports-accessors');
var fetchRates = require('./rates');


var loans = {};
var editableFields = ['location', 'minfico', 'maxfico', 'amount-borrowed', 'price', 'discount', 'down-payment', 'rate-structure', 'loan-term', 'loan-type', 'arm-type'];

function createNewForm( id, loanData ) {

  var loan = objectify('#lc-input-' + id, [
    {
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
      source: function() {
        return $('#arm-type-select-' + id).val();
      }
    },{
      name: 'interest-rate',
      source: 'interest-rate-select'
    },{
      name: 'raw-discount',
      source: function() {
        return $('#points-' + id + ' input:checked' ).val();
      }
    },{
      name: 'discount',
      source: function() {
        var points = loan['raw-discount'] / 100;
        return points * loan['amount-borrowed'];
      }
    },{
      name: 'monthly-payment',
      source: function() {
        return amortize({
          amount: positive( loan['amount-borrowed'] ),
          rate: loan['interest-rate'],
          totalTerm: loan['loan-term'] * 12,
          amortizeTerm: 60
        }).payment;
      }
    },{
      name: 'overall-cost',
      source: function() {
        return cost({
          amountBorrowed: positive( loan['amount-borrowed'] ),
          rate: loan['interest-rate'],
          totalTerm: loan['loan-term'] * 12,
          downPayment: loan['down-payment'],
          closingCosts: 3000 + loan['discount'] // hard coded $3000 value for now
        }).overallCost;
      }
    }
  ]);

  // Cache these for later
  var $form = $('#lc-input-' + id),
      $rateSelect = $('#interest-rate-select-' + id),
      $amount = $('.loan-amount-display-' + id),
      $closing = $('.closing-costs-display-' + id),
      $monthly = $('.monthly-payment-display-' + id),
      $overall = $('.overall-costs-display-' + id),
      $interest = $('.interest-rate-display-' + id),
      $percent = $('#percent-dp-input-' + id),
      $down = $('#down-payment-input-' + id),
      $discount = $('.discount-' + id),
      $summaryYear = $('.lc-summary-year-' + id),
      $summaryStruct = $('.lc-summary-structure-' + id),
      $summaryType = $('.lc-summary-type-' + id);

  // Keep track of the last down payment field that was accessed.
  var percentDownAccessedLast;
  
  // Keep track of any api rate request in progress
  var currentRequest;

  function updateComparisons( changes ) {
    var loanDataChanged = false;
    
    for ( var i = 0, len = changes.length; i < len; i++ ) {
      if ( changes[i].name == 'down-payment' && typeof percentDownAccessedLast !== 'undefined' && !percentDownAccessedLast ) {
        var val = loan['down-payment'] / loan['price'] * 100;
        $percent.val( Math.round(val) );
        percentDownAccessedLast = false;
      }
      // If a user-editable field has changed, rate needs updating
      if (!loanDataChanged && ($.inArray(changes[i].name, editableFields) !== -1)) {
        loanDataChanged = true;
      }
    }
    
    if (loanDataChanged) {
      if (currentRequest) {
        getRateData();
      } else {
        $form.removeClass('updating').addClass('update');
      }
    }

    updateLoanDisplay();
  }
  
  function updateLoanDisplay () {
    $amount.text( formatUSD(positive(loan['amount-borrowed']), {decimalPlaces:0}) );
    $closing.text( formatUSD(3000 + parseInt(loan['down-payment'], 10) + loan['discount'], {decimalPlaces:0}) );
    $monthly.text( formatUSD(loan['monthly-payment'], {decimalPlaces:0}) );
    $overall.text( formatUSD(loan['overall-cost'], {decimalPlaces:0}) );
    $interest.text( loan['interest-rate'] );
    $discount.text( loan['raw-discount']);
    $summaryYear.text( loan['loan-term'] );
    $summaryStruct.text( loan['rate-structure'] );
    $summaryType.text( humanizeLoanType(loan['loan-type']) );
  }
  
  function getRateData() {
    if (currentRequest && typeof currentRequest === 'object') {
      currentRequest.abort();
    }
    
    $form.removeClass('update').addClass('updating');
    
    currentRequest = fetchRates({
      price: loan['price'],
      loan_amount: loan['amount-borrowed'],
      minfico: loan['minfico'],
      maxfico: loan['maxfico'],
      state: loan['location'],
      rate_structure: loan['rate-structure'],
      loan_term: loan['loan-term'],
      loan_type: loan['loan-type'],
      arm_type: loan['arm-type']
    })
    .done(function (results) {
        currentRequest = null;
        var rates = [];
        for ( key in results.data ) {
          if ( results.data.hasOwnProperty( key ) ) {
            rates.push(key);
          }
        }
        rates.sort();
        updateRateSelect(rates);
        loan.update();
        $form.removeClass('updating');
      })
    .fail(function () {
      currentRequest = null;
      $form.removeClass('updating')
           .addClass('update');
    });
  }
  
  function updateRateSelect(rates) {
    rates || (rates = []);
    var len = rates.length;
    var half = Math.floor((len - 1) / 2);
    
    $rateSelect.empty();
    $.each(rates, function(ind, rate) {
      var opt = $("<option></option>")
                  .attr("value", rate)
                  .text(rate + '%');
      if (ind === half) {
          opt.attr('selected', 'selected');
      }
      $rateSelect.append(opt);
    });      
  }

  function _updateDownPayment( ev ) {
    var targetID = ev.target.id,
        val;

    if ( /percent/.test(targetID) ) {
      val = $percent.val() / 100 * loan.price;
      $down.val( Math.round(val) );
      percentDownAccessedLast = true;
      loan.update();
      return;
    }

    if ( /down\-payment/.test(targetID) ) {
      percentDownAccessedLast = false;
    }

    if ( /house\-price/.test(targetID) && percentDownAccessedLast !== undefined ) {
      if ( percentDownAccessedLast ) {
        val = $percent.val() / 100 * loan.price || 0;
        $down.val( Math.round(val) );
        loan.update();
      } else {
        val = loan['down-payment'] / loan['price'] * 100 || 0;
        $percent.val( Math.round(val) );
        loan.update();
      }
    }
  }
  
  // The pricing fields (price, dp, dp %) are wonky and require special handling.
  $('#lc-input-' + id).on( 'keyup', '.pricing input', debounce(_updateDownPayment, 500) );

  // update when the radio buttons are updated
  // todo: there's certainly a cleaner way to do this
  $('#points-' + id).on( 'click', 'input', function updatePoints() {
    loan.update();
  });

  // refresh interest rates when update button is clicked
  $('#interest-rate-update-' + id).click(function updateRates(e) {
    e.preventDefault();
    getRateData();
  });
  
  
  function init() {
    // update the loan object with values from form
    loan.update();
    $.extend(loan, loanData);
    loans[ id ] = loan;
    
    // make initial api request for rates
    getRateData();

    // Observe the loan object for changes *only* if the browser supports it.
    // If the browser doesn't support it, do some drrrrty checking.
    if ( supportsAccessors ) {
      Object.observe( loan, updateComparisons );
    } else {
      var oldLoan = $.extend( {}, loan );
      setInterval(function(){
        // TODO: fix this
        if ( JSON.stringify(loan) !== JSON.stringify(oldLoan) ) {
          updateComparisons([]);
          oldLoan = $.extend( {}, loan );
        }
      }, 500);
    }
    
  }
  
  init();
  
  return loans;
}

module.exports = createNewForm;
