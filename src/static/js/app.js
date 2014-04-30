var $ = require('jquery');
var debounce = require('debounce');
var payment = require('./modules/payment-calc');
var interest = require('./modules/total-interest-calc');
var formatUSD = require('./modules/format-usd');
var unFormatUSD = require('./modules/unformat-usd');
var highcharts = require('highcharts');
var defaults = require('./modules/defaults');
require('./modules/local-storage-polyfill');
require('jquery-ui/slider');
require('../../vendor/cf-expandables/cf-expandables.js');

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
    var termLength = $('.term-timeline .current').data('term'),
        loanAmt = $('#loan-amount-value').val(),
        // parseFloat to ingnore % signs
        loanRate = parseFloat($('#loan-interest-value').val());

    // convert a currency string to an integer
    loanAmt = Number(loanAmt.replace(/[^0-9\.]+/g,''));

    // convert the term length to months
    termLength = termLength * 12;

    // perform calculations
    var monthlyPayment = payment(loanRate, termLength, loanAmt),
        totalInterest = interest(loanRate, termLength, loanAmt);

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

  var updateComparisons = function(ev) {
    var rate = ev ? $(ev.target).val() : 3,
        totalInterest = interest(rate, $('#loan-type').val(), details.amount),
        $selector = ev ? $(ev.target).parent().find('.new-cost') : $('.new-cost');
    $selector.text(totalInterest);
    $('.loan-amount').text(details.amount);
    $('.loan-years').text(details.type);
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
    }).addClass('loading');

    defaults.load(function(){
      renderView(0);
      $('#chart').removeClass('loading');
    });

  }

});
