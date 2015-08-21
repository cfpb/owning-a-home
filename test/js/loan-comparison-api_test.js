var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var api;

describe('Loan comparison API tests', function() {
  before(function() {
    api = require('../../src/static/js/modules/loan-comparison/api.js');
  });

  describe('Fetch county data', function() {
    it('should fetch county data', function() {
      var arg = {state: 'DC'};
      //api.fetchCountyData(arg);
      // TODO: don't know yet how to spy/stub jQuery
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
      };
      //api.fetchRateData(loan);
      // TODO: what and how do I test anything here?
    });

    it('should fetch rate data, v2', function() {
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
      };
      //api.fetchRateData(loan);
      // TODO: what and how do I test anything here?
    });

    it('should fetch rate data, v3', function() {
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
      };
      //api.fetchRateData(loan);
      // TODO: what and how do I test anything here?
    });
  });

  describe('Fetch mortgage insurance data', function() {
    it('should fetch mortgage insurance data', function() {
      var loan = {param: 'value'};
      //api.fetchMortgageInsuranceData(loan);
      // TODO: what do I test here?
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
