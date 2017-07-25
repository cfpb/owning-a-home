'use strict';

// Import cfgov-refresh on-demand atomic component JavaScript files.
require( '../../../../node_modules/cfgov-sheer-templates/static/js/header.js' );
require( '../../../../node_modules/cfgov-sheer-templates/static/js/footer.js' );
require( './feedback.js' );
var EmailSignup = require( './email-signup.js' );

var EMAIL_SIGNUP_BASE_CLASS = '.o-email-signup';

$( EMAIL_SIGNUP_BASE_CLASS ).each( function( ind, item ) {
	if ( $( item ).data( 'type' ) != 'popup' ) {
		var emailSignup = new EmailSignup( item );
		emailSignup.init();
	}
} );



