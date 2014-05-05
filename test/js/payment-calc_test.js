var payment = require('../../src/js/modules/payment-calc.js');

var chai = require('chai');
var expect = chai.expect;

describe('Payment calculation tests', function() {
  it('correctly calculates a monthly payment', function() {
    expect(payment(5, 240, 200000)).to.equal('$1,319.91');
  });

});