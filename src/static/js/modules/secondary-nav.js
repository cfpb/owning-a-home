var $ = require('jquery');
require('../../vendor/jquery.easing/jquery.easing.js');
require('../../vendor/cf-expandables/cf-expandables.js');

var $navBtn = $('.nav-secondary_link__button'),
    $navContent = $('.nav-secondary .expandable_content'),
    $nav = $('.nav-secondary.expandable');

var toggleCheck = function() {
    // if button is visible, it's an expandable
  if ($navBtn.css('display') !== 'none' && !$nav.hasClass('expandable__expanded')) {
    // hide content if it's not expanded
    $navContent.css('display', 'none');
  } else {
    $navContent.css('display', 'block');
  }
};

$(window).resize(function(){
  toggleCheck();
});

toggleCheck();
