var expect = require('chai').expect;
var jsdom = require('mocha-jsdom');

describe('Prepare worksheets', function() {

  var $,
      worksheets;

  // Load in the HTML of the prepare-worksheets page. It'd be ideal to load the
  // live content but Sheer makes that difficult.
  jsdom({
    file: 'test/js/fixtures/prepare-worksheets.html',
    console: false
  });

  before(function () {
    $ = require('jquery');
    jQuery = require('jquery');
    worksheets = require('../../src/static/js/modules/prepare-worksheets/prepare-worksheets.js');
  });

  beforeEach(function() {

  });

  it('should complain if you don\'t specify a target', function() {

  });

});