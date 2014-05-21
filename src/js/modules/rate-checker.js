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
var config = require('oah-config');

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

  var promise = $.get(config.rateCheckerAPI, {
    downpayment: unFormatUSD( $('#down-payment').val() || $('#down-payment').attr('placeholder') ),
    loan_amount: unFormatUSD( $('#loan-amount-result').text() ),
    loan_type: $('#loan-type').val() + ' year fixed',
    maxfico: $('#slider').slider('values', 1),
    minfico: $('#slider').slider('values', 0),
    price: unFormatUSD( $('#house-price').val() || $('#house-price').attr('placeholder') ),
    state: $('#location option:selected').val()
  });

  return promise;

};

// var data = getData();

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
var renderView = function() {

  $.when( getData() ).then(function( results ){

    console.log(results);

    data = {
      labels: [],
      vals: [],
      uniqueVals: [],
      largest: {
        label: 4,
        val: 0
      }
    };

    $.each(results.data, function(key, val) {
      data.labels.push(key + '%');
      data.vals.push(val);
      if (val > data.largest.val) {
        data.largest.val = val;
        data.largest.label = key + '%';
      }
    });

    data.uniqueVals = $.unique( data.vals.slice(0) );

    console.log(data.uniqueVals);

    details = {
      location: $('#location option:selected').text(),
      type: $('#loan-type').val(),
      price: $('#house-price').val() || $('#house-price').attr('placeholder'),
      down: $('#down-payment').val() || $('#down-payment').attr('placeholder'),
      amount: $('#loan-amount-result').text(),
      // rate: data.largest.label
    };

    // Save the user's selections to local storage
    defaults.save();

    // Add a loading animation
    $('#chart').addClass('loading');

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
    chart.xAxis[0].setCategories( data.labels );
    chart.series[0].setData( data.vals );
    $('#chart').removeClass('loading');

  });

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
  var val = $('#slider').slider('value');
  $('#slider-range').text( (val - 10) + ' - ' + (val + 10) );
};

// jquery ui slider
$('#slider').slider({
  min: 300,
  max: 850,
  step: 10,
  value: 600,
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
  }).addClass('loading');

  defaults.load(function(){
    renderView(0);
    $('#chart').removeClass('loading');
  });

}