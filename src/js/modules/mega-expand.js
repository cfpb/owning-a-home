var megaExpand = function(ev, $header){

  var $container = $header.parent('.expandable'),
      $button = $header.children('.expandable-button');

  ev.preventDefault();
  ev.stopPropagation();

  $container.toggleClass('open');
  $header.next('.expandable-content').slideToggle();
  $button.toggleClass('open');
  $header.find('.expandable-text').text( $container.hasClass('open') ? 'Collapse' : 'Learn More' );

};


$('.expandable').on( 'click', '.expandable-header', function(ev){
  var $header = $(this);
  megaExpand(ev, $header);
});

$('.expandable').on( 'click', '.expand-close', function(ev){
  var $header = $(this).parents('.expandable').find('.expandable-header');
  megaExpand(ev, $header);
});