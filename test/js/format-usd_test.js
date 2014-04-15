var formatUSD = require('../../src/static/js/modules/format-usd.js');

var chai = require('chai');
var expect = chai.expect;

describe('Formats USD', function() {

  it('formats a number to USD format', function() {
    expect(formatUSD(200000)).to.equal('$200,000.00');
  });

  it('formats a numerical string to USD format', function() {
    expect(formatUSD('200000')).to.equal('$200,000.00');
  });

});
