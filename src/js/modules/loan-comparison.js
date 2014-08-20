var setupLoanForm = require('./formalize');
var cloneForm = require('./clone-form');
var templates = {
  form: require('../templates/loan-form.hbs'),
  button: require('../templates/loan-add-button.hbs')
};
require('./object.observe-polyfill');

var $container = $('.lc-inputs .wrap'),
    $button,
    formIDs = ['a', 'b', 'c'],
    currentForm = 0;

$container.append( templates.form({form_id: formIDs[currentForm]}) );
$container.append( templates.button() );
$button = $('#lc-add-button');

// Set up form A on page load.
setupLoanForm( formIDs[currentForm] );

// Set up additional forms as requested.
$button.on('click', '.btn', function(){
  var prev = formIDs[ currentForm++ ],
      curr = formIDs[ currentForm ];
  $button.before( templates.form({form_id: curr}) );
  cloneForm( '#lc-input-' + prev, '#lc-input-' + curr );
  setupLoanForm( curr );
  // If it's the third form, remove the button.
  if ( currentForm === formIDs.length - 1 ) {
    $button.remove();
  }
});

// toggle the inputs on mobile
$('.lc-toggle').click(function(e) {
  e.preventDefault();
  var $link = $(this).attr('href'),
      $inputs = $($link),
      $editLink = $('.lc-edit-link');
  $inputs.toggleClass('input-open');
  $editLink.toggle();
});
