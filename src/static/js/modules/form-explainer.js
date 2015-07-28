var $ = require('jquery');
var sticky = require('../../vendor/sticky/jquery.sticky.js');
require('../../vendor/jquery.easing/jquery.easing.js');
require('jquery.scrollto');
require('../../vendor/cf-expandables/cf-expandables.js');
require('./nemo');
require('./nemo-shim');
var debounce = require('debounce');

var formExplainer = {};

// Constants. These variables should not change.
var $WRAPPER, $TABS, $PAGINATION, $WINDOW, TOTAL;

// Keys to sections on page.
var termsList = '.explain_terms';

// TODO: define category list in calling page, and
// also pass it to form-explainer.html to construct tabs
var CATEGORIES = ['checklist', 'definitions'];
var DEFAULT_TYPE = 'checklist';
var $INITIAL_TAB;

var resized;

var stickBottom = 'js-sticky-bottom';

/**
 * Get the currently displayed form page as a number.
 * Grabs the number from the currently displayed .explain_page element ID.
 * @return {number}
 */
formExplainer.getCurrentPageNum = function() {
  return parseInt( $WRAPPER.find('.explain_page:visible').attr('id').replace( 'explain_page-', '' ), 10 );
};

function getPageEl (pageNum) {
  return $WRAPPER.find('#explain_page-' + pageNum);
}

function getPageElements (pageNum) {
  var $page = getPageEl(pageNum);
  return {
    $page:             $page,
    $imageMap:         $page.find('.image-map'),
    $imageMapImage:    $page.find('.image-map_image'),
    $imageMapWrapper:  $page.find('.image-map_wrapper'),
    $terms:            $page.find('.terms')
  }
}

function calculateNewImageWidth (imageWidth, imageHeight) {
  var imageMapImageRatio = (imageWidth + 2) / (imageHeight + 2);
  return ($WINDOW.height() - 60) * imageMapImageRatio + 30;
}

function resizeImage (els, windowResize) {
  var pageWidth = els.$page.width();
  var $image = els.$imageMapImage;
  var currentHeight = $image.height();
  var currentWidth = $image.width();
  var actualWidth = $image.data("actual-width");
  var actualHeight = $image.data("actual-height");
  var windowHeight = $WINDOW.innerHeight() - 60;
  var newWidth;
  var newWidthPercentage;

  // If the image is too tall for the window, resize it proportionally,
  // then update the adjacent terms column width to fit.
  // On window resize, also check if image is now too small & resize,
  // but only if we've stored the actual image dimensions for comparison.
  if ( currentHeight > windowHeight || (windowResize && actualWidth && actualHeight)) {
    // determine new width
    newWidth = calculateNewImageWidth(currentWidth, currentHeight);
    if (newWidth > actualWidth) {
      newWidth = actualWidth;
    }
    // update element widths
    newWidthPercentage = newWidth / pageWidth * 100;
    // on screen less than 800px wide, the terms need a minimum 33%
    // width or they become too narrow to read
    if ($WINDOW.width() <= 800 && newWidthPercentage > 67) {
      newWidthPercentage = 67;
    }
    els.$imageMap.css( 'width', newWidthPercentage + '%' );
    $PAGINATION.css( 'width', newWidthPercentage + '%' );
    els.$terms.css( 'width', (100 - newWidthPercentage) + '%' );
  }
}

function setImageElementWidths (els) {
  // When the sticky plugin is applied to the image, it adds position fixed,
  // and the image's width is no longer constrained to its parent.
  // To fix this we will give it its own width that is equal to the parent.
  // (IE8 wants a width on the wrapper too)
  var containerWidth = els.$imageMap.width();
  els.$imageMapWrapper.width(containerWidth);
  els.$imageMapImage.width(containerWidth);
}

function storeImageDimensions ($image) {
  $image.data('actual-width', $image.width());
  $image.data('actual-height', $image.height());
}

function stickImage($el) {
  $el.sticky({ topSpacing: 30 });
}

/**
 * Limit .image-map_image to the height of the window and then adjust the two
 * columns to match.
 * @return {null}
 */
function fitAndStickToWindow(els, pageNum) {
  // http://stackoverflow.com/questions/318630/get-real-image-width-and-height-with-javascript-in-safari-chrome
  $('<img/>')
    .load( function() {
      // store image width for use in calculations on window resize
      if (pageNum) {
        storeImageDimensions(els.$imageMapImage);
      }

      // if image is too tall/small, fit it to window dimensions
      resizeImage(els, !pageNum);

      // set width values on image elements
      setImageElementWidths(els);

      if (pageNum || els.$imageMapImage.closest('.sticky-wrapper').length == 0) {
        // stick image to window
        stickImage(els.$imageMapWrapper);
      } else {
        updateStickiness()
      }
      // hide pages except for first
      if (pageNum > 1) {
          els.$page.hide();
      }
    })
    // This order is necessary so that IE8 doesn't fire the onload event
    // before the src is set for cached images
    // http://stackoverflow.com/questions/14429656/onload-callback-on-image-not-called-in-ie8
    .attr( 'src', els.$imageMapImage.attr('src') );
}

/**
 * Override sticky() if the viewport has been scrolled past $currentPage so that
 * the sticky element does not overlap content that comes after $currentPage.
 * @return {null}
 */
function updateStickiness() {
  var els =  getPageElements(formExplainer.getCurrentPageNum());
  var max = els.$page.offset().top + els.$page.height() - els.$imageMapWrapper.height();
  if ($WINDOW.scrollTop() >= max && !els.$imageMapWrapper.hasClass(stickBottom)) {
    els.$imageMapWrapper.addClass(stickBottom);
  } else if ($WINDOW.scrollTop() < max && els.$imageMapWrapper.hasClass(stickBottom)) {
    els.$imageMapWrapper.removeClass(stickBottom);
  }
}

/**
 * Paginate through the various form pages.
 * @return {null}
 */
function paginate( direction ) {
  var currentPage = formExplainer.getCurrentPageNum(), newCurrentPage;
  if ( direction === 'next' ) {
    newCurrentPage = currentPage + 1;
  } else if ( direction === 'prev' ) {
    newCurrentPage = currentPage - 1;
  }
  // Move to the next or previous page if it's not the first or last page.
  if ( direction === 'next' && newCurrentPage <= TOTAL ||
       direction === 'prev' && newCurrentPage >= 1 ) {
    // Scroll the window up to the tabs.
    $.scrollTo( $TABS, {
      duration: 600,
      offset: -30
    });
    // After scrolling the window, fade out the current page.
    var fadeOutTimeout = window.setTimeout(function () {
      getPageEl(formExplainer.getCurrentPageNum()).fadeOut( 450 );
      window.clearTimeout( fadeOutTimeout );
    }, 600);
    // After fading out the current page, fade in the new page.
    var fadeInTimeout = window.setTimeout(function () {
      getPageEl(newCurrentPage).fadeIn( 700 );
      stickyHack();
      window.clearTimeout( fadeInTimeout );
      if (resized ) {
        setupImage(newCurrentPage);
      }
    }, 1050);
  }
  // Update the pagination numbers.
  $WRAPPER.find('.explain_pagination .pagination_current').text( newCurrentPage );
  // Update the previous/next buttons if the new page is the first or last.
  $('.explain_pagination .pagination_prev, .explain_pagination .pagination_next').removeClass('btn__disabled');
  if ( newCurrentPage === 1 ) {
    $WRAPPER.find('.explain_pagination .pagination_prev').addClass('btn__disabled');
  } else if ( newCurrentPage === TOTAL ) {
    $WRAPPER.find('.explain_pagination .pagination_next').addClass('btn__disabled');
  }
}

function setupImage (pageNum, pageLoad) {
  var pageEls = getPageElements(pageNum);
  if ($WINDOW.width() >= 600) {
    // update widths & stickiness on larger screens
    // we only pass in the pageNum on pageLoad, when
    // pages after the first will be hidden once they're
    // fully loaded & we've calculated their widths
    fitAndStickToWindow(pageEls, pageLoad ? pageNum : null);
  } else if (!pageLoad) {
    // if this is called on screen resize instead of page load,
    // remove width values & call unstick on the imageWrapper
    pageEls.$imageMapWrapper.width('').removeClass(stickBottom);
    pageEls.$imageMap.width('');
    pageEls.$imageMapImage.width('');
    pageEls.$terms.width('');
    pageEls.$imageMapWrapper.unstick();
  } else if (pageNum > 1) {
    // on page load, hide pages except first
    pageEls.$page.hide();
  }
}

formExplainer.initForm = function () {
  // Loop through each page, setting its dimensions properly and activating the
  // sticky() plugin.
  $WRAPPER.find('.explain_page').each(function( index ) {
    formExplainer.initPage(index + 1);
  });
}

/**
 * Initialize a page.
 * @return {null}
 */
formExplainer.initPage = function (id) {
  setupImage(id, true);
  setCategoryPlaceholders(id);
}

/**
 * Weird hack to get sticky() to update properly.
 * We're basically jinggling the window to force a sticky() repaint.
 * Sometimes it just needs a push I guess?
 * @return {null}
 */
function stickyHack() {
  $WINDOW.scrollTop( $WINDOW.scrollTop() + 1 );
  $WINDOW.scrollTop( $WINDOW.scrollTop() - 1 );
}

/**
 * Set category placeholders
 * @return {null}
 */
function setCategoryPlaceholders( id ) {
  var $page = getPageEl(id), placeholder;
  for (var i = 0; i < CATEGORIES.length; i++) {
    var category = CATEGORIES[i];
    if (!categoryHasContent($page, category)) {
      placeholder = generatePlaceholderHtml(category);
      $page.find('.explain_terms').append(placeholder);
    }
  }
}

function generatePlaceholderHtml (category) {
  return '' +
  '<div class="expandable expandable__padded expandable__form-explainer ' +
              'expandable__form-explainer-' + category + ' ' +
              'expandable__form-explainer-placeholder">' +
    '<span class="expandable_header">' +
      'No ' + category + ' on this page. ' +
      'Filter by another category above or page ahead to continue exploring ' +
      category + '.' +
    '</span>' +
  '</div>';
}

function categoryHasContent ($page, category) {
  return $page.find('.expandable__form-explainer-' + category).length;
}

function filterExplainers ($currentTab, type) {
    // Update the tab state
    $('.explain_tabs .tab-list').removeClass('active-tab');
    $currentTab.addClass('active-tab');

    // Filter the expandables
    $WRAPPER.find('.expandable__form-explainer').hide();
    $WRAPPER.find('.image-map_overlay').hide();
    $WRAPPER.find('.expandable__form-explainer-' + type).show();
    $WRAPPER.find('.image-map_overlay__' + type).show();
}

function toggleScrollWatch() {
  $WINDOW.off('scroll.stickiness');
  if ($WINDOW.width() >= 600) {
    $WINDOW.on('scroll.stickiness', debounce(updateStickiness, 20));
  }
}

function addTabindex() {
  var $link = $('.expandable__form-explainer .expandable_content a');
  $link.attr('tabindex', 0);
}

// Kick things off on document ready.
$(document).ready(function(){
  // cache elements
  $WRAPPER =    $('.explain'),
  $TABS =       $WRAPPER.find('.explain_tabs'),
  $PAGINATION = $WRAPPER.find('.explain_pagination'),
  $WINDOW =     $( window ),
  TOTAL =       parseInt( $PAGINATION.find('.pagination_total').text(), 10 );
  $INITIAL_TAB = $('.tab-link[data-target="' + DEFAULT_TYPE + '"]').closest('.tab-list');

  // set up the form pages for display
  formExplainer.initForm();

  // filter initial state
  filterExplainers($INITIAL_TAB, DEFAULT_TYPE);

  // add scroll listener for larger windows
  toggleScrollWatch();

  // set tabindex for links in expandables content
  addTabindex();

  // add resize listener
  var prevWindowWidth = $WINDOW.width();
  var prevWindowHeight = $WINDOW.height();
  var isIE = $('html').hasClass('lt-ie9');

  $(window).on("resize",debounce(function(){
    //resize things
    // apparently IE fires a window resize event when anything in the page
    // resizes, so for IE we need to check that the window dimensions have
    // actually changed
    if (isIE) {
      var currWindowHeight = $WINDOW.height();
      var currWindowWidth = $WINDOW.width();
      if (currWindowHeight === prevWindowHeight && currWindowWidth === prevWindowWidth) {
        return;
      } else {
        prevWindowWidth = currWindowWidth;
        prevWindowHeight = currWindowHeight;
      }
    }
    resized = true;
    setupImage(formExplainer.getCurrentPageNum());
    toggleScrollWatch();
  }));

  // Pagination events
  $WRAPPER.find( '.explain_pagination .pagination_next' ).on( 'click', function( event ) {
    if ( !$( event.currentTarget ).hasClass('btn__disabled') ) {
      paginate('next');
    }
  });
  $WRAPPER.find( '.explain_pagination .pagination_prev' ).on( 'click', function( event ) {
    if ( !$( event.currentTarget ).hasClass('btn__disabled') ) {
      paginate('prev');
    }
  });

  // Filter the expandables via the tabs
  $WRAPPER.on( 'click', '.explain_tabs .tab-list', function( event ) {
    var $selectedTab = $(this);
    var explainerType = $selectedTab.find('[data-target]').data('target');

    filterExplainers($selectedTab, explainerType);

    $.scrollTo( $TABS, {
      duration: 200,
      offset: -30
    });
  });

  // When an overlay is clicked, toggle the corresponding expandable and scroll
  // the page until it is in view.
  $WRAPPER.on( 'click', '.image-map_overlay', function( event ) {
    event.preventDefault();
    var itemID = $( this ).attr('href');
    $.scrollTo( $(itemID), {
      duration: 200,
      offset: -30
    });
  });

  $WRAPPER.on( 'focus', '.expandable__form-explainer, .expandable__form-explainer .expandable_target', function( ) {
    var $this = $(this),
     itemID = $this.hasClass('expandable__form-explainer') ? $this.attr('id') : $this.parent('.expandable__form-explainer').attr('id'),
      $overlay = $('.image-map_overlay'),
      $target = $('a[href=#' + itemID + ']');
    $overlay.removeClass('has-attention');
    $target.addClass('has-attention');
  });

  // When mousing over a term or highlighted area of the image map,
  // call attention to the associated map area or term, respectively.
  $WRAPPER.on( 'mouseenter mouseleave', '.image-map_overlay, .expandable__form-explainer', function( event ) {
    event.preventDefault();
    var $target,
        $this = $(this);
    if ( typeof $this.attr('href') !== 'undefined' ) {
      $target = $( $this.attr('href') );
    } else  if ( typeof $this.attr('id') !== 'undefined' ) {
      $target = $('[href=#'+$this.attr('id')+']');
    }
    if ( typeof $target !== 'undefined' ) {
      // remove class from all
      $('.expandable__form-explainer, .image-map_overlay').removeClass('has-attention');
      if ( $target.hasClass('has-attention') ) {
        $target.removeClass('has-attention');
      } else {
        $target.addClass('has-attention');
      }
    }
  });

});

module.exports = formExplainer;
