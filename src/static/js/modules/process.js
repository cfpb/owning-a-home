'use strict';

var $ = require( 'jquery' );
require( 'jquery.scrollto' );
require( '../../vendor/jquery.easing/jquery.easing.js' );
require( '../../vendor/cf-expandables/cf-expandables.js' );


/**
 * @returns {boolean} False if URL hash isn't valid, true otherwise.
 */
function jumpToAnchorLink() {
  // check for hash value - hash is first priority
  var hash = window.location.hash.substr( 1 ).toLowerCase();
  var re = /^[a-zA-Z0-9\-]*$/;

  // Only allow letters, digits and - symbols in hashes.
  if ( !re.test( hash ) ) { return false; }

  var $el = $( '#' + hash );
  var $expandable = $el.closest( '.expandable' );

  if ( hash !== '' &&
       $expandable.length &&
       !$expandable.hasClass( 'expandable__expanded' ) ) {
    $expandable.find( '.expandable_target' )[0].click();
    $.scrollTo( $el, {
      duration: 600,
      offset:   -30
    } );
  }

  return true;
}

$( document ).ready( function() {

  jumpToAnchorLink();
  $( window ).on( 'hashchange', function() {
    jumpToAnchorLink();
  } );

  // scroll to the top of the parent expandable when a close
  // link is clicked at the bottom of a step
  $( '.bottom-close-link' ).on( 'click', function( evt ) {
    $.scrollTo( $( evt.target ).closest( '.expandable' ), {
      duration: 250,
      offset:   -30
    } );
  } );

} );
