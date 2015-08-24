var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var api, server, $, config, spy;

describe('Loan comparison API tests', function() {
  before(function() {
    api = require('../../src/static/js/modules/loan-comparison/api.js');
    config = require('../../config/config.json');
    $ = require('jquery');
  });

  afterEach(function() {
    spy.restore();
  });

  describe('Fetch county data', function() {
    it('should fetch county data', function() {
      var arg = {state: 'DC'};
      spy = sinon.spy($, 'get');
      api.fetchCountyData(arg);
      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, config.countyAPI, arg);
    });
  });

  describe('Fetch rate data', function() {
    it('should fetch rate data', function() {
      var loan = {
        price: 200000,
        'loan-amount': 100000,
        'rate-structure': 'Fixed',
        'loan-term': 30,
        'loan-type': 'Type',
        'arm-type': null,
        'credit-score': 750,
        'points': 0,
        'state': 'DC'
      },
      expected_data = {
        price: 200000,
        loan_amount: 100000,
        minfico: 750,
        maxfico: 769,
        rate_structure: 'Fixed',
        loan_term: 30,
        loan_type: 'Type',
        arm_type: null,
        state: 'DC',
        points: 0
      };
      spy = sinon.spy($, 'ajax');
      api.fetchRateData(loan);
      sinon.assert.calledOnce(spy);
      sinon.assert.calledWithMatch(spy, {url: config.rateCheckerAPI, data: expected_data});
    });

    it('should fetch rate data, credit score undefined', function() {
      var loan = {
        price: 200000,
        'loan-amount': 100000,
        'rate-structure': 'Fixed',
        'loan-term': 30,
        'loan-type': 'Type',
        'arm-type': null,
        'credit-score': null,
        'points': 0,
        'state': 'DC'
      },
      expected_data = {
        price: 200000,
        loan_amount: 100000,
        minfico: 0,
        maxfico: 19,
        rate_structure: 'Fixed',
        loan_term: 30,
        loan_type: 'Type',
        arm_type: null,
        state: 'DC',
        points: 0
      };
      spy = sinon.spy($, 'ajax');
      api.fetchRateData(loan);
      sinon.assert.calledOnce(spy);
      sinon.assert.calledWithMatch(spy, {url: config.rateCheckerAPI, data: expected_data});
    });

    it('should fetch rate data, credit score = 840', function() {
      var loan = {
        price: 200000,
        'loan-amount': 100000,
        'rate-structure': 'Fixed',
        'loan-term': 30,
        'loan-type': 'Type',
        'arm-type': null,
        'credit-score': 840,
        'points': 0,
        'state': 'DC'
      },
      expected_data = {
        price: 200000,
        loan_amount: 100000,
        minfico: 840,
        maxfico: 850,
        rate_structure: 'Fixed',
        loan_term: 30,
        loan_type: 'Type',
        arm_type: null,
        state: 'DC',
        points: 0
      };
      spy = sinon.spy($, 'ajax');
      api.fetchRateData(loan);
      sinon.assert.calledOnce(spy);
      sinon.assert.calledWithMatch(spy, {url: config.rateCheckerAPI, data: expected_data});
    });
  });

  describe('Fetch mortgage insurance data', function() {
    it('should fetch mortgage insurance data', function() {
      var loan = {param: 'value'};
      var today = new Date();
      var decache = "" + today.getDate() + today.getMonth();
      var expected_data = {
        decache: decache,
      };
      spy = sinon.spy($, 'ajax');
      api.fetchMortgageInsuranceData(loan);
      sinon.assert.calledOnce(spy);
      sinon.assert.calledWithMatch(spy, {url: config.mortgageInsuranceAPI});
    });
  });

  describe('Stop request', function() {
    it('should stop request', function() {
      var dfd_spy = sinon.spy();
      var dfd = {abort: dfd_spy};
      api.stopRequest(dfd);
      sinon.assert.calledOnce(dfd_spy);
    });
  });
});
