'use strict';

// Import cfgov-refresh on-demand atomic component JavaScript files.
require( '../../../../node_modules/cfgov-sheer-templates/static/js/header.js' );
require( '../../../../node_modules/cfgov-sheer-templates/static/js/footer.js' );
require( './feedback.js' );

var EmailSignup = require( './email-signup.js' );
var emailSignup = new EmailSignup( EmailSignup.BASE_CLASS );

emailSignup.init();
