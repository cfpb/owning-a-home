'use strict';

// Required modules.
var Notification = require( './notification.js' );


var JS_HOOK = 'data-js-hook';
var STATE_PREFIX = 'state_';
var INIT_FLAG = STATE_PREFIX + 'atomic_init';

var atomicHelpers = {
  setInitFlag: function ($element) {
    var data = ($element.data(JS_HOOK) || '');
    if ( $.inArray( INIT_FLAG, data.split('')) > -1 ) {
      return false;
    }
    $element.data(JS_HOOK, INIT_FLAG + ' ' + data);
    return true;
  }
}

var ERROR_MESSAGES = {
  EMAIL: {
    INVALID: 'You have entered an invalid email address.',
    REQUIRED: 'Please enter an email address.'
  }
}

var FORM_MESSAGES = {
  ERROR: 'There was an error in your submission. Please try again later.',
  SUCCESS: 'Your submission was successfully received.'
};

var validateEmail = function ( field, currentStatus ) {
  var status = currentStatus || {};
  var regex =
    '^[a-z0-9\u007F-\uffff!#$%&\'*+\/=?^_`{|}~-]+(?:\\.[a-z0-9' +
    '\u007F-\uffff!#$%&\'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9]' +
    '(?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z]{2,}$';
  var emailRegex = new RegExp( regex, 'i' );
  if ( field.val() && emailRegex.test( field.val() ) === false ) {
    status.msg = status.msg || '';
    status.msg += ERROR_MESSAGES.EMAIL.INVALID;
    status.email = false;
  }
  return status;
}

/**
 * EmailSignup
 * @class
 *
 * @classdesc Initializes the organism.
 *
 * @param {HTMLNode} element
 *   The DOM element within which to search for the organism.
 * @returns {EmailSignup} An instance.
 */
function EmailSignup( element ) {
  var UNDEFINED;
  var _baseElement = $(element);
  var _formElement = _baseElement.find( 'form' );
  var _emailElement = _formElement.find( 'input[type="email"]' );
  var _codeElement = _formElement.find( 'input[name="code"]' );
  var _notification = new Notification( _baseElement );

  /**
   * @returns {EmailSignup|undefined} An instance,
   *   or undefined if it was already initialized.
   */
  function init() {
    if ( !atomicHelpers.setInitFlag( _baseElement ) ) {
      return UNDEFINED;
    }

    _formElement.on( 'submit', _onSubmit );

    return this;
  }

  /**
   * @param {event} event DOM event
   * @returns {event} DOM event.
   */
  function _onSubmit( event ) {
    var isValid;
    event.preventDefault();
    if ( !_emailElement.val() ) {
      _notification.setTypeAndContent( _notification.ERROR,
                                       ERROR_MESSAGES.EMAIL.REQUIRED );
      _notification.show();
      return UNDEFINED;
    }
    isValid = validateEmail( _emailElement );
    if ( isValid.email === false ) {
      _notification.setTypeAndContent( _notification.ERROR,
                                       ERROR_MESSAGES.EMAIL.INVALID );
      _notification.show();
    } else {
      _sendEmail();
    }

    return event;
  }

  /**
   * Sends form data and displays notification on success / failure.
   */
  function _sendEmail( ) {
    var notificationType = _notification.ERROR;
    var notificationMsg = FORM_MESSAGES.ERROR;
    $.post(_formElement.attr('action'), _formElement.serialize())
      .done(function onSuccess (data) {
        if ( (data || {}).result != "fail" ) {
          notificationType = _notification.SUCCESS;
          notificationMsg = FORM_MESSAGES.SUCCESS;
        }
      })
      .always(function showNotification () {
        _notification.setTypeAndContent( notificationType, notificationMsg );
        _notification.show();
      });
  }

  this.init = init;

  return this;
}

module.exports = EmailSignup;