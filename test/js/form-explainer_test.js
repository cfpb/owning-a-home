var chai = require('chai');
var expect = chai.expect;
var $;
var formExplainer;
var sticky;
var sinon = require('sinon');
var jsdom = require('mocha-jsdom');
var sandbox;

describe('Form explainer tests', function() {

  jsdom({
    file: 'test/js/fixtures/form-explainer.html',
    console: false
  });

  before(function () {
    $ = require('../../src/static/vendor/jquery/jquery.js');
    jQuery = require('../../src/static/vendor/jquery/jquery.js');
    sticky = require('../../src/static/vendor/sticky/jquery.sticky.js');
    formExplainer = require('../../src/static/js/modules/form-explainer.js');
  });

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('has a wrapper element', function () {
    expect($('.explain')).to.be.ok();
  })

  it('shows the first explainer page', function () {
    expect($('.explain_page:visible')).to.be.ok();
  })

  describe('initForm', function() {
    it('sets up the form pages for display', function () {
      var initPageStub = sandbox.stub(formExplainer, 'initPage');
      formExplainer.initForm();

      expect(formExplainer.initPage).to.have.been.calledOnce;

    })
  });

  describe('getCurrentPageNum', function() {
    it('should get the number from the currently displayed form page', function() {

    });
  });

});
