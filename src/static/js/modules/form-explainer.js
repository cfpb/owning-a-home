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
  return parseInt( $('.explain_page:visible').attr('id').replace( 'explain_page-', '' ), 10 );
}

/**
 * Get the currently displayed form page as a jQuery object
 * Looks for a visible .explain_page element.
 * @return {object}
 */
function getCurrentPage() {
  return $( '#explain_page-' + getCurrentPageNum() );
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
  if ( $imageMapImage.height() > $WINDOW.height() ) {
    // Since the image map is too tall we need to proportionally shrink it to
    // match the height of the window. It's new width will be represented as
    // imageMapWidthNewPercent.
    var imageMapImageRatio = $imageMapImage.outerWidth() / $imageMapImage.outerHeight(),
        imageMapWidthNewPx,
        imageMapWidthNewPercent;
    imageMapWidthNewPx = $WINDOW.height() * imageMapImageRatio + 30;
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
 * Initialize the form explainer app.
 * @return {null}
 */
function init() {
  var $currentPage = getCurrentPage(),
      $imageMap =         $currentPage.find('.image-map'),
      $imageMapImage =    $currentPage.find('.image-map_image'),
      $imageMapWrapper =  $currentPage.find('.image-map_wrapper'),
      $terms =            $currentPage.find('.terms');
  // Resize the image, terms and pagination columns
  fitToWindow();
  // Initiate a sticky image map only if the terms are taller than the window.
  if ( $terms.height() > $WINDOW.height() ) {
    // When the sticky plugin is applied to the image, it adds position fixed,
    // and the image's width is no longer constrained to its parent.
    // To fix this we will give it its own width that is equal to the parent.
    $imageMapImage.css( 'width', $imageMap.width() );
    $imageMapWrapper.sticky();
    $WINDOW.on( 'scroll', updateStickiness );
  }
}

// Do it!
$(document).ready(function(){
  // Set some constant variables
  $WRAPPER =          $('.explain'),
  $TABS =             $('.explain_tabs'),
  $PAGINATION =       $('.explain_pagination'),
  $WINDOW =           $( window ),
  TOTAL =             parseInt( $('.explain_pagination .pagination_total').text(), 10 );

  // Toggle the different form pages
  $WRAPPER.on( 'click', '.pagination_next, .pagination_prev', function( event ) {
    var currentPage = getCurrentPageNum(),
        newCurrentPage = 0,
        $currentPage = getCurrentPage(),
        isDisabled = $( event.target ).hasClass('btn__disabled'),
        isGoingNext = $( event.target ).hasClass('pagination_next');
    if ( isDisabled ) {
      return;
    }
    // Update the current number and show the new current page
    newCurrentPage = isGoingNext ? (currentPage + 1) : (currentPage - 1);
    if ( isGoingNext && newCurrentPage <= TOTAL ) {
      $('.explain_page').hide();
      $( '#explain_page-' + newCurrentPage ).show();
      $('.explain_pagination .pagination_current').text( newCurrentPage );
    }
    if ( !isGoingNext && newCurrentPage >= 1 ) {
      $('.explain_page').hide();
      $( '#explain_page-' + newCurrentPage ).show();
      $('.explain_pagination .pagination_current').text( newCurrentPage );
    }
    // Update the disabled button
    console.log( newCurrentPage );
    $('.explain_pagination .pagination_prev, .explain_pagination .pagination_next').removeClass('btn__disabled');
    if ( newCurrentPage === 1 ) {
      $('.explain_pagination .pagination_prev').addClass('btn__disabled');
    } else if ( newCurrentPage === TOTAL ) {
      $('.explain_pagination .pagination_next').addClass('btn__disabled');
    }
    // Call init() again to set up the next page
    init();
    // Reset the filters
    $('.explain_tabs .tab-list:eq(0)').click();
    // Scroll to the top of the forms
    $.scrollTo( $TABS, {
      duration: 400,
      offset: 0
    });
  });

  // Filter the expandables via the tabs
  $WRAPPER.on( 'click', '.explain_tabs .tab-list', function( event ) {
    var target = $(this).find('[data-target]').data('target'),
        $terms = getCurrentPage().find('.terms');
    event.preventDefault();
    // Update the tab state
    $('.explain_tabs .tab-list').removeClass('active-tab');
    $(this).addClass('active-tab');
    // Filter the expandables
    if ( target === 'all' ) {
      getCurrentPage().find('.expandable__form-explainer').show();
      getCurrentPage().find('.image-map_overlay').show();
    } else {
      getCurrentPage().find('.expandable__form-explainer').hide();
      getCurrentPage().find( '.expandable__form-explainer-' + target ).show();
      getCurrentPage().find('.image-map_overlay').hide();
      getCurrentPage().find( '.image-map_overlay__' + target ).show();
    }
    // Scroll down to the list of terms
    $.scrollTo( $terms, {
      duration: 200,
      offset: 0
    });
  });

  // Scroll to the proper item when the corresponding form dot is selected
  $WRAPPER.on( 'click', '.image-map_overlay', function( event ) {
    event.preventDefault();
    var itemID = $( this ).attr('href');
    $.scrollTo( $(itemID), {
      duration: 200,
      offset: 0
    });
    $( itemID ).get(0).expand();
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
  init();
});
