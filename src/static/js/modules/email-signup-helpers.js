'use strict';

 /**
   * Stores/retrieves email signup data in localStorage
   */

var POPUP_WAIT_PERIOD = [ 4, 30, 60 ];
var DISPLAY_DATE_KEY =  'oahPopupShowNext';
var DISPLAY_COUNT_KEY = 'oahPopupCount';
var FOREVER = 10000;

function getFutureDate(days){
	var date=new Date();
	return date.setTime(date.getTime()+(days*24*60*60*1000))
}

function recordEmailPopupView() {
	var count = Number( localStorage.getItem( DISPLAY_COUNT_KEY ) ) || 0;
	var max = POPUP_WAIT_PERIOD.length - 1;
	count = count >= max ? max : count + 1;
	var days = POPUP_WAIT_PERIOD[ count ];
	localStorage.setItem( DISPLAY_COUNT_KEY, count );
	localStorage.setItem( DISPLAY_DATE_KEY, getFutureDate( days ) );
}

function recordEmailPopupClosure() {
	var count = POPUP_WAIT_PERIOD.length - 1;
	var days = POPUP_WAIT_PERIOD[ count ];
	localStorage.setItem( DISPLAY_COUNT_KEY, count );
	localStorage.setItem( DISPLAY_DATE_KEY, getFutureDate( days ) );
}

function recordEmailRegistration() {
	localStorage.setItem( DISPLAY_DATE_KEY,  getFutureDate( FOREVER ) );
}

function showEmailPopup() {
	console.log('show')
	var today = new Date().getTime();
	var nextDisplayDate = Number( localStorage.getItem( DISPLAY_DATE_KEY ) ) || 0;
	return today > nextDisplayDate;
}

module.exports = {
	showEmailPopup: 			    showEmailPopup,
	recordEmailPopupView:   	recordEmailPopupView,
	recordEmailRegistration:  recordEmailRegistration,
	recordEmailPopupClosure:  recordEmailPopupClosure
};