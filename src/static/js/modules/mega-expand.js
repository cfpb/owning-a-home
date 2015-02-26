var $ = require('jquery');
require('./local-storage-polyfill');

var megaExpand = function(ev, $header, duration){
  if ( duration === undefined ) {
    duration = 400;
  }

  var $container = $header.parent('.expandable'),
      $button = $header.children('.expandable-button'),
      state = {};

  if (ev) {
    ev.preventDefault();
  }

  $container.toggleClass('open');
  $header.next('.expandable-content').slideToggle( duration );
  $button.toggleClass('open');
  $header.find('.expandable-text').text( $container.hasClass('open') ? 'Collapse' : 'Learn More' );

  // set state values
  if ($container.hasClass('open')) {
    state.expand = 'open';
    state.header = $header.attr('id');
  } else {
    state.expand = 'close';
  }

  // store state in local storage
  window.localStorage.setItem('expandableState', JSON.stringify(state));
};

// check storage and call megaExpand if open
var checkStorage = function(ev) {
  var storageVal = JSON.parse(window.localStorage.getItem( 'expandableState'));
  if ( !storageVal ) {
    return false;
  }
  var $header = $('#' + storageVal.header);
  if (storageVal.expand === 'open') {
    megaExpand(ev, $header);
  }
};

// expand/collapse link bheavior in expandable-header
$('.expandable').on( 'click', '.expandable-mainhead', function(ev){
  var $header = $(this).parent('.expandable-header');
  megaExpand(ev, $header);
});

// collapse link
$('.expandable').on( 'click', '.expand-close', function(ev){
  var $header = $(this).parents('.expandable').find('.expandable-header');
  megaExpand(ev, $header);
  // scroll back to the top of the container
  var offSet = $header.offset().top;
  $('body').scrollTop(offSet);
});

$(document).ready( function() {
  // check for hash value - hash is first priority
  var hash = window.location.hash.substr(1).toLowerCase(),
      $header = $( '#' + hash).parents('.expandable').find('.expandable-header');

  if ( hash !== "" ) {
    megaExpand(false, $header, 0);
    var offSet = $('#' + hash).offset().top;
    $('body').scrollTop(offSet);
  }
  else {
    // check for state on page load
    checkStorage();
  }

});
