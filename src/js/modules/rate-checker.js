var $ = require('jquery');
var debounce = require('debounce');
var formatUSD = require('./format-usd');
var unFormatUSD = require('./unformat-usd');
var interest = require('./total-interest-calc');
var highcharts = require('highcharts');
var defaults = require('./defaults');
require('./highcharts-theme');
require('jquery-ui/slider');
require('./nemo');
require('./nemo-shim');

// This is a temporary function that generates fake data in
// the same format that our API will eventually return it.
var mock = function() {
  var data = {},
      i;

  var getRand = function(min, max) {
    return Math.floor((Math.random() * (max - min + 1) + min) * 10) / 10;
  };

  var getRandInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  i = getRandInt(8, 12);

  while(i--) {
    data[getRand(4, 7)] = getRandInt(1, 16);
  }

  return { data: data };
};

// Rate checker
var calcLoan = function() {
  var cost = $('#house-price').val() || $('#house-price').attr('placeholder'),
      down = $('#down-payment').val() || $('#down-payment').attr('placeholder'),
      loan = unFormatUSD(cost) - unFormatUSD(down);

  loan = loan > 0 ? loan : 0;

  $('#loan-amount-result').text(formatUSD(loan, {decimalPlaces: 0}));
};

// update values on keyup
$('.recalc').on('keyup', debounce(calcLoan, 500));

// process the data from the API
var getData = function() {
  var data = {
    labels: [],
    vals: [],
    uniqueVals: [],
    largest: {
      label: 4,
      val: 0
    }
  };

  $.each(mock().data, function(key, val) {
    data.labels.push(key + '%');
    data.vals.push(val);
    if (val > data.largest.val) {
      data.largest.val = val;
      data.largest.label = key + '%';
    }
  });

  data.uniqueVals = $.unique(data.vals);

  return data;
};

var data = getData();

// update the comparison dropdowns with new options
var updateComparisonOptions = function() {
  var uniqueVals = $(data.uniqueVals).sort(function(a,b) {
    return a - b;
  });
  $('.compare select').html('');
  $.each(uniqueVals, function(i, rate) {
    var option = '<option value="' + rate + '">' + rate + '%</option>';
    $('.compare select').append(option);
  });
};

// store the user's selections somewhere globally accessible
var details = {};

// update errythang
var renderView = function(delay) {
  data = getData();

  details = {
    location: $('#location option:selected').text(),
    type: $('#loan-type').val(),
    price: $('#house-price').val() || $('#house-price').attr('placeholder'),
    down: $('#down-payment').val() || $('#down-payment').attr('placeholder'),
    amount: $('#loan-amount-result').text(),
    rate: data.largest.label
  };

  // Save the user's selections to local storage
  defaults.save();

  // Add a loading animation
  $('#chart').addClass('loading');

  // this is a faux delay to emulate an AJAX request
  setTimeout(function() {
    // update the fields scattered throughout the page
    $('.location').text(details.location);
    $('.rate').text(details.rate);
    $('.loan-amount').text(details.amount);

    // update the comparisons section
    updateComparisonOptions();
    updateComparisons();

    // Calculate loan amount
    calcLoan();

    updateScoreRange();

    // update the chart
    var chart = $('#chart').highcharts();
    chart.series[0].setData(data.vals);
    $('#chart').removeClass('loading');
  }, typeof delay !== 'number' ? 1000 : delay);

};

// re-render when fields are changed
$('.demographics').on('change', '.recalc', renderView);

var updateComparisons = function() {
  $('.interest-cost').each(function( index ) {
    var rate =  $(this).siblings('.rate-compare').val(),
        length = parseInt($(this).find('.loan-years').text(), 10),
        totalInterest = interest(rate, length, details.amount),
        $selector = $(this).find('.new-cost');
    $selector.text(totalInterest);
  });
};

// update comparison info when new rate is selected
$('.compare').on('change', 'select', updateComparisons);

var updateScoreRange = function() {
  $('#slider-range').text($('#slider').slider('values', 0) + ' - ' + $('#slider').slider('values', 1 ));
};

// jquery ui slider
$('#slider').slider({
  range: true,
  min: 300,
  max: 850,
  step: 10,
  values: [ 600, 700 ],
  create: function() {
    updateScoreRange();
  },
  slide: function( event, ui ) {
    updateScoreRange();
    defaults.save();
  },
  stop: renderView
});

if ($('.rate-checker').length > 0) {

  $('#chart').highcharts({
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
      categories: data.labels
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
      data: data.vals,
      showInLegend: false
    }],
    credits: {
      text: ''
    },
    tooltip:{
      formatter:function(){
        return this.key; // show only the percentage
      }
    },
  }).addClass('loading');

  defaults.load(function(){
    renderView(0);
    $('#chart').removeClass('loading');
  });

}