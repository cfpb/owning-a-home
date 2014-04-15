var $ = require('jquery');
module.exports = window.jQuery;
var debounce = require('debounce');
require('jquery-ui/slider');
var payment = require('./modules/payment-calc');
var totalInterest = require('./modules/total-interest-calc');
var formatUSD = require('./modules/format-usd');
var unFormatUSD = require('./modules/unformat-usd');
var highcharts = require('highcharts');

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

// This is a hot mess
$(function() {

  'use strict';

  var $timelineLinks = $('.term-timeline a');

  // Toggles for the term amounts
  $timelineLinks.on( 'click', function(e) {
    e.preventDefault();

    $timelineLinks.removeClass('current');
    $(this).addClass('current');

    loanToggle();
  });

  var loanToggle = function() {

    // get loan values
    var termLength = $('.current').data('term'),
        loanAmt = $('#loan-amount-value').val(),
        // parseFloat to ingnore % signs
        loanRate = parseFloat($('#loan-interest-value').val());

    // convert a currency string to an integer
    loanAmt = Number(loanAmt.replace(/[^0-9\.]+/g,''));

    // convert the term length to months
    termLength = termLength * 12;

    // perform calculations
    var monthlyPayment = payment(loanRate, termLength, loanAmt),
        totalInterest = totalInterest(loanRate, termLength, loanAmt, 1, termLength, 0);

    // add calculations to the dom
    $('#monthly-payment').html(monthlyPayment);
    $('#total-interest').html(totalInterest);

  };

  // update values on keyup
  $('.value').on('keyup', debounce(loanToggle, 500));

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

    return data;
  };

  var data = getData();

  // chart time
  if ($('#chart').length > 0) {
    $('#chart').highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        title: {
          text: 'Rates Available Today'
        },
        categories: data.labels
      },
      yAxis: {
        title: {
          text: 'Number of Lenders'
        }
      },
      series: [{
        name: 'Number of Lenders',
        data: data.vals,
        showInLegend: false
      }],
      credits: {
        text: ''
      }
    });
  }

  // update the view
  var renderView = function() {
    data = getData();

    var model = {
      location: $('#location').val(),
      type: $('#loan-type').val(),
      price: $('#house-price').val(),
      down: $('#down-payment').val(),
      amount: $('#loan-amount-result').text(),
      rate: data.largest.label
    };

    $('#chart').addClass('loading');

    // this is a faux delay to emulate an AJAX request
    setTimeout(function() {
     // update the fields scattered throughout the page
      $('.location').text(model.location);
      $('.rate').text(model.rate);
      $('.loan-amount').text(model.amount);

      // update the chart
      var chart = $('#chart').highcharts();
      chart.series[0].setData(data.vals);
      $('#chart').removeClass('loading');
    }, 1000);

  };

  // re-render when fields are changed
  $('.demographics').on('change', '.recalc', renderView);

  // jquery ui slider
  $('#slider').slider({
    range: true,
    min: 300,
    max: 850,
    values: [ 600, 700 ],
    create: function() {
      $('#slider-range').text($('#slider').slider('values', 0) + ' - ' + $('#slider').slider('values', 1 ));
    },
    slide: function( event, ui ) {
      $('#slider-range').text($('#slider').slider('values', 0) + ' - ' + $('#slider').slider('values', 1 ));
    },
    stop: renderView
  });

});