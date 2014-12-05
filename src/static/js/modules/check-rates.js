var $ = require('jquery');
var highcharts = require('highcharts');
var debounce = require('debounce');
var formatUSD = require('format-usd');
var unFormatUSD = require('unformat-usd');
var interest = require('./total-interest-calc');
var geolocation = require('./geolocation');
var dropdown = require('./dropdown-utils');
var jumbo = require('jumbo-mortgage');
var median = require('median');
var amortize = require('amortize');
var config = require('oah-config');
var isNum = require('is-money-usd');
var formatTime = require('./format-timestamp');
require('./highcharts-theme');
require('../../vendor/rangeslider.js/rangeslider.js');
require('./tab');
require('./analytics/rc-analytics');
require('./nemo');
require('./nemo-shim');

// Load our handlebar templates.
var template = {
  county: require('../templates/county-option.hbs'),
  countyConfWarning: require('../templates/county-conf-warning.hbs'),
  countyFHAWarning: require('../templates/county-fha-warning.hbs'),
  sliderLabel: require('../templates/slider-range-label.hbs'),
  creditAlert: require('../templates/credit-alert.hbs'),
  resultAlert: require('../templates/result-alert.hbs'),
  failAlert: require('../templates/fail-alert.hbs'),
  dpWarning: require('../templates/down-payment-warning.hbs'),
  chartTooltipSingle: require('../templates/chart-tooltip-single.hbs'),
  chartTooltipMultiple: require('../templates/chart-tooltip-multiple.hbs')
};

// List all the parameters the user can change and set
// their default values.
var params = {
  'credit-score': 700,
  'down-payment': '20,000',
  'house-price': '200,000',
  'loan-amount': undefined,
  'location': 'AL',
  'rate-structure': 'fixed',
  'loan-term': 30,
  'loan-type': 'conf',
  'arm-type': '3-1',
  'edited': false,
  update: function() {
    $.extend( params, getSelections() );
  }
};

// Set some properties for the histogram.
var chart = {
  $el: $('#chart'),
  $wrapper: $('.chart'),
  $load: $('.data-enabled'),
  $summary: $('#rc-summary'),
  isInitialized: false,
  startLoading: function() {
    removeAlerts();
    this.$load.addClass('loading').removeClass('loaded');
  },
  stopLoading: function() {
    this.$wrapper.removeClass('geolocating');
    this.$load.removeClass('loading').addClass('loaded');
    if(this.$summary.hasClass('clear')) {
      this.$summary.removeClass('clear');
    }
  }
};

// Set some properties for the credit score slider.
var slider = {
  $el: $('#credit-score'),
  min: params['credit-score'],
  max: params['credit-score'] + 20,
  step: 20,
  update: function() {
    var leftVal = +$('.rangeslider__handle').css('left').replace( 'px', '' );
    this.min = getSelection('credit-score');
    this.max = this.min + 20;
    $('#slider-range').text( template.sliderLabel(this) ).css( 'left', leftVal - 9 + 'px' );
  }
};

// options object
// dp-constant: track the down payment interactions
// request: Keep the latest AJAX request accessible so we can terminate it if need be.
var options = {
  'dp-constant': 'percent-down',
  'request': ''
};

/**
 * Get data from the API.
 * @return {object} jQuery promise.
 */
function getData() {
  params.update();
  var promise = $.get( config.rateCheckerAPI, {
    price: params['house-price'],
    loan_amount: params['loan-amount'],
    minfico: slider.min,
    maxfico: slider.max,
    state: params['location'],
    rate_structure: params['rate-structure'],   
    loan_term: params['loan-term'],
    loan_type: params['loan-type'],
    arm_type: params['arm-type']
  }).fail(function() {
    resultFailWarning();
  });

  return promise;
};

/**
 * Get values of all HTML elements in the control panel.
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
 * Get value(s) of an individual HTML element in the control panel.
 * @param  {string} param Name of parameter to get. Usually the HTML element's id attribute.
 * @return {object} Hash of element id and its value(s).
 */
function getSelection( param ) {

  var $el = $( '#' + param ),
      val;

  switch ( param ) {
    case 'location':
    case 'rate-structure':
    case 'loan-term':
    case 'loan-type':
    case 'arm-type':
      val = $el.val();
      break;
    default:
      val = unFormatUSD( $el.val() || $el.attr('placeholder') );
  }

  return val;

}

/**
 * Set value(s) of all HTML elements in the control panel.
 * @return {null}
 */
function setSelections( options ) {

  for ( var param in params ) {
    setSelection( param, options );
  }

}

/**
 * Set value(s) of an individual HTML element in the control panel.
 * @param  {string} param Name of parameter to set. Usually the HTML element's id attribute.
 * @param  {object} options Hash of options.
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
 * Calculate and render the loan amount.
 * @return {null}
 */
function renderLoanAmount() {
  var loan = unFormatUSD( params['house-price'] ) - unFormatUSD( params['down-payment'] );
  if ( loan > 0 ) {
    params['loan-amount'] = loan;
  } else {
    params['loan-amount'] = 0;
  }
  $('#loan-amount-result').text( formatUSD(params['loan-amount'], {decimalPlaces: 0}) );
}

/**
 * Render all applicable rate checker areas.
 * @return {null}
 */
function updateView() {

  chart.startLoading();

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

  // Abort the previous request.
  if ( typeof options['request'] === 'object' ) {
    options['request'].abort();
  }

  // And start a new one.
  if ( +params['loan-amount'] !== 0 ) {
    options['request'] = getData();

    // If it succeeds, update the DOM.
    options['request'].done(function( results ) {
      // sort results by interest rate, ascending
      var sortedKeys = [],
          sortedResults = {},
          key, x, len;

      for ( key in results.data ) {
        if ( results.data.hasOwnProperty( key ) ) {
          sortedKeys.push(key);
        }
      }

      sortedKeys.sort();
      len = sortedKeys.length;

      for ( x=0; x < len; x++ ) {
        sortedResults[sortedKeys[x]] = results.data[sortedKeys[x]];
      }

      $.each( sortedResults, function(key, val) {
        data.intLabels.push(+key);
        data.labels.push(key + '%');

        data.vals.push(val);
        if ( val > data.largest.val ) {
          data.largest.val = val;
          data.largest.label = key + '%';
        }

        for(var i = 0; i < val; i++) {
          data.totalVals.push(+key);
        }
      });

      // display an error message if less than 2 results are returned
      if( data.vals.length < 2 ) {
        chart.stopLoading();
        resultWarning();
        return;
      }

      // display an error message if the downpayment is greater than the house price
      if(+params['house-price'] < +params['down-payment']) {
        chart.stopLoading();
        resultWarning();
        downPaymentWarning();
        return;
      }

      data.uniqueLabels = $.unique( data.labels.slice(0) );

      removeAlerts();
      updateLanguage( data );
      renderAccessibleData( data );
      renderChart( data );
      renderTime( results.timestamp );
      updateComparisons( data );
      renderInterestAmounts();

    });
  }

  else {
    chart.stopLoading();
    resultWarning();
    downPaymentWarning();
  }

  // Whether the request succeeds or fails, stop the loading animation.
  options['request'].then(function(){
    chart.stopLoading();
  });

  // clean up input formatting

};

/**
 * Updates the sentence above the chart
 * @param  {string} data
 * @return {null}
 */
function updateLanguage( data ) {

  function renderLocation() {
    var state = $('#location option:selected').text();
    $('.location').text( state );
  }

  function renderMedian( data ) {
    var loansMedian = median( data.totalVals ).toFixed(3);
    $('#median-rate').text( loansMedian + '%' );
  }

  function updateTerm() {
    // change from 5 years to x if an ARM
    if ( getSelection('rate-structure') === 'arm' ) {
      var armVal = getSelection('arm-type');
      var term = armVal.match(/[^-]*/i)[0];
      $('.loan-years').text(term).fadeIn();
    } else {
      var termVal = getSelection('loan-term');
      $('.interest-cost-primary .loan-years').text(termVal).fadeIn();
      $('.interest-cost-secondary .loan-years').text( 5 ).fadeIn();
    }
  }

  renderLocation();
  renderMedian( data );
  updateTerm( data );
}


/**
 * Get a list of counties from the API for the selected state.
 * @return {object} jQuery promise.
 */
function getCounties() {
  return $.get( config.countyAPI, {
    state: params['location']
  });

}

/**
 * Request a list of counties and bring them into the DOM.
 * @return {null}
 */
function loadCounties() {

  // And request 'em.
  request = getCounties();
  request.done(function( resp ) {

    // If they haven't yet selected a state highlight the field.
    if ( !(params['location']) ) {
      dropdown('location').showHighlight();
    }
    else {
      // Empty the current counties and cache the current state so we
      // can monitor if it changes.
      $('#county').html('')
                  .data( 'state', params['location'] );

      // Inject each county into the DOM.
      $.each(resp.data, function( i, countyData ) {
        var countyOption = template.county( countyData );
        $('#county').append( countyOption );
      });

      // Don't select any options by default.
      $('#county').prop( 'selectedIndex', -1 );
    }


  });

  // Hide loading animation regardless of whether or not we're successful.
  request.then(function() {
    dropdown('county').hideLoadingAnimation();
  });
}

/**
 * Check the loan amount and initiate the jumbo loan interactions if need be.
 * @return {null}
 */
function checkForJumbo() {
  var loan,
      jumbos = ['jumbo', 'agency', 'fha-hb', 'va-hb'],
      request,
      prevLoanType = $('#loan-type').val();

  params.update();

  loan = jumbo({
    loanType: params['loan-type'],
    loanAmount: params['loan-amount']
  });


  // If we don't need to request a county, hide the county dropdown and jumbo options.
  if ( !loan.needCounty && jQuery.inArray(params['loan-type'], jumbos) < 0 ) {
    dropdown('county').hide();
    $('#county').val('');
    dropdown('loan-type').removeOption( jumbos );
    if ( prevLoanType === 'fha-hb' ) {
      $('#loan-type').val( 'fha' );
    }
    else if ( prevLoanType === 'va-hb' ) {
      $('#loan-type').val( 'va' );
    }
    else {
      $('#loan-type').val( 'conf' );
    }
    $('#county-warning').addClass('hidden');
    return;
  }
  // Otherwise, make sure the county dropdown is shown.
  dropdown('county').show();

  // Hide any existing message, then show a message if appropriate.
  $('#county-warning').addClass('hidden');
  if ( params['loan-type'] === 'conf' ) {
    $('#county-warning').removeClass('hidden').find('p').text( template.countyConfWarning );
  }
  if ( params['loan-type'] === 'fha' ) {
    $('#county-warning').removeClass('hidden').find('p').text( template.countyFHAWarning );
  }

  // if county is undefined, highligh the dropdown.
  if ( $('#county').val() === null ) {
    dropdown('county').showHighlight();
  }

  // If the state hasn't changed, we also cool. No need to load new counties.
  if ( $('#county').data('state') === params['location'] ) {
    dropdown('county').hideHighlight();
    return;
  }

  // Let's load us some counties.
  loadCounties();

}

/**
 * Get data for the chosen county
 * @return {null}
 */
function processCounty() {
  var $counties = $('#county'),
      $county = $('#county').find(':selected'),
      $loan = dropdown('loan-type'),
      prevLoanType = $('#loan-type').val(),
      norms = ['conf', 'fha', 'va'],
      jumbos = ['jumbo', 'agency', 'fha-hb', 'va-hb'],
      loan;

  params.update();

  // If the county field is hidden or they haven't selected a county, abort.
  if ( !$counties.is(':visible') || !$counties.val() ) {
    return;
  }

  loan = jumbo({
    loanType: params['loan-type'],
    loanAmount: params['loan-amount'],
    gseCountyLimit: parseInt( $county.data('gse'), 10 ),
    fhaCountyLimit: parseInt( $county.data('fha'), 10 ),
    vaCountyLimit: parseInt( $county.data('va'), 10 )
  });
  if ( loan.success && loan.isJumbo ) {
    switch ( loan.type ) {
      case 'agency':
        $loan.addOption({
          label: 'Conforming jumbo',
          value: 'agency',
          select: true
        });
        break;
      case 'jumbo':
        $loan.addOption({
          label: 'Jumbo (non-conforming)',
          value: 'jumbo',
          select: true
        });
        break;
      case 'fha-hb':
        $loan.addOption({
          label: 'FHA high-balance',
          value: 'fha-hb',
          select: true
        });
        break;
      case 'va-hb':
        $loan.addOption({
          label: 'VA high-balance',
          value: 'va-hb',
          select: true
        });
        break;
    }
    dropdown('loan-type').enable( norms );
    if ( prevLoanType !== params['loan-type'] ) {
      dropdown('loan-type').disable( prevLoanType );
    }
    dropdown('loan-type').showHighlight();
    $('#hb-warning').removeClass('hidden').find('p').text( loan.msg );
  } else {
    dropdown('loan-type').removeOption( jumbos );
    dropdown('loan-type').enable( norms );
    $('#hb-warning').addClass('hidden');
    if ( prevLoanType === 'fha-hb' ) {
      $('#loan-type').val( 'fha' );
    }
    else if ( prevLoanType === 'va-hb' ) {
      $('#loan-type').val( 'va' );
    }
    else {
      $('#loan-type').val( 'conf' );
    }
  }

  // Hide the county warning.
  $('#county-warning').addClass('hidden');

  updateView();

}

/**
 * Updates the sentence data date sentence below the chart
 * @param  {string} timestamp from API
 * @return {null}
 */
function renderTime( time ) {
  if ( time ) {
    time = formatTime( time );  }
  $('#timestamp').text( time );
}


/**
 * Store the loan amount and down payment, process the county data, check if it's a jumbo loan.
 * @return {null}
 */
function processLoanAmount( element ) {
  var name = $( element ).attr('name');
  // Save the dp-constant value when the user interacts with
  // down payment or down payment percentages.
  if ( name === 'down-payment' || name === 'percent-down' ) {
    options['dp-constant'] = name;
  }

  renderDownPayment.apply( element );
  params['house-price'] = getSelection('house-price');
  params['down-payment'] = getSelection('down-payment');
  renderLoanAmount();
  processCounty();
  checkForJumbo();
  updateView();
}

/**
 * Check if the house price entered is 0
 * @return {null}
 */
function checkIfZero($price, $percent, $down) {
  if (params['house-price'] === '0' || +params['house-price'] === 0) {
    removeAlerts();
    chart.stopLoading();
    downPaymentWarning();
    return true;
  } else if ($percent.attr('placeholder') === '') {
    return false;
  }
}

/**
 * Update either the down payment % or $ amount depending on the input they've changed.
 * @return {null}
 */
function renderDownPayment() {

  var $el = $( this ),
      $price = $('#house-price'),
      $percent = $('#percent-down'),
      $down = $('#down-payment'),
      val;

  if ( !$el.val() ) {
    return;
  }

  checkIfZero($price, $percent, $down);

  if ( $price.val() != 0 ) {
    if ( $el.attr('id') === 'down-payment' || options['dp-constant'] === 'down-payment' ) {
      val = ( getSelection('down-payment') / getSelection('house-price') * 100 ) || '';
      $percent.val( Math.round(val) );
    } else {
      val = getSelection('house-price') * ( getSelection('percent-down') / 100 );
      $down.val( val >= 0 ? Math.round(val) : '' );
    }
  }
}

/**
 * Update the values in the dropdowns in the comparison section
 * @param  {object} data Data object created by the updateView method.
 * @return {null}
 */
function updateComparisons( data ) {
  // Update the options in the dropdowns.
  var uniqueLabels = $( data.uniqueLabels ).sort(function( a, b ) {
    return a - b;
  });
  $('.compare select').html('');
  $.each( uniqueLabels, function( i, rate ) {
    var option = '<option value="' + rate + '">' + rate + '</option>';
    $('.compare select').append( option );
  });
  // In the second comparison dropdown, select the last (largest) rate.
  $('#rate-compare-2').val( uniqueLabels[uniqueLabels.length - 1] );
}

/**
 * Calculate and display the interest rates in the comparison section.
 * @return {null}
 */
function renderInterestAmounts() {
  var shortTermVal = [],
      fullTerm = +(getSelection('loan-term')) * 12;
  $('.interest-cost').each(function( index ) {
    var rate =  $(this).siblings().find('.rate-compare').val().replace('%', ''),
        length = (parseInt($(this).find('.loan-years').text(), 10)) * 12,
        amortizedVal = amortize({amount: params['loan-amount'], rate: rate, totalTerm: fullTerm, amortizeTerm: length}),
        totalInterest = amortizedVal['interest'],
        roundedInterest = Math.round( unFormatUSD(totalInterest) ),
        $el = $(this).find('.new-cost');
    $el.text( formatUSD(roundedInterest, {decimalPlaces: 0}) );
    // add short term rates, interest, and term to the shortTermVal array
    if (length < 180) {
      shortTermVal.push({rate: parseFloat(rate), interest: parseFloat(totalInterest), term: length/12});
    }
  });
  renderInterestSummary(shortTermVal);
}

/**
 * Calculate and display the plain language loan comparison summary.
 * @param  {array} intVals array with two objects containing rate, interest accrued, and term
 * @return {null}
 */
function renderInterestSummary(intVals) {

  var sortedRates,
      diff;

  sortedRates = intVals.sort(function( a, b ) {
    return a.rate - b.rate;
  });

  diff = formatUSD(sortedRates[sortedRates.length - 1].interest - sortedRates[0].interest, {decimalPlaces: 0});
  $('#comparison-term').text(sortedRates[0].term);
  $('#rate-diff').text(diff);
  $('#higher-rate').text(sortedRates[sortedRates.length - 1].rate + '%');
  $('#lower-rate').text(sortedRates[0].rate + '%');
}

/**
 * The dropdowns in the control panel need to change if they have
 * an adjustable rate mortgage.
 * @return {null}
 */
function checkARM() {
  if ( getSelection('rate-structure') === 'arm' ) {
    if ( getSelection('loan-term') !== '30' ) {
      dropdown('loan-term').showHighlight();
      $('#arm-warning').removeClass('hidden');
    }
    if ( getSelection('loan-type') !== 'conf' ) {
      dropdown('loan-type').showHighlight();
      $('#arm-warning').removeClass('hidden');
    }
    dropdown(['loan-term', 'loan-type']).reset();
    dropdown('loan-term').disable('15');
    dropdown('loan-type').disable(['fha', 'va']);
    dropdown('arm-type').show();
    dropdown('arm-type').showHighlight();
    $('.interest-cost-primary').children().addClass('hidden');
    $('#arm-info').removeClass('hidden');
  } else {
    dropdown(['loan-term', 'loan-type']).hideHighlight().enable();
    dropdown('arm-type').hide();
    $('#arm-warning').addClass('hidden');
    $('#arm-info').addClass('hidden');
    $('.interest-cost-primary').children().removeClass('hidden');
  }
}

/**
 * Low credit score warning display if user selects a
 * score of 620 or below
 * @param  {null}
 * @return {null}
 */
function scoreWarning() {
  $('.rangeslider__handle').addClass('warning');
  $('#slider-range').after( template.creditAlert );
  resultWarning();
  // analytics code for when this event fires
  if (window._gaq) {
    try{_gaq.push(['_trackEvent', 'OAH rate tool', 'Pop up', 'Fired']);}
    catch( error ) {}
  }
}

/**
 * Overlays a warning/error message on the chart
 * @param  {null}
 * @return {null}
 */
function resultWarning() {
  $('#chart').addClass('warning').append( template.resultAlert );
}

function resultFailWarning() {
  chart.stopLoading();
  $('#chart').addClass('warning').append( template.failAlert );
}

function downPaymentWarning() {
  $('#loan-amt-inputs').append( template.dpWarning );
}


/**
 * Remove alerts and warnings
 * @param  {null}
 * @return {null}
 */
function removeAlerts() {
  if ($('.result-alert')) {
    $('#chart, .rangeslider__handle').removeClass('warning');
    $('.result-alert').remove();
    $('#dp-alert').remove();
  }
}

/**
 * Initialize the range slider. http://andreruffert.github.io/rangeslider.js/
 * @param  {function} cb Optional callback.
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
    onSlide: function( position, value ) {
      slider.update();
    },
    onSlideEnd: function( position, value ) {
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
 * Render chart data in an accessible format.
 * @param  {object} data Data processed from the API.
 * @return {null}
 */

function renderAccessibleData( data ) {
  var $tableHead = $('#accessible-data .table-head');
  var $tableBody = $('#accessible-data .table-body');

  $tableHead.empty();
  $tableBody.empty();

  $.each(data.labels, function( index, value ) {
    $tableHead.append('<th>' + value + '</th>');
  });

  $.each(data.vals, function( index, value ) {
    $tableBody.append('<td>' + value + '</td>');
  });
}



/**
 * Render (or update) the Highcharts chart.
 * @param  {object} data Data processed from the API.
 * @param  {function} cb Optional callback.
 * @return {null}
 */
function renderChart( data, cb ) {
  if ( chart.isInitialized ) {

    var hc = chart.$el.highcharts();

    chart.$wrapper.removeClass('geolocating');
    hc.xAxis[0].setCategories( data.labels );
    hc.series[0].setData( data.vals );

  } else {

    if ( chart.$el.length < 1 ) {
      return;
    }

    chart.$wrapper.addClass('geolocating');
    chart.$el.highcharts({
      chart: {
        type: 'column',
        animation: false
      },
      plotOptions: {
        series: {
          events: {
            // analytics tracking for chart mouseovers
            mouseOver: function(event) {
              if (window._gaq) {
                try{_gaq.push(['_trackEvent', 'OAH rate tool', 'Roll over', 'fired ']);}
                catch( error ) {}
              }
            }
          }
        },
        column: {
          states: {
            hover: {
              color: '#ffecd1'
            }
          }
        }
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: [ 1, 2, 3, 4, 5 ]
      },
      yAxis: [{
        title: {
          text: '',
        },
        labels: {
          formatter: function() {
            return this.value>9?(this.value + '+'):this.value;
          }
        },
        max: 10,
        min: 0
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
        useHTML: true,
        formatter: function(){
          if (this.y === 1) {
            return template.chartTooltipSingle( this );
          } else {
            return template.chartTooltipMultiple( this );
          }
        },
        positioner: function(boxWidth, boxHeight, point) {
          return {
            x: point.plotX - 54,
            y: point.plotY - 66
          };
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
 * Initialize the rate checker app.
 * @return {null}
 */
function init() {

  // Only attempt to do things if we're on the rate checker page.
  if ( $('.rate-checker').length < 1 ) {
    return;
  }

  renderSlider();
  renderChart();
  renderLoanAmount();
  renderTime();
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

// Have the reset button clear selections.
$('.defaults-link').click(function(ev){
  ev.preventDefault();
  setSelections({ usePlaceholder: true });
  updateView();
});


// Recalculate everything when drop-down menus are changed.
$('.demographics, .calc-loan-details').on( 'change', '.recalc', function() {
  processLoanAmount( this );
});

// Prevent non-numeric characters from being entered
$('.calc-loan-amt .recalc').on( 'keydown', function( event ){
  var key = event.which,
      allowedKeys = [ 8, 9, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 188, 190 ];

  // If it's not an allowed key OR the shift key is held down (and they're not tabbing)
  // stop everything.
  if ( allowedKeys.indexOf(key) === -1 || (event.shiftKey && key !== 9) ) {
    event.preventDefault();
  }
});

// check if input value is a number
// if not, replace the character with an empty string
$('.calc-loan-amt .recalc').on( 'keyup', function(ev) {
  // on keyup (not tab or arrows), immediately gray chart
  if ( ev.which !== 9 && ( ev.which < 37 || ev.which > 40 ) ) {
    chart.startLoading();
  }
  var inputVal = $(this).val();
  if (!isNum(inputVal)) {
    var updatedVal = inputVal.toString().replace(/[^0-9\\.,]+/g,'');
    $(this).val(updatedVal);
  }
});

// debounced function for processing and updating
$('.calc-loan-amt .recalc').on( 'keyup', debounce(
  function(ev) {
    // Don't recalculate on TAB or arrow keys
    if ( ev.which !== 9 && ( ev.which < 37 || ev.which > 40 ) ) {
      processLoanAmount( this );
    }
  }, 500, false));

// Once the user has edited fields, put the kibosh on the placeholders
$('#house-price, #percent-down, #down-payment').on( 'keyup', function( ev ) {
  if ( params['edited'] === false ) {
    // Set the other two fields to their placeholder values
    $('#house-price, #percent-down, #down-payment').not( $(this) ).each( function(i, val) {
      $(this).val( $(this).attr('placeholder') );
    });
    $('#house-price, #percent-down, #down-payment').removeAttr('placeholder');
    params['edited'] = true;
  }
});

// Recalculate loan amount.
$('#county').on( 'change', processCounty );

// Recalculate interest costs.
$('.compare').on(' change', 'select', renderInterestAmounts );

// Recalculate interest costs.
$('#rate-structure').on( 'change', checkARM );

// Do it!
init();



