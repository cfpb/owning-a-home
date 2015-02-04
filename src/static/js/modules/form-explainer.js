var $ = require('jquery');
require('sticky');
require('jquery-easing');
require('jquery.scrollto');
require('cf-expandables');

var $wrapper =          $('.explain'),
    $tabs =             $('.explain_tabs'),
    $pagination =       $('.explain_pagination'),
    $window =           $( window ),
    total =             parseInt( $('.explain_pagination .pagination_total').text() );

/**
 * Get the currently displayed form page as a number
 * @return {number}
 */
function getCurrentPageNum() {
  return parseInt( $('.explain_page:visible').attr('id').replace( 'explain_page-', '' ) );
}

/**
 * Get the currently displayed form page as a jQuery object
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
  if ( $imageMapImage.height() > $window.height() ) {
    // Since the image map is too tall we need to proportionally shrink it to
    // match the height of the window. It's new width will be represented as
    // imageMapWidthNewPercent.
    var imageMapImageRatio = $imageMapImage.outerWidth() / $imageMapImage.outerHeight(),
        imageMapWidthNewPx,
        imageMapWidthNewPercent;
    imageMapWidthNewPx = $window.height() * imageMapImageRatio + 30;
    imageMapWidthNewPercent = imageMapWidthNewPx / $currentPage.width() * 100;
    $imageMap.css( 'width', imageMapWidthNewPercent + '%' );
    $pagination.css( 'width', imageMapWidthNewPercent + '%' );
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
  if ( $window.scrollTop() >= max && !$imageMapWrapper.hasClass( stickBottom ) ) {
    $imageMapWrapper.addClass( stickBottom );
  } else if ( $window.scrollTop() < max && $imageMapWrapper.hasClass( stickBottom ) ) {
    $imageMapWrapper.removeClass( stickBottom );
  }
}

// Toggle the different form pages
$wrapper.on( 'click', '.pagination_next, .pagination_prev', function( event ) {
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
  if ( isGoingNext && newCurrentPage <= total ) {
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
  $('.explain_pagination .pagination_prev, .explain_pagination .pagination_next').removeClass('btn__disabled');
  if ( newCurrentPage == 1 ) {
    $('.explain_pagination .pagination_prev').addClass('btn__disabled');
  } else if ( newCurrentPage == total ) {
    $('.explain_pagination .pagination_next').addClass('btn__disabled');
  }
  // Call init() again to set up the next page
  init();
  // Reset the filters
  $('.explain_tabs .tab-list:eq(0)').click();
  // Scroll to the top of the forms
  $.scrollTo( $tabs, {
    duration: 400,
    offset: 0
  });
});

// Filter the expandables via the tabs
$wrapper.on( 'click', '.explain_tabs .tab-list', function( event ) {
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
$wrapper.on( 'click', '.image-map_overlay', function( event ) {
  event.preventDefault();
  var itemID = $( this ).attr('href');
  $.scrollTo( $(itemID), {
    duration: 200,
    offset: 0
  });
  $( itemID ).get(0).expand();
});

// Scroll to the proper item when the corresponding form dot is selected
$wrapper.on( 'mouseenter mouseleave', '.image-map_overlay, .expandable__form-explainer', function( event ) {
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
  if ( $terms.height() > $window.height() ) {
    // When the sticky plugin is applied to the image, it adds position fixed,
    // and the image's width is no longer constrained to its parent.
    // To fix this we will give it its own width that is equal to the parent.
    $imageMapImage.css( 'width', $imageMap.width() );
    $imageMapWrapper.sticky();
    $window.on( 'scroll', updateStickiness );
  }
}

// Do it!
$(document).ready(function(){
  init();
});
