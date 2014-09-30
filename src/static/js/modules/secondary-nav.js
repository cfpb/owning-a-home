var $ = require('jquery');

var $navBtn = $('.nav-secondary_link__button'),
    $navContent = $('.nav-secondary .expandable-content');

var toggleCheck = function() {
  if ($navBtn.css('display') !== 'none' ){
    $navContent.css('display', 'none');
  } else {
    $navContent.css('display', 'block');
  }
};

$(window).resize(function(){
  toggleCheck();
});

toggleCheck();