// To play nicer with nemo, add js class to body element
var bodyTag = document.getElementsByTagName("body")[0];
bodyTag.className += " js";

$('.toggle-menu').on('click', function(){
    $('nav.main ul').toggleClass('vis');
});