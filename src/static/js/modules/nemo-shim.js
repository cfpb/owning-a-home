var $ = require('jquery');

// To play nicer with nemo, add js class to body element
var bodyTag = document.getElementsByTagName("body")[0];
bodyTag.className += " js";

$('.toggle-menu').on('click', function(e){
    e.preventDefault();
    $('nav.main ul').toggleClass('vis');
});

window.$ = $;
window.jQuery = $;
