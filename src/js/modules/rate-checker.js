var $ = require('jquery');
var debounce = require('debounce');
var formatUSD = require('./format-usd');
var unFormatUSD = require('./unformat-usd');
var interest = require('./total-interest-calc');
var highcharts = require('highcharts');
var geolocation = require('./geolocation');
var median = require('median');
var config = require('oah-config');
require('./highcharts-theme');
require('../../vendor/rangeslider.js/rangeslider.js');
require('./tab');
require('./nemo');
require('./nemo-shim');

// List all the parameters the user can change and set
// their default values.
var params = {
  'credit-score': 700,
  'down-payment': 20000,
  'house-price': 200000,
  'loan-amount': undefined,
  'location': 'AL',
  'loan-term': 30,
  'rate-structure': 'adjustable',
  'loan-type': 'conventional',
  'arm-type': '5-1',
  update: function() {
    $.extend( params, getSelections() );
  }
};

// Set some properties for the histogram.
var chart = {
  $el: $('#chart'),
  $wrapper: $('.chart'),
  isInitialized: false,
  startLoading: function() {
    removeAlerts();
    this.$el.addClass('loading');
    this.$el.removeClass('loaded');
  },
  stopLoading: function() {
    this.$wrapper.removeClass('geolocating');
    this.$el.removeClass('loading');
    this.$el.addClass('loaded');
  }
};

// Set some properties for the slider.
var slider = {
  $el: $('#credit-score'),
  min: params['credit-score'],
  max: params['credit-score'] + 20,
  step: 20,
  update: function() {
    this.min = getSelection('credit-score');
    this.max = this.min + 20;
    $('#slider-range').text( this.min + ' - ' + this.max );
  }
};

/**
 * Initialize the rate checker app.
 * @param {null}
 * @return {null}
 */
function init() {

  // Only attempt to do things if we're on the rate checker page.
  if ( $('.rate-checker').length < 0 ) {
    return;
  }

  renderSlider();
  renderChart();
  renderLoanAmount();
  setSelections({ usePlaceholder: true });

  geolocation.getState({timeout: 2000}, function( state ){
    // If a state is returned (meaning they allowed the browser
    // to determine their location).
    if ( state ) {
      params.location = state;
      setSelection('location');
    }
    updateView();
  });

}

/**
 * Get data from the API.
 * @param {null}
 * @return {object} jQuery promise.
 */
var getData = function() {

  params.update();

  var promise = $.get( config.rateCheckerAPI, {
    downpayment: params['down-payment'],
    loan_amount: params['loan-amount'],
    // loan_type: params['loan-type'],
    minfico: slider.min,
    maxfico: slider.max,
    state: params['location']
  });

  return promise;

};

/**
 * Render all applicable rate checker areas.
 * @param {null}
 * @return {null}
 */
var updateView = function() {

  chart.startLoading();

  $.when( getData() ).then(function( results ){

    var data = {
      labels: [],
      intLabels: [],
      uniqueLabels: [],
      vals: [],
      totalVals: [],
      largest: {
        label: 4,
        val: 0
      }
    };

    $.each(results.data, function(key, val) {
      data.intLabels.push(+key);
      data.labels.push(key + '%');
      data.vals.push(val);
      if ( val > data.largest.val ) {
        data.largest.val = val;
        data.largest.label = key + '%';
      }
    });

    // display an error message if less than 2 results are returned
    if( data.vals.length < 2 ) {
      chart.stopLoading();
      resultWarning();
      return;
    }

    data.uniqueLabels = $.unique( data.labels.slice(0) );

    removeAlerts();
    updateLanguage( data );
    renderChart( data );
    updateComparisons( data );
    renderInterestAmounts();

    chart.stopLoading();

  });

};

/**
 * Updates the sentence above the chart
 * @param {string} data
 * @return {null}
 */
function updateLanguage( data ) {

  function renderLocation() {
    var state = $('#location option:selected').text();
    $('.location').text( state );
  }

  function renderMedian( data ) {
    var loansMedian = median( data.intLabels );
    $('#median-rate').text( loansMedian + '%' );
  }

  renderLocation();
  renderMedian( data );

}

function renderLoanAmount() {
  var loan = unFormatUSD( params['house-price'] ) - unFormatUSD( params['down-payment'] );
  params['loan-amount'] = loan > 0 ? loan : 0;
  $('#loan-amount-result').text( formatUSD(params['loan-amount'], {decimalPlaces: 0}) );
}

/**
 * Update either the down payment % or $ amount depending on the input they've changed.
 * @param {null}
 * @return {null}
 */
function renderDownPayment( el ) {

  var $el = $( el ),
      $price = $('#house-price'),
      $percent = $('#percent-down'),
      $down = $('#down-payment'),
      val;

  if ( !$el.val() ) {
    return;
  }

  if ( $el.attr('id') === 'down-payment' ) {
    val = ( getSelection('down-payment') / getSelection('house-price') * 100 ) || '';
    $percent.val( Math.round(val) );
  } else {
    val = getSelection('house-price') * ( getSelection('percent-down') / 100 );
    $down.val( val > 0 ? Math.round(val) : '' );
  }

}

function updateComparisons( data ) {
  // Update the options in the dropdowns.
  var uniqueLabels = $( data.uniqueLabels ).sort(function( a, b ) {
    return a - b;
  });
  $('.compare select').html('');
  $.each( uniqueLabels, function( i, rate ) {
    var option = '<option value="' + rate + '">' + rate + '</option>';
    $('.compare select').append(option);
  });
}

function renderInterestAmounts() {
  $('.interest-cost').each(function( index ) {
    var rate =  $(this).siblings().find('.rate-compare').val().replace('%', ''),
        length = parseInt($(this).find('.loan-years').text(), 10),
        totalInterest = unFormatUSD( interest(rate, length * 12, params['loan-amount']) ),
        $el = $(this).find('.new-cost');
    $el.text( formatUSD(totalInterest) );
  });
}

function scoreWarning() {
  $('.rangeslider__handle').addClass('warning');
  $('#slider-range').after(
    '<div class="result-alert credit-alert">' +
      '<p class="alert">Many lenders do not accept borrowers with credit scores less than 620. ' +
      'If your score is low, you may still have options. ' +
      '<a href="http://www.consumerfinance.gov/mortgagehelp/">Contact a housing counselor</a> to learn more.</p>' +
    '</div>'
  );
  resultWarning();
}

function resultWarning() {
  $('#chart').addClass('warning').append(
    '<div class="result-alert chart-alert">' +
      '<p class="alert"><strong>We\'re sorry</strong> Based on the infomation you entered, we don\'t have enough data to display results.</p>' +
      '<p class="point-right">Change your settings in the control panel</p>' +
      '<p><a class="defaults-link" href="">Or, revert to our default values</a>' +
    '</div>'
  );
}

function removeAlerts() {
  if ($('.result-alert')) {
    $('#chart, .rangeslider__handle').removeClass('warning');
    $('.result-alert').remove();
  }
}

$('.defaults-link').click(function(e){
  setSelections({ usePlaceholder: true });
  updateView();
  return false;
});

/**
 * Initialize the range slider.
 * http://andreruffert.github.io/rangeslider.js/
 * @param {function} cb Optional callback.
 * @return {null}
 */
function renderSlider( cb ) {

  $('#credit-score').rangeslider({
    polyfill: false,
    rangeClass: 'rangeslider',
    fillClass: 'rangeslider__fill',
    handleClass: 'rangeslider__handle',
    onInit: function() {
      slider.update();
    },
    onSlide: function(position, value) {
      slider.update();
    },
    onSlideEnd: function(position, value) {
      params.update();
      if(params['credit-score'] < 620) {
        removeAlerts();
        scoreWarning();
      } else {
        updateView();
      }
    }
  });

  if ( cb ) {
    cb();
  }

}

/**
 * Render (or update) the Highcharts chart.
 * @param {object} data Data processed from the API.
 * @param {function} cb Optional callback.
 * @return {null}
 */
function renderChart( data, cb ) {

  if ( chart.isInitialized ) {

    var hc = chart.$el.highcharts();

    chart.$wrapper.removeClass('geolocating');
    hc.xAxis[0].setCategories( data.labels );
    hc.series[0].setData( data.vals );

  } else {

    chart.$wrapper.addClass('geolocating');
    chart.$el.highcharts({
      chart: {
        type: 'column',
        animation: false
      },
      title: {
        text: ''
      },
      xAxis: {
        title: {
          text: 'RATES AVAILABLE TO A BORROWER LIKE YOU'
        },
        categories: [ 1, 2, 3, 4, 5 ]
      },
      yAxis: [{
        title: {
          text: '',
        }
      }, {
        opposite: true,
        title: {
          text: '# OF LENDERS OFFERING RATE',
        }
      }],
      series: [{
        name: 'Number of Lenders',
        data: [ 1, 1, 1, 1, 1 ],
        showInLegend: false,
        dataLabels: {
          enabled: true,
          useHTML: true,
          //format: '{x}',
          crop: false,
          overflow: 'none',
          defer: true,
          color: '#919395',
          formatter: function(){
            return '<div class="data-label">'+ this.x + '<br>|</div>';
          }
        }
      }],
      credits: {
        text: ''
      },
      tooltip:{
        formatter: function(){
          return this.key; // show only the percentage
        }
      },
    }, function(){
      // After the chart is loaded
      chart.isInitialized = true;
    });

  }

  if ( cb ) {
    cb();
  }

}

/**
 * Get value(s) of an individual HTML element in the control panel.
 * @param {string} param Name of parameter to get. Usually the HTML element's id attribute.
 * @return {object} Hash of element id and its value(s).
 */
function getSelection( param ) {

  var $el = $( '#' + param ),
      val;

  switch ( param ) {
    case 'location':
      val = $el.val();
      break;
    default:
      val = unFormatUSD( $el.val() || $el.attr('placeholder') );
  }

  return val;

}

/**
 * Get values of all HTML elements in the control panel.
 * @param {null}
 * @return {object} Key-value hash of element ids and values.
 */
function getSelections() {

  var selections = {},
      ids = [];

  for ( var param in params ) {
    selections[ param ] = getSelection( param );
  }

  return selections;

}

/**
 * Set value(s) of an individual HTML element in the control panel.
 * @param {string} param Name of parameter to set. Usually the HTML element's id attribute.
 * @param {object} options Hash of options.
 * @return {null}
 */
function setSelection( param, options ) {

  var opts = options || {},
      $el = $( '#' + param ),
      val = opts.value || params[ param ];

  switch ( param ) {
    case 'credit-score':
      $el.val( val ).change();
      break;
    default:
      if ( opts.usePlaceholder && $el.is('[placeholder]') ) {
        $el.attr( 'placeholder', val );
      } else {
        $el.val( val );
      }
  }

}

/**
 * Set value(s) of all HTML elements in the control panel.
 * @param {null}
 * @return {null}
 */
function setSelections( options ) {

  for ( var param in params ) {
    setSelection( param, options );
  }

}

// Recalculate everything when fields are changed.
$('.demographics, .calc-loan-details').on( 'change', '.recalc', updateView );
$('.calc-loan-amt').on( 'keyup', '.recalc', debounce(updateView, 900) );

// Recalculate loan amount.
function reCalcLoan() {
  renderDownPayment( this );
  params['house-price'] = getSelection('house-price');
  params['down-payment'] = getSelection('down-payment');
  renderLoanAmount();
}
$('#house-price, #percent-down, #down-payment').on( 'change keyup', reCalcLoan );

// Recalculate interest costs.
$('.compare').on('change', 'select', renderInterestAmounts);

// Do it!
init();