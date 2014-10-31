var $ = require('jquery');

var megaExpand = function(ev, $header){

  var $container = $header.parent('.expandable'),
      $button = $header.children('.expandable-button'),
      state = {};

  if (ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }

  $container.toggleClass('open');
  $header.next('.expandable-content').slideToggle();
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
  localStorage.setItem('expandableState', JSON.stringify(state));
};

// check storage and call megaExpand if open
var checkStorage = function(ev) {
  var storageVal = JSON.parse(localStorage.getItem( 'expandableState'));
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

// check for state on page load
checkStorage();