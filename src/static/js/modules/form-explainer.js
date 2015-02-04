var $ = require('jquery');
require('sticky');
require('jquery-easing');
require('jquery.scrollto');
require('cf-expandables');

var $wrapper =          $('.explain'),
    $imageMap =         $('.image-map'),
    $imageMapImage =    $('.image-map_image'),
    $imageMapWrapper =  $('.image-map_wrapper'),
    $terms =            $('.terms'),
    $window =           $( window );

/**
 * Limit .image-map_image to the height of the window and then adjust the two
 * columns to match.
 * @return {null}
 */
function fitToWindow() {
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
    imageMapWidthNewPercent = imageMapWidthNewPx / $wrapper.width() * 100;
    $imageMap.css( 'width', imageMapWidthNewPercent + '%' );
    // Then we need to adjust the second column to match the image map's new width.
    $terms.css( 'width', (100 - imageMapWidthNewPercent) + '%' );
  }
}

/**
 * Override .sticky() if the viewport has been scrolled past $wrapper so that
 * the sticky element does not overlap content that comes after $wrapper.
 * @return {null}
 */
function updateStickiness() {
  var max = $wrapper.offset().top + $wrapper.height() - $imageMapWrapper.height(),
      stickBottom = 'js-sticky-bottom';
  if ( $window.scrollTop() >= max && !$imageMapWrapper.hasClass( stickBottom ) ) {
    $imageMapWrapper.addClass( stickBottom );
  } else if ( $window.scrollTop() < max && $imageMapWrapper.hasClass( stickBottom ) ) {
    $imageMapWrapper.removeClass( stickBottom );
  }
}

// Filter the expandables via the tabs
$wrapper.on( 'click', '.explain_tabs .tab-list', function( event ) {
  var target = $(this).find('[data-target]').data('target');
  event.preventDefault();
  // Update the tab state
  $('.explain_tabs .tab-list').removeClass('active-tab');
  $(this).addClass('active-tab');
  // Filter the expandables
  if ( target === 'all' ) {
    $('.expandable__form-explainer').show();
    $('.image-map_overlay').show();
  } else {
    $('.expandable__form-explainer').hide();
    $( '.expandable__form-explainer-' + target ).show();
    $('.image-map_overlay').hide();
    $( '.image-map_overlay__' + target ).show();
  }
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
  $(document).ready(function(){
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
  });
}

// Do it!
init();
