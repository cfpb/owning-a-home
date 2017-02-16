'use strict';

var EmailSignup = require( './email-signup.js' );
var helpers = require( './email-signup-helpers.js' );

function throttle(func, wait, options) {
 var context, args, result;
 var timeout = null;
 var previous = 0;
 if (!options) options = {};
 var later = function() {
  previous = options.leading === !1 ? 0 : Date.now();
  timeout = null;
  result = func.apply(context, args);
  if (!timeout) context = args = null
 };
 return function() {
  var now = Date.now();
  if (!previous && options.leading === !1) previous = now;
  var remaining = wait - (now - previous);
  context = this;
  args = arguments;
  if (remaining <= 0 || remaining > wait) {
   if (timeout) {
    clearTimeout(timeout);
    timeout = null;
   }
   previous = now;
   result = func.apply(context, args);
   if (!timeout) context = args = null
  } else if (!timeout && options.trailing !== !1) {
   timeout = setTimeout(later, remaining)
  }
  return result;
 }
}

/**
 * EmailPopup
 * @class
 *
 * @classdesc Initializes the organism.
 *
 * @param {string} el 
 *   The selector for the organism.
 * @param {string} scrollTargetSelector
 *   The selector of the trigger position for the popup.
 * @returns {EmailSignup} An instance.
 */
function EmailPopup( el, scrollTargetSelector ) {
  var _baseElement = $(el);
  var _closeElement = $(el).find('.close');
  var _listCode = $(el).find('input[name="code"]').val();
  var _scrollTargetElement = $( scrollTargetSelector );
  var handler;

   /**
   * gets the position of the page where the popup
   * should show: top of target element + height of popup
   * @returns {number} position in document
   */
  function _getScrollTargetPosition() {
    if ( _scrollTargetElement.length ) {
      var top = _scrollTargetElement.offset().top;
      var popupHeight = _baseElement.height();
      return top + popupHeight;
    } else {
      return $(document).height() * .55
    }
  }

  /**
   * 
   * @returns {Boolean} whether target position has been reached
   */
  function _scrollTargetPositionReached() {
    var windowHeight = window.innerHeight;
    var windowTop = window.pageYOffset;
    var windowBottom = windowTop + windowHeight;
    var scrollTargetPosition = _getScrollTargetPosition();
    return windowBottom > scrollTargetPosition;
  }

  function hidePopup() {
    _baseElement.fadeOut();
    helpers.recordEmailPopupClosure( _listCode );
  }

  function showPopup() {
    _baseElement.fadeIn();
    helpers.recordEmailPopupView( _listCode );
  }

  function _handleScroll() {
    if(_scrollTargetPositionReached()){
      window.removeEventListener('scroll', handler)
      showPopup();
    }
  }

  function init() {  
    if ( helpers.showEmailPopup( _listCode ) ) {
      var emailSignup = new EmailSignup( el );
      emailSignup.init(); 

      handler = throttle(function(event){
        _handleScroll();
      }, 100);

      window.addEventListener('scroll', handler);
      _closeElement.on('click', hidePopup);
      return this;
    }
  }
  this.init = init;
  this.hidePopup = hidePopup;
  this.showPopup = showPopup;
  return this;
}
module.exports = EmailPopup;
