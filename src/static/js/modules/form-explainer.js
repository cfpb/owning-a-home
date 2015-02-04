var $ = require('jquery');
require('sticky');
require('jquery-easing');
require('jquery.scrollto');
require('cf-expandables');

// Constants. These variables should not change.
var $WRAPPER, $TABS, $PAGINATION, $WINDOW, TOTAL;

/**
 * Get the currently displayed form page as a number.
 * Grabs the number from the currently displayed .explain_page element ID.
 * @return {number}
 */
function getCurrentPageNum() {
  return parseInt( $WRAPPER.find('.explain_page:visible').attr('id').replace( 'explain_page-', '' ), 10 );
}

/**
 * Get the currently displayed form page as a jQuery object
 * Looks for a visible .explain_page element.
 * @return {object}
 */
function getCurrentPage() {
  return $WRAPPER.find( '#explain_page-' + getCurrentPageNum() );
}

/**
 * Limit .image-map_image to the height of the window and then adjust the two
 * columns to match.
 * @return {null}
 */
function fitToWindow() {
  var $currentPage =      getCurrentPage(),
      $imageMap =         $currentPage.find('.image-map'),
      $imageMapImage =    $currentPage.find('.image-map_image'),
      $imageMapWrapper =  $currentPage.find('.image-map_wrapper'),
      $terms =            $currentPage.find('.terms');
  // In order to make the image map sticky we must first make sure it will fit
  // completely within the window.
  if ( $imageMapImage.height() > ($WINDOW.height() + 60) ) {
    // Since the image map is too tall we need to proportionally shrink it to
    // match the height of the window. It's new width will be represented as
    // imageMapWidthNewPercent.
    var imageMapImageRatio = $imageMapImage.outerWidth() / $imageMapImage.outerHeight(),
        imageMapWidthNewPx,
        imageMapWidthNewPercent;
    imageMapWidthNewPx = ($WINDOW.height() - 60) * imageMapImageRatio + 30;
    imageMapWidthNewPercent = imageMapWidthNewPx / $currentPage.width() * 100;
    $imageMap.css( 'width', imageMapWidthNewPercent + '%' );
    $PAGINATION.css( 'width', imageMapWidthNewPercent + '%' );
    // Then we need to adjust the second column to match the image map's new width.
    $terms.css( 'width', (100 - imageMapWidthNewPercent) + '%' );
  }
}

/**
 * Override .sticky() if the viewport has been scrolled past $currentPage so that
 * the sticky element does not overlap content that comes after $currentPage.
 * @return {null}
 */
function updateStickiness() {
  var $currentPage =      getCurrentPage(),
      $imageMap =         $currentPage.find('.image-map'),
      $imageMapImage =    $currentPage.find('.image-map_image'),
      $imageMapWrapper =  $currentPage.find('.image-map_wrapper'),
      $terms =            $currentPage.find('.terms'),
      max = $currentPage.offset().top + $currentPage.height() - $imageMapWrapper.height(),
      stickBottom = 'js-sticky-bottom';
  if ( $WINDOW.scrollTop() >= max && !$imageMapWrapper.hasClass( stickBottom ) ) {
    $imageMapWrapper.addClass( stickBottom );
  } else if ( $WINDOW.scrollTop() < max && $imageMapWrapper.hasClass( stickBottom ) ) {
    $imageMapWrapper.removeClass( stickBottom );
  }
}

/**
 * Paginatie through the various form pages.
 * @return {null}
 */
function paginate( direction ) {
  var currentPage = getCurrentPageNum(),
      newCurrentPage = currentPage;
  if ( direction === 'next' ) {
    newCurrentPage = currentPage + 1;
  } else if ( direction === 'prev' ) {
    newCurrentPage = currentPage - 1;
  }
  // Move to the next or previous page if it's not the first or last page.
  if ( direction === 'next' && newCurrentPage <= TOTAL ||
       direction === 'prev' && newCurrentPage >= 1 ) {
    $WRAPPER.find('.explain_page').hide();
    $WRAPPER.find( '#explain_page-' + newCurrentPage ).show();
    $WRAPPER.find('.explain_pagination .pagination_current').text( newCurrentPage );
  }
  // Update the previous/next buttons if the new page is the first or last.
  $('.explain_pagination .pagination_prev, .explain_pagination .pagination_next').removeClass('btn__disabled');
  if ( newCurrentPage === 1 ) {
    $WRAPPER.find('.explain_pagination .pagination_prev').addClass('btn__disabled');
  } else if ( newCurrentPage === TOTAL ) {
    $WRAPPER.find('.explain_pagination .pagination_next').addClass('btn__disabled');
  }
  // Iniitialize the page if it hasn't already been done.
  if ( typeof getCurrentPage().data('explain-initialized') === 'undefined' ) {
    initPage();
  }
  $.scrollTo( $TABS, {
    duration: 400,
    offset: -30
  });
}

/**
 * Initialize a page.
 * @return {null}
 */
function initPage() {
  var $currentPage =      getCurrentPage(),
      $imageMap =         $currentPage.find('.image-map'),
      $imageMapImage =    $currentPage.find('.image-map_image'),
      $imageMapWrapper =  $currentPage.find('.image-map_wrapper'),
      $terms =            $currentPage.find('.terms');
  // Resize the image, terms and pagination columns
  fitToWindow();
  // When the sticky plugin is applied to the image, it adds position fixed,
  // and the image's width is no longer constrained to its parent.
  // To fix this we will give it its own width that is equal to the parent.
  $imageMapImage.css( 'width', $imageMap.width() );
  $imageMapWrapper.sticky({ topSpacing: 30 });
  $WINDOW.on( 'scroll', updateStickiness );
  // Set a property so we don't keep re-initializing it.
  $currentPage.data('explain-initialized', 'true');
}

// Kick things off on document ready.
$(document).ready(function(){

  // Set some constant variables
  $WRAPPER =    $('.explain'),
  $TABS =       $WRAPPER.find('.explain_tabs'),
  $PAGINATION = $WRAPPER.find('.explain_pagination'),
  $WINDOW =     $( window ),
  TOTAL =       parseInt( $PAGINATION.find('.pagination_total').text(), 10 );

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
    var target = $(this).find('[data-target]').data('target'),
        $terms = $WRAPPER.find('.explain_terms');
    // Update the tab state
    $('.explain_tabs .tab-list').removeClass('active-tab');
    $(this).addClass('active-tab');
    // Filter the expandables
    if ( target === 'all' ) {
      $WRAPPER.find('.expandable__form-explainer').show();
      $WRAPPER.find('.image-map_overlay').show();
    } else {
      $WRAPPER.find('.expandable__form-explainer').hide();
      $WRAPPER.find( '.expandable__form-explainer-' + target ).show();
      $WRAPPER.find('.image-map_overlay').hide();
      $WRAPPER.find( '.image-map_overlay__' + target ).show();
    }
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
    $( itemID ).get(0).toggle();
  });

  // Scroll to the proper item when the corresponding form dot is selected
  $WRAPPER.on( 'mouseenter mouseleave', '.image-map_overlay, .expandable__form-explainer', function( event ) {
    event.preventDefault();
    var $target;
    if ( typeof $( this ).attr('href') !== 'undefined' ) {
      $target = $( $(this).attr('href') );
    } else  if ( typeof $( this ).attr('id') !== 'undefined' ) {
      $target = $('[href=#'+$( this ).attr('id')+']');
    }
    if ( $target.hasClass('has-attention') ) {
      $target.removeClass('has-attention');
    } else {
      $target.addClass('has-attention');
    }
  });

  // Kick things off
  initPage();
});
