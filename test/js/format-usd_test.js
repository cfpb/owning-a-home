var formatUSD = require('../../src/js/modules/format-usd.js');

var chai = require('chai');
var expect = chai.expect;

describe('Formats USD', function() {

  it('formats a number to USD format', function() {
    expect(formatUSD(200000)).to.equal('$200,000.00');
  });

  it('Negative test - this should fail based on the number of decimal places passed as argument', function() {
    expect(formatUSD(200000, 5)).to.equal('$200,000.00');
  });

  it('Negative test - passing a negative number', function() {
    expect(formatUSD(-200000)).to.equal('-$200,000.00');
  });

  it('Negative test - passing a decimal number', function() {
    expect(formatUSD(-200000.1)).to.equal('-$200,000.10');
  });

  it('formats a numerical string to USD format', function() {
    expect(formatUSD('200000')).to.equal('$200,000.00');
  });

  it('Negative test - this should fail based on the number of decimal places passed as argument', function() {
    expect(formatUSD('200000', 5)).to.equal('$200,000.00');
  });

  it('Negative test - passing a negative numerical string', function() {
    expect(formatUSD('-200000')).to.equal('-$200,000.00');
  });

  it('Negative test - passing a character string', function() {
    expect(formatUSD('ABC')).to.equal('$0.00');
  });

  it('Negative test - passing a string with invalid characters', function() {
    expect(formatUSD('@/#$%^&*.!')).to.equal('$0.00');
  });

});
