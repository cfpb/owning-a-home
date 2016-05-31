var monthly = require('../../src/static/js/modules/monthly-payment-worksheet/monthly-payment-calc.js');
var assign = require('object-assign');

var chai = require('chai');
var expect = chai.expect;
var data = {
  preTaxIncome: 5000,
  preTaxIncomeCB: 4000,
  takeHomeIncome: 3500,
  takeHomeIncomeCB: 3000,
  rent: 2000,
  utilities: 200,
  debtPayments: 1000,
  livingExpenses: 2500,
  savings: 600,
  homeMaintenance: 200,
  condoHOA: 500,
  futureUtilities: 300,
  futureSavings: 400,
  homePrice: 300000,
  propertyTax: 1.1,
  homeownersInsurance: 750
}

describe('Monthly payment calculations', function() {
  
  describe('Calculates pre-tax income', function() {

    it('Positive test - should add positive values for income and co borrower income', function() {
      expect(monthly.preTaxIncomeTotal(data)).to.equal(9000);
    });

  });

  describe('Calculates take home income', function() {

    it('Positive test - should add positive values for income and co borrower take home income', function() {
      expect(monthly.takeHomeIncomeTotal(data)).to.equal(6500);
    });

  });

  describe('Calculates spending & savings', function() {

    it('Positive test - should add positive values for spending and savings', function() {
      expect(monthly.spendingAndSavings(data)).to.equal(6300);
    });

  });
  
  describe('Calculates new homeownership expenses', function() {

    it('Positive test - should add positive values for new homeownership expenses', function() {
      expect(monthly.newHomeownershipExpenses(data)).to.equal(700);
    });

  });
  
  describe('Calculates available housing funds', function() {

    it('Positive test - should calculate available housing funds', function() {
      var obj = {
        takeHomeIncomeTotal: 6500,
        nonHousingExpenses: 4400
      };
      expect(monthly.availableHousingFunds(obj)).to.equal(2100);
    });

  });
  
  describe('Calculates percentage of income available for housing expenses', function() {

    it('Positive test - should calculate percentage income available', function() {
      var obj = {
        preTaxIncomeTotal: 9000,
        availableHousingFunds: 2100
      }
      expect(monthly.percentageIncomeAvailable(obj)).to.equal(23);
    });

  });

});
