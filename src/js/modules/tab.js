$('.tab-link').click(function( e ) {
  var $tabs = $('.tab-list'),
      $tabLi = $(this).parent('.tab-list'),
      $tabContent = $('.tab-content'),
      current = $(this).attr('href');

  $tabs.removeClass('active');
  $tabLi.addClass('active');

  $tabContent.hide();
  $(current).show();

  e.preventDefault();

});
