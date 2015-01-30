var $ = require('jquery');
require('sticky');
require('jquery-easing');
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
function setDimensions() {
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
  // When the sticky plugin is applied to the image it adds position fixed
  // which means that the image's width will no longer be constrained to its
  // parent. To fix this we will give it its own width that is equal to the
  // parent.
  $imageMapImage.css( 'width', $imageMap.width() );
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

/**
 * Initialize the form explainer app.
 * @return {null}
 */
function init() {
  $(document).ready(function(){
    setDimensions();
    $imageMapWrapper.sticky({ className: 'has-sticky' });
    $window.on( 'scroll', updateStickiness );
  });
}

// Do it!
init();
