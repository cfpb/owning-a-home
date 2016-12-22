'use strict';

// Import cfgov-refresh on-demand atomic component JavaScript files.
require( '../../../../node_modules/cfgov-sheer-templates/static/js/header.js' );
require( '../../../../node_modules/cfgov-sheer-templates/static/js/footer.js' );
require( './feedback.js' );
var EmailSignup = require( './email-signup.js' );

var emailElement = $( '.brand-footer ' +  EmailSignup.BASE_CLASS )[0] || 
                   $( '.content_sidebar ' +  EmailSignup.BASE_CLASS )[0] ||
                   $( '.tools-col ' +  EmailSignup.BASE_CLASS )[0];

var emailSignup = new EmailSignup( emailElement ).init();

