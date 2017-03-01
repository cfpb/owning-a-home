'use strict';

var EmailSignup = require( './email-signup.js' );
var helpers = require( './email-signup-helpers.js' );

/**
 * EmailPopup
 * @class
 *
 * @classdesc Initializes the organism.
 *
 * @param {string} el 
 *   The selector for the organism.
 * @returns {EmailSignup} An instance.
 */
function EmailPopup( el ) {
  el = el || '.email-popup';
  var _baseElement = $(el);
  var _closeElement = $(el).find('.close');

  function hidePopup() {
    _baseElement.fadeOut();
    helpers.recordEmailPopupClosure();
  }

  function showPopup() {
    _baseElement.fadeIn();
    helpers.recordEmailPopupView();
    return this;
  }

  function init() {  
    if ( helpers.showEmailPopup() ) {
      var emailSignup = new EmailSignup( el );
      emailSignup.init(); 
      _closeElement.on('click', hidePopup);
      return this;
    }
  }
  this.init = init;
  this.hidePopup = hidePopup;
  this.showPopup = showPopup;
  this.el = _baseElement;
  return this;
}

module.exports = EmailPopup;
