'use strict';

var webdriverio = require( 'webdriverio' );
var options = {
  desiredCapabilities: {
    browserName: 'phantomjs'
  }
};

// initialise WebdriverCSS for `client` instance

var client = webdriverio
  .remote( options )
  .init();

require( 'webdrivercss' ).init( client, {
  // example options
  screenshotRoot: 'test/screenshots',
  failedComparisonsRoot: 'test/screenshots/diffs',
  misMatchTolerance: 0.05,
  screenWidth: [ 320, 768, 1024, 1280 ]
} );

client
  .url( 'http://localhost:8000/owning-a-home/explore-rates/' )
  .webdrivercss( 'explore-rates', {
    name: 'body',
    elem: 'body'
  } )
  .url( 'http://localhost:8000/owning-a-home/loan-options/' )
  .webdrivercss( 'loan-options', {
    name: 'body',
    elem: 'body'
  } )
  .url( 'http://localhost:8000/owning-a-home/loan-estimate/' )
  .webdrivercss( 'loan-estimate', {
    name: 'body',
    elem: 'body'
  } )
  .url( 'http://localhost:8000/owning-a-home/closing-disclosure/' )
  .webdrivercss( 'closing-disclosure', {
    name: 'body',
    elem: 'body'
  } )
  .end();
