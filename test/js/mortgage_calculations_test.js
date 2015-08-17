var mortgage = require('../../src/static/js/modules/loan-comparison/mortgage-calculations.js');

var chai = require('chai');
var expect = chai.expect;

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
    it('Positive test - should return the correct downpayment with the given data', function() {
      expect(mortgage['downpayment']({'downpayment-percent': 10, 'price': 200000})).to.equal(20000);
    });
  });

  describe('processing', function() {
    it('Positive test - should return the correct processing with the given data', function() {
      expect(mortgage['processing']({'loan-amount': 180000})).to.equal(1800);
    });
  });

  describe('lender-fees', function() {
    it('Positive test - should return lender fees total equal to processing plus discount points', function() {
      expect(mortgage['lender-fees']({'processing': 1800, 'discount': 3600})).to.equal(5400);
    });

    it('Positive test - should return 0 lender fees with no processing and discount', function() {
      expect(mortgage['lender-fees']({})).to.equal(0);
    });
  });

  describe('third-party-fees', function() {
    it('Positive test - should return third-party-fees equal to third-party-services plus mortgage insurance', function() {
      expect(mortgage['third-party-fees']({"third-party-services": 3000, "insurance": 0})).to.equal(3000);
    });
  });

  describe('third-party-services', function() {
    it('Positive test - should return third-party-services - placeholder 3000', function() {
      expect(mortgage['third-party-services']({})).to.equal(3000);
    });
  });

  describe('insurance', function() {
    it('Positive test - should return insurance with the given loan-amount and mortgage insurance data', function() {
      expect(mortgage['insurance']({'loan-amount': 180000, 'mtg-ins-data': {'upfront': 1}})).to.equal(1800);
    });

    it('Positive test - should return 0 for insurance with no mtg-ins-data', function() {
      expect(mortgage['insurance']({})).to.equal(0);
    });
  });

  describe('taxes-gov-fees', function() {
    it ('Positive test - should return taxes-gov-fees - placeholder 1000', function() {
      expect(mortgage['taxes-gov-fees']({})).to.equal(1000);
    });
  });

  describe('prepaid-expenses', function() {
    it('Positive test - should return the correct prepaid-expenses with the given loan amount, interest rate and price', function() {
      expect(mortgage['prepaid-expenses']({"price": 200000, "interest-rate": 4, "loan-amount": 160000})).to.equal(763.00);
    });

    it('Positive test - should return the correct prepaid-expenses with the given loan amount, interest rate and price', function() {
      expect(mortgage['prepaid-expenses']({"price": 200000, "interest-rate": 4.25, "loan-amount": 180000})).to.equal(814.00);
    });
  });

  describe('initial-escrow', function() {
    it('Positive test - should return the correct initial-escrow with the given price', function() {
      expect(mortgage['initial-escrow']({"price": 200000})).to.equal(500);
    });
  });

  describe('monthly-taxes-insurance', function() {
    it('Positive test - should return the correct monthly-taxes-insurance with the given price', function() {
      expect(mortgage['monthly-taxes-insurance']({"price": 200000})).to.equal(250);
    });
  });

  describe('monthly-hoa-dues', function() {
    it('Positive test - should return the correct monthly-hoa-dues', function() {
      expect(mortgage['monthly-hoa-dues']({})).to.equal(0);
    });
  });

  describe('monthly-principal-interest', function() {
    it('Positive test - should return the correct monthly-principal-interest', function() {
      expect(mortgage['monthly-principal-interest']({"loan-amount": 180000,
        "interest-rate": 4.25,
        "loan-term": 30})).to.equal(885);
    });
  });

  describe('monthly-mortgage-insurance', function() {
    it('Positive test - should return the correct monthly-mortgage-insurance', function() {
      expect(mortgage['monthly-mortgage-insurance']({'loan-amount': 180000, 'mtg-ins-data': {'monthly': 0.57}})).to.equal(85);
    });

    it('Positive test - should return 0 for monthly-mortgage-insurance with no mtg-ins-data', function() {
      expect(mortgage['monthly-mortgage-insurance']({})).to.equal(0);
    });
  });

  describe('monthly-payment', function() {
    it('Positive test - should return the correct monthly-payment with given data', function() {
      expect(mortgage['monthly-payment']({'monthly-taxes-insurance': 250,
        'monthly-mortgage-insurance': 86,
        'monthly-hoa-dues': 0,
        'monthly-principal-interest': 885})).to.equal(1221);
    });
  });

  describe('closing-costs', function() {
    it('Positive test - should return the correct closing costs', function() {
       expect(mortgage['closing-costs']({'downpayment': 20000,
         'discount': 0,
         'processing': 831,
         'third-party-services': 3000,
         'insurance': 10,
         'taxes-gov-fees': 1000,
         'prepaid-expenses': 814,
         'initial-escrow': 500})).to.equal(26155);
     });
  });

  describe('get-cost', function() {
    it('Positive test - it should return the correct cost for get-cost', function() {
    });
  });

  describe('principal-paid', function() {
    it('Positive test - should return the correct principal-paid', function() {
      var loan = {
        'loan-amount': 200000,
        'interest-rate': 5,
        'loan-term': 15,
        'downpayment': 100000,
        'closing-costs': 12000
      };
      var cost = mortgage['principal-paid'](loan);
      expect(cost).to.equal(300000);
    });
  });

  describe('interest-fees-paid', function() {
    it('Positive test - should return the correct interest-fees-paid', function() {
      var loan = {
        'loan-amount': 200000,
        'interest-rate': 5,
        'loan-term': 15,
        'downpayment': 100000,
        'closing-costs': 12000
      };
      var cost = mortgage['interest-fees-paid'](loan);
      expect(cost).to.equal(-3314.29);
    });
  });

  describe('overall-costs', function() {
    it('Positive test - should return the correct overall-costs', function() {
      var loan = {
        'loan-amount': 200000,
        'interest-rate': 5,
        'loan-term': 15,
        'downpayment': 100000,
        'closing-costs': 12000
      };
      var cost = mortgage['overall-costs'](loan);
      expect(cost).to.equal(296685.71);
    });
  });

  describe('loan-summary', function() {
    it('Positive test - should return the correct loan-summary for ARM', function() {
      expect(mortgage['loan-summary']({'arm-type': '3-1',
        'rate-structure': 'arm'})).to.equal("3/1 ARM");
    });

    it('Positive test - should return somewhat correct loan-summary for ARM when arm-type is missing', function() {
      expect(mortgage['loan-summary']({'rate-structure': 'arm'})).to.equal(' ARM');
    });

    it('Positive test - should return the correct loan-summary for Fixed', function() {
      expect(mortgage['loan-summary']({'loan-term': 30,
        'rate-structure': 'fixed',
        'loan-type': 'va'})).to.equal("30-year fixed VA");
    });

    it('Positive test - should return a somewhat correct loan-summary for Fixed, v2', function() {
      expect(mortgage['loan-summary']({'loan-term': 15,
        'rate-structure': 'fixed',
        'loan-type': 'FHA'})).to.equal("15-year fixed undefined");
    });

    it('Positive test - should return the correct loan-summary for Fixed, v3', function() {
      expect(mortgage['loan-summary']({'loan-term': 15,
        'rate-structure': 'fixed',
        'loan-type': 'jumbo'})).to.equal("15-year fixed Jumbo (non-conforming)");
    });
  });

});


