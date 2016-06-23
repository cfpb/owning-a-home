'use strict';

var $ = jQuery = require( 'jquery' );
require( 'jquery-easing' );
require( 'cf-expandables' );
var React = require( 'react' );
var App = require( './loan-comparison/components/app' );

React.render(
  <App/>, document.getElementById( 'app-container' )
);
