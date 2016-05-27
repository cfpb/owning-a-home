var housePriceCalculations = require('../../src/static/js/modules/monthly-payment-worksheet/house-price.js');

var chai = require('chai');
var expect = chai.expect;
var assign = require('object-assign');


describe('House price calculations', function() {
  var props = [
    'monthlyPayment', 
    'term', 
    'rate', 
    'tax', 
    'downpayment', 
    'insurance'
  ];
  
  var defaults = {
    monthlyPayment: 2140, 
    term: 30, 
    rate: 4, 
    tax: 2, 
    downpayment: 20, 
    insurance: 1000
  };
    
  describe('test valid scenarios', function () {
    var validScenarios = [
      {
        opts: defaults,
        result: {loanAmount: 299916, housePrice: 374894, insurance: 83, taxes: 625, downpayment: 74979},
        description: 'valid scenario: expect accurate results when valid number values are passed in, including downpayment as percent'
      },
      {
        opts: {monthlyPayment: 2140, term: 30, rate: 4, tax: 2, downpayment: 74979, insurance: 1000},
        result: {loanAmount: 299916, housePrice: 374895, insurance: 83, taxes: 625, downpayment: 74979},
        description: 'valid scenario: expect accurate results when valid number values are passed in, including downpayment as value'
      },
      {
        opts: {monthlyPayment: '2140', term: '30', rate: '4', tax: '2', downpayment: '20', insurance: '1000'},
        result: {loanAmount: 299916, housePrice: 374894, insurance: 83, taxes: 625, downpayment: 74979},
        description: 'valid scenario: expect accurate results when valid numeric strings are passed in'
      },
      {
        opts: {monthlyPayment: 2140, term: 30},
        result: {loanAmount: 770400, housePrice: 770400, insurance: 0, taxes: 0, downpayment: 0},
        description: 'valid scenario: expect accurate results when only monthly payment & term are passed in'
      },
      {
        opts: {monthlyPayment: 2140, term: 30, rate: 4, downpayment: 20, insurance: 1000},
        result: {loanAmount: 430792, housePrice: 538490, insurance: 83, taxes: 0, downpayment: 107698},
        description: 'valid scenario: expect accurate results when tax rate is missing from inputs'
      },
      {
        opts: {monthlyPayment: 2140, term: 30, rate: 4, tax: 2, downpayment: 0, insurance: 1000},
        result: {loanAmount: 319318, housePrice: 319318, insurance: 83, taxes: 532, downpayment: 0},
        description: 'valid scenario: expect accurate results when downpayment is missing from inputs'
      },
      {
        opts: {monthlyPayment: 2140, term: 30, rate: 4, tax: 2, downpayment: 20, insurance: 0},
        result: {loanAmount: 312068, housePrice: 390085, insurance: 0, taxes: 650, downpayment: 78017},
        description: 'valid scenario: expect accurate results when insurance is missing from inputs'
      },
      {
        opts: {monthlyPayment: 2140, term: 30, tax: 2, downpayment: 20, insurance: 1000},
        result: {loanAmount: 423086, housePrice: 528857, insurance: 83, taxes: 881, downpayment: 105771},
        description: 'valid scenario: expect accurate results when interest rate is missing from inputs'
      }
    ];
    
    function testValidScenario (scenario) {
      it(scenario.description, function () {
        expect(housePriceCalculations(scenario.opts)).to.deep.equal(scenario.result);
      });
    }
    
    for (var i = 0; i < validScenarios.length; i++) {
      testValidScenario(validScenarios[i]);      
    }
  });  
  
  describe('test invalid scenarios', function () {
    
    function testInvalidScenario (opts, description, error) {
      it(description, function () {
        expect(function () {housePriceCalculations(opts)}).to.throw(error);
      });
    }
    
    describe('test missing data scenarios', function () {
      var missingDataScenarios = [
        {
          opts: {},
          description: 'invalid scenario: expect required data error when no opts are passed'
        },
        {
          opts: {term: 30, rate: 4, tax: 2, downpayment: 20, insurance: 1000},
          description: 'invalid scenario: expect required data error when no monthlyPayment value is passed'
        },
        {
          opts: {monthlyPayment: 2140, rate: 4, tax: 2, downpayment: 20, insurance: 1000},
          description: 'invalid scenario: expect required data error when no term value is passed'
        }
      ]
      for (var i = 0; i < missingDataScenarios.length; i++) { 
        var scenario =  missingDataScenarios[i];      
        var err = 'Monthly payment and loan term are required.';
        testInvalidScenario(scenario.opts, scenario.description, err);      
      }
    });
    
    describe('test invalid type scenarios', function () {
      for (var i = 0; i < props.length; i++) { 
        var prop = props[i];      
        var err = prop + ' must be numeric';
        var description = 'invalid scenario: ' + prop + ' must be numeric';
        var opts = assign({}, defaults);
        opts[prop] = 'string';
        testInvalidScenario(opts, description, err);      
      }
    });
    
    describe('test negative value scenarios', function () {
      for (var i = 0; i < props.length; i++) { 
        var prop = props[i];      
        var err = prop + ' must be positive';
        var description = 'invalid scenario: ' + err;
        var opts = assign({}, defaults);
        opts[prop] = '-' + opts[prop];
        testInvalidScenario(opts, description, err);      
      }
    });
  });

});


