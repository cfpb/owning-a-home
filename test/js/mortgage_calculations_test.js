var mortgage = require('../../src/static/js/modules/loan-comparison/mortgage-calculations.js');

var chai = require('chai');
var expect = chai.expect;

    var loan = {
        // "arm-type": "5-1",
        // "closing-costs": NaN,
        // "credit-score": 700,
        // "discount": 0,
        "downpayment": 40000,
        // "downpayment-percent": 18,
        // "downpayment-too-high": false,
        // "downpayment-too-low": false,
        // "edited": false,
        // "id": 0,
        // "initial-escrow": 550,
        // "insurance": 0,
        // "interest-fees-paid": 148332.08,
        // "interest-rate": "4.500",
        // "is-arm": false,
        // "loan-amount": 180000,
        // "loan-summary": "30-year fixed conventional",
        // "loan-term": 30,
        // "loan-type": "conf",
        // "monthly-hoa-dues": 0,
        // "monthly-mortgage-insurance": 0,
        // "monthly-payment": NaN,
        // "monthly-principal-interest": 912.0335576865941,
        // "monthly-taxes-insurance": 1100,
        // "overall-cost": 368332.08,
        // "points": 0,
        // "prepaid-expenses": 882.88,
        "price": "220000",
        // "principal-paid": 220000,
        // "processing": 1800,
        // "rate-request": null,
        // "rate-structure": "fixed",
        // "state": "CA",
        // "taxes-gov-fees": 1000,
        // "third-party-services": 3000,
    };

describe('Calculates mortgage', function() {

  describe('loan amount', function() {
    it('Positive test - should return the correct loan amount with a price larger than the downpayment', function() {
      expect(mortgage['loan-amount']({"price": 220000, "downpayment": 40000})).to.equal(180000);
    });

    it('Positive test - should return 0 for loan amount with no price and downpayment', function() {
      expect(mortgage['loan-amount']({})).to.equal(0);
    });
  });

  describe('discount', function() {
    it('Positive test - should return the correct discount with a given points and loan-amount', function() {
      expect(mortgage['discount']({"points": 2, "loan-amount": 180000})).to.equal(3600)
    });
  });

  describe('downpayment-percent', function() {
    it('Positive test - should return the correct downpayment-percent with a given downpayment and price', function() {
      expect(mortgage['downpayment-percent']({'downpayment': "40000", 'price': "220000"})).to.equal(18)
    });

    it('Positive test - should return 0 for downpayment-percent with no downpayment and price', function() {
      expect(mortgage['downpayment-percent']({})).to.equal(0);
    });
  });

  describe('downpayment', function() {

  });

  describe('processing', function() {

  });

  describe('third-party-services', function() {

  });

  describe('insurance', function() {

  });

  describe('taxes-gov-fees', function() {

  });

  describe('prepaid-expenses', function() {
    it('Postive test - should return the correct prepaid-expenses with the given loan amount, interest rate and price', function() {
      expect(mortgage['prepaid-expenses']({"price": 200000, "interest-rate": 4, "loan-amount": 160000})).to.equal(763.01);
    });
  });

  describe('initial-escrow', function() {
    it('Positive test - shuold return the correct initial-escrow with the given price', function() {
      expect(mortgage['initial-escrow']({"price": 200000})).to.equal(500);
    });
  });

  // it('Positive test - correctly calculates a the total interest over the life of a 20 year loan', function() {
  //   expect(payment(5, 240, 200000)).to.equal('$116,778.75');
  // });

  // it('Positive test - correctly calculates a the total interest over the life of a 30 year loan', function() {
  //   expect(payment(3.5, 360, 400000)).to.equal('$246,624.35');
  // });

  // --- GH Issue 278 - https://fake.ghe.domain/OAH/OAH-notes/issues/278 --- //
  // This test should catch the exception: Error: Please specify a loan rate as a number
  /* it('Negative test - passes a *Negative* loan rate', function() {
    expect(payment(-3.5, 360, 400000)).to.equal('$246,624.35');
  });
    */

  // --- GH Issue 278 - https://fake.ghe.domain/OAH/OAH-notes/issues/278 --- //
  // This test should catch the exception: Error: Please specify a loan rate as a number
 /* it('Negative test - passes an *Invalid* loan rate', function() {
    expect(payment('*', 360, 400000)).to.equal('$246,624.35');
  });
  */
});


