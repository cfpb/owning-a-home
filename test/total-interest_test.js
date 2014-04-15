var payment = require('../src/static/js/modules/total-interest-calc.js');

var chai = require('chai');
var expect = chai.expect;

describe('Calculates the total interest of a loan', function() {
  it('correctly calculates a the total interest over the life of a loan', function() {
    expect(payment(5, 240, 200000)).to.equal('$116,778.75');
  });

});