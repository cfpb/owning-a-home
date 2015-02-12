var expect = require('chai').expect;
var jsdom = require('mocha-jsdom');

describe('Humanize loan type', function() {

  var $, dd;

  jsdom();

  before(function () {
    $ = require('jquery');
    humanize = require('../../src/static/js/modules/humanize-loan-type.js');
  });

  beforeEach(function(){

  });

  it('should convert conf to conventional', function() {
    var loan = 'conf';
    loan = humanize( loan );
    expect( loan ).to.eql('conventional');
  });

  it('should capitalize other stuff', function() {
    var loan = 'foo';
    loan = humanize( loan );
    expect( loan ).to.eql('FOO');
  });

});
