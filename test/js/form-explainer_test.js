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

  describe('form elements and constants exist on page', function() {
      it('has a wrapper element', function () {
        expect($('.explain')).to.be.ok();
      })

      it('has tabs', function () {
        $TABS = $('.explain').find('.explain_tabs'),
        expect($TABS).to.be.ok();
      })

      it('has pagination', function () {
        var $WRAPPER = $('.explain');
        $PAGINATION = $WRAPPER.find('.explain_pagination'),
        expect($PAGINATION).to.be.ok();
      })

      it('counts all the pages', function () {
        var $WRAPPER = $('.explain');
        $PAGINATION = $WRAPPER.find('.explain_pagination'),
        TOTAL = parseInt( $PAGINATION.find('.pagination_total').text(), 10 );
        expect(TOTAL).to.be.ok();
      })

      it('has an initial tab', function () {
        var DEFAULT_TYPE = 'checklist';
        $INITIAL_TAB = $('.tab-link[data-target="' + DEFAULT_TYPE + '"]').closest('.tab-list');
        expect($INITIAL_TAB).to.be.ok();
      })

      it('shows the first explainer page', function () {
        expect($('.explain_page:visible')).to.be.ok();
      })
  });

  describe('initForm', function() {
    it('sets up the form pages for display', function () {
      var initPageStub = sandbox.stub(formExplainer, 'initPage');
      formExplainer.initForm();

      expect(formExplainer.initPage).to.have.been.calledOnce;

    })
  });

  describe('initPage', function() {
    it('init the page', function () {
      formExplainer.initPage();
    })
  });

  describe('getCurrentPageNum', function() {
    it('should get the number from the currently displayed form page', function() {
      var $WRAPPER = $('.explain');
      var result = formExplainer.getCurrentPageNum($WRAPPER);

      expect(result).to.be.ok();
      expect(result).to.equal(1);
      expect(result).to.be.a('number');
    });
  });

  describe('getPageEl', function() {
    it('should find the DOM element for the specified form page number', function() {
      formExplainer.getPageEl();
    });
  });

  describe('getPageElements', function() {
    it('should find and return an object containing the important elements on the page', function() {
      formExplainer.getPageElements();
    });
  });

});
