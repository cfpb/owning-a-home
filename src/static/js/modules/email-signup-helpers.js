'use strict';

 /**
   * Stores/retrieves email signup data in localStorage
   * in an object with format:
   * { emailSignupCodeOne: [lastPopupViewDate, DelayInDaysBeforeNextView],
   *   emailSignupCodeTwo: 'registered'}
   */
var webStorageProxy = require( './web-storage-proxy.js' );
var POPUP_WAIT_PERIOD = [ 4, 30, 60 ];
var EMAIL_LIST_KEY = 'cfpbEmailSignups';
var _data;

function _isObject( x ) {
  return x === Object( x );
}

function _isArray( x ) {
	return Object.prototype.toString.call( x ) === '[object Array]';
}

function _getEmailSignupData() {
	_data = webStorageProxy.getItem( EMAIL_LIST_KEY, localStorage );
 	try {
 		_data = JSON.parse( _data );
	} catch (e) {}
	_isObject( _data ) || ( _data = {} );
}

function _setEmailSignupData() {
	webStorageProxy.setItem( EMAIL_LIST_KEY, JSON.stringify( _data ), localStorage );
}

function _getListData( code ) {
	_getEmailSignupData();
	var listData = _data[ code ];
	if ( listData === 'registered' ) return;
	if ( !_isArray( listData ) ) {
		listData = _data[ code ] = [];
	}
	return listData;
}

function _daysElapsed( pastDateMS ) {
	return ( new Date().getTime() - pastDateMS ) / ( 1000 * 60 * 60 * 24 );
}

function _daysToWait( viewCount ) {
	return POPUP_WAIT_PERIOD[ viewCount ];
}

function recordEmailPopupView( code ) {
	var listData = _getListData( code );
	if (listData) {
		var count = listData[ 1 ] || 0;
		var index = count > 2 ? 2 : count;
		listData[ 0 ] = new Date().getTime();
		listData[ 1 ] = count + 1;
		_setEmailSignupData();
	}
}

function recordEmailPopupClosure( code ) {
	var listData = _getListData( code );
	if (listData) {
		listData[ 0 ] = new Date().getTime();
		listData[ 1 ] = POPUP_WAIT_PERIOD.length - 1;
		_setEmailSignupData();
	}
}

function recordEmailRegistration( code ) {
	var listData = _getListData( code );

	if ( listData ) {
		_data[ code ] = 'registered';
		_setEmailSignupData();
	}
}

function showEmailPopup( code ) {
	var listData = _getListData( code );
	if (listData) {
		var lastView = listData[0];
		var viewCount = listData[1];

		if ( !lastView || _daysToWait( viewCount ) < _daysElapsed( lastView ) ) {
			return true;
		} 
	}
}

module.exports = {
  showEmailPopup: 			    showEmailPopup,
  recordEmailPopupView:   	recordEmailPopupView,
  recordEmailRegistration:  recordEmailRegistration,
  recordEmailPopupClosure:  recordEmailPopupClosure
};