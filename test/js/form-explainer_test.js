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
    it('initialize a page, set up the image, and set categories', function () {
      var setupImageStub = sandbox.stub(formExplainer, 'setupImage');
      var setCategoryPlaceholdersStub = sandbox.stub(formExplainer, 'setCategoryPlaceholders');

      formExplainer.initPage(1);

      expect(formExplainer.setupImageStub).to.have.been.calledOnce;
      expect(formExplainer.setCategoryPlaceholdersStub).to.have.been.calledOnce;
    })
  });

  describe('getPageEl', function() {
    it('should find the DOM element for the specified form page number', function() {
      var result = formExplainer.getPageEl(1);
      expect(result).to.be.ok();
      expect(result.selector).to.equal('.explain #explain_page-1');
    });
  });

  describe('getPageElements', function() {
    it('should find and return an object containing the important elements for a given page', function() {
      var result = formExplainer.getPageElements(1);

      expect(result).to.be.ok();
      expect(result.$page.selector).to.equal('.explain #explain_page-1');
      expect(result.$imageMap.selector).to.equal('.explain #explain_page-1 .image-map');
      expect(result.$imageMapImage.selector).to.equal('.explain #explain_page-1 .image-map_image');
      expect(result.$imageMapWrapper.selector).to.equal('.explain #explain_page-1 .image-map_wrapper');
      expect(result.$terms.selector).to.equal('.explain #explain_page-1 .terms');
    });
  });

  describe('calculateNewImageWidth', function() {
    it('calculate image width based on window height', function() {
      var result = formExplainer.calculateNewImageWidth(705, 912, 1000);
      expect(result).to.be.ok();
      expect(result).to.be.a('number');
    });
  });

  describe('resizeImage', function() {

    beforeEach(function () {
      var calculateNewImageWidthStub = sandbox.stub(formExplainer, 'calculateNewImageWidth');
    });

    it('resizes the form image so it fits into the window', function() {
      var pageEls = formExplainer.getPageElements(1);
      formExplainer.resizeImage(pageEls, true);
      expect(formExplainer.calculateNewImageWidthStub).to.have.been.calledOnce;
    });

    it('does not resize the form image if window has not resized', function() {
      var pageEls = formExplainer.getPageElements(1);
      formExplainer.resizeImage(pageEls, false);
      expect(formExplainer.calculateNewImageWidthStub).to.not.have.been.called;
    });

  });

  describe('setImageElementWidths', function() {
    it('set the image width to match the image wrapper width due to sticky fixed positioning madness', function() {
      var pageEls = formExplainer.getPageElements(1);
      formExplainer.setImageElementWidths(pageEls);
      expect(jQuery.width).to.have.been.calledTwice;
    });
  });

  describe('storeImageDimensions', function() {
    it('stores the image width and height as jQuery data', function() {
      var pageEls = formExplainer.getPageElements(1);
      var image = pageEls.$imageMapImage;
      formExplainer.storeImageDimensions(image);
      expect(jQuery.data).to.have.been.calledTwice;
    });
  });

  describe('stickImage', function() {
    it('call sticky plugin for the specified element', function() {
      var pageEls = formExplainer.getPageElements(1);
      var wrapper = pageEls.$imageMapWrapper;
      wrapper.sticky = function() {};
      var stickyStub = sandbox.stub(wrapper, 'sticky');

      formExplainer.stickImage(wrapper);
      expect(wrapper.sticky).to.have.been.calledOnce;
    });
  });

  describe('fitAndStickToWindow', function() {

    beforeEach(function () {
      var storeImageDimensionsStub = sandbox.stub(formExplainer, 'storeImageDimensions');
      var resizeImageStub = sandbox.stub(formExplainer, 'resizeImage');
      var setImageElementWidthsStub = sandbox.stub(formExplainer, 'setImageElementWidths');
    });

    it('limits the form image to the height of the window and adjusts other elements to match', function() {
      var pageEls = formExplainer.getPageElements(1);

      formExplainer.fitAndStickToWindow(pageEls, 1);

      expect(jQuery.load).to.have.been.calledOnce;
      expect(formExplainer.storeImageDimensionsStub).to.have.been.calledOnce;
      expect(formExplainer.resizeImageStub).to.have.been.calledOnce;
      expect(formExplainer.setImageElementWidthsStub).to.have.been.calledOnce;
      expect(jQuery.attr).to.have.been.calledOnce;

    });

    it('run before page load and without pageNum', function() {
      var pageEls = formExplainer.getPageElements(1);

      formExplainer.fitAndStickToWindow(pageEls, null);
      expect(jQuery.load).to.have.been.calledOnce;
      expect(formExplainer.storeImageDimensionsStub).to.not.have.been.called;
      expect(formExplainer.resizeImageStub).to.have.been.calledOnce;
      expect(formExplainer.setImageElementWidthsStub).to.have.been.calledOnce;
      expect(jQuery.attr).to.have.been.calledOnce;

    });

  });

  describe('updateStickiness', function() {
    // @TODO: this is not done...need to check imageMapWrapper class
    it('overrides sticky plugin to avoid overlapping content', function() {
      var pageEls = formExplainer.getPageElements(1);
      var $WINDOW = {
        scrollTop: function() {
          return 0;
        }
      };
      pageEls.$page.offset = function () {
        return {
          top: 1000,
          left: 0
        };
      }
      formExplainer.updateStickiness(pageEls);
      expect(jQuery.removeClass).to.have.been.calledOnce;
    });
  });

});
