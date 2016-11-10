'use strict';

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function questionRating (ratingURL, sessionURL) {

  function renderForm (html) {
    $('#rating').html(html);
  }

  function setupFormEvents () {
    $("input[name='helpful']").change(function(e){
      submitRating(e);
    });
    $('.rateq').on('submit', function(e){
      submitComment(e);
    });
  }

  function submitRating (e) {
    var data = {
      action:'add',
      helpful: $(e.target).val(),
      csrfmiddlewaretoken: getCookie('csrftoken')
    }
    $.post(ratingURL, data, ratingSubmitted, 'json');
  }

  function ratingSubmitted () {
    $('.rating-message').fadeIn();
  }

  function commentSubmitted () {
    $('.rateq').fadeOut(function () {
      $('.comment-success').fadeIn();
    });
  }

  function submitComment (e) {
    e.preventDefault();
    $('.rating-message').hide();
    $.post(ratingURL, $(e.target).serialize(), commentSubmitted, 'json')
  }

  function init () {
    $(document).ready(function() {
     $.post(sessionURL, function(){
        var csrftoken = getCookie('csrftoken');
        $.post(ratingURL, {action:'count', csrfmiddlewaretoken:csrftoken})
        $.post(ratingURL, {action:'render',  csrfmiddlewaretoken:csrftoken}, function(data){
          renderForm(data);
          setupFormEvents();
       });
     });
    });
  }

  return {
    init: init,
    renderForm: renderForm,
    setupFormEvents: setupFormEvents,
    submitRating: submitRating,
    submitComment: submitComment
  }
}

module.exports = questionRating;
