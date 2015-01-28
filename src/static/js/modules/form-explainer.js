var $ = require('jquery');
require('sticky');

var fx = {
  $wrapper:         $('.explain'),
  $imageMap:        $('.image-map'),
  $imageMapImage:   $('.image-map_image'),
  $imageMapWrapper: $('.image-map_wrapper'),
  $terms:           $('.terms'),
  $window:          $( window )
};

function getWidth( newHeight, orginalWidth, originalHeight ) {
  if ( currentHeight == 0 ) return newHeight;
  var aspectRatio = currentWidth / currentHeight;
  return newHeight * aspectRatio;
}

$.fn.resizeHeightMaintainRatio = function( newHeight ) {
  var aspectRatio = $(this).data('aspectRatio');
  if (aspectRatio == undefined) {
    aspectRatio = $(this).width() / $(this).height();
    $(this).data('aspectRatio', aspectRatio);
  }
  $(this).height(newHeight); 
  $(this).width(parseInt(newHeight * aspectRatio));
};

/**
 * Initialize the form explainer app.
 * @return {null}
 */
function init() {
  $(document).ready(function(){
    setDimensions();
    fx.$imageMapWrapper.sticky({ topSpacing: 0 });
  });
}

function setDimensions() {
  var windowHeight = fx.$window.height(),
      wrapperWidth = fx.$wrapper.width(),
      imageMapWidthPercent;

  if ( fx.$imageMapImage.height() > windowHeight ) {
    // In order to make the image map sticky we must first make sure it will fit
    // completely within the window.
    fx.$imageMapImage.resizeHeightMaintainRatio( windowHeight );
    // Then we need to adjust the two columns
    imageMapWidthPercent = (fx.$imageMapImage.outerWidth() + 30) / wrapperWidth * 100;
    fx.$imageMap.css( 'width', imageMapWidthPercent + '%' );
    fx.$terms.css( 'width', (100 - imageMapWidthPercent) + '%' );
  } else {
    // When the sticky plugin is applied to the image it adds position fixed
    // which means that the image's width will no longer be constrained to its
    // parent. To fix this we will give it it's own width that is equal to the
    // parent.
    fx.$imageMapImage.css( 'width', fx.$imageMap.width() );
  }
}

// ...
// $('.form-expainer').click(function(ev){
//   ev.preventDefault();
//   console.log('you clicked',ev.target);
// });

// Do it!
init();
