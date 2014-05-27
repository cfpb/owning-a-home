var $ = require('jquery');
var debounce = require('debounce');
var formatUSD = require('./format-usd');
var unFormatUSD = require('./unformat-usd');
var interest = require('./total-interest-calc');
var highcharts = require('highcharts');
var defaults = require('./defaults');
var median = require('median');
var config = require('oah-config');
require('./highcharts-theme');
require('jquery-ui/slider');
require('./nemo');
require('./nemo-shim');

// List all the parameters the user can change and set
// their default values.
var params = {
  'credit-score': 700,
  'down-payment': 20000,
  'house-price': 450000,
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
  isInitialized: false,
  startLoading: function() {
    this.$el.addClass('loading');
  },
  stopLoading: function() {
    this.$el.removeClass('loading');
  }
};

// Set some properties for the slider.
var slider = {
  $el: $('#credit-score'),
  min: params['credit-score'],
  max: params['credit-score'] + 20,
  step: 20,
  updateRange: function() {
    var min = getSelection('credit-score'),
        max = min + 20;
    $('#slider-range').text( min + ' - ' + max );
  }
};

/**
 * Initialize the rate checker app.
 * @param {null}
 * @return {null}
 */
function init() {

  // Only attempt to do things if we're on the rate checker page.
  if ( $('.rate-checker').length > 0 ) {

    renderSlider();
    renderChart();
    renderLoanAmount();
    setSelections({ usePlaceholder: true });

  }

}

/**
 * Get data from the API.
 * @param {null}
 * @return {object} jQuery promise.
 */
var getData = function() {

  var promise = $.get( config.rateCheckerAPI, {
    downpayment: params['down-payment'],
    // loan_amount: params['loan-amount'],
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

  params.update();
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

    data.uniqueLabels = $.unique( data.labels.slice(0) );

    console.log(data);

    renderMedian( data );
    renderChart( data );
    updateComparisons( data );
    renderInterestAmounts();

    chart.stopLoading();

  });

};

function renderMedian( data ) {
  var loansMedian = median( data.intLabels );
  $('#median-rate').text( loansMedian + '%' );
}

function renderLoanAmount() {
  var loan = unFormatUSD( params['house-price'] ) - unFormatUSD( params['down-payment'] );
  params['loan-amount'] = loan > 0 ? loan : 0;
  $('#loan-amount-result').text( formatUSD(params['loan-amount'], {decimalPlaces: 0}) );
}

var updateComparisons = function( data ) {
  // Update the options in the dropdowns.
  var uniqueLabels = $( data.uniqueLabels ).sort(function( a, b ) {
    return a - b;
  });
  $('.compare select').html('');
  $.each( uniqueLabels, function( i, rate ) {
    var option = '<option value="' + rate + '">' + rate + '</option>';
    $('.compare select').append(option);
  });
};

function renderInterestAmounts() {
  $('.interest-cost').each(function( index ) {
    var rate =  $(this).siblings('.rate-compare').val().replace('%', ''),
        length = parseInt($(this).find('.loan-years').text(), 10),
        totalInterest = unFormatUSD( interest(rate, params['loan-term'], params['loan-amount']) ) * length,
        $el = $(this).find('.new-cost');
    $el.text( formatUSD(totalInterest) );
  });
}

/**
 * Initialize the jQuery UI slider.
 * @param {function} cb Optional callback.
 * @return {null}
 */
function renderSlider( cb ) {
  
  $('#credit-score').slider({
    value: params['credit-score'],
    min: 600,
    max: 820,
    step: slider.step,
    create: function() {
      slider.updateRange();
    },
    slide: function( event, ui ) {
      slider.updateRange();
    },
    stop: function() {
      params.update();
      updateView();
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
    hc.xAxis[0].setCategories( data.labels );
    hc.series[0].setData( data.vals );

  } else {

    chart.$el.highcharts({
      chart: {
        type: 'column'
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
        data: [ 0, 0, 0, 0, 0 ],
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
    case 'credit-score':
      val = $el.slider('value');
      break;
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
 * @return {null}
 */
function setSelection( param, options ) {

  var opts = options || {},
      $el = $( '#' + param ),
      val = params[ param ];

  switch ( param ) {
    case 'credit-score':
      $el.slider( 'value', val );
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
  params['house-price'] = getSelection('house-price');
  params['down-payment'] = getSelection('down-payment');
  renderLoanAmount();
}
$('#house-price, #down-payment').on( 'change keyup', reCalcLoan );

// Recalculate interest costs.
$('.compare').on('change', 'select', renderInterestAmounts);

// Do it!
init();