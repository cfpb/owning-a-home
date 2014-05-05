var unformatUSD = require('../../src/js/modules/unformat-usd.js');

var chai = require('chai');
var expect = chai.expect;

describe('Unformat USD format string', function() {

  it('takes a USD formatted string and returns an integer', function() {
    expect(unformatUSD('$200,000.00')).to.equal(200000);
  });

  it('takes a USD formatted string and returns a float', function() {
    expect(unformatUSD('$200,000.67')).to.equal(200000.67);
  });
});
