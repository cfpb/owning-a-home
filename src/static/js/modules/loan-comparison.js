var $ = require('jquery');
var setupLoanForm = require('./formalize');
var copyFormValues = require('./clone-form');
var templates = {
  form: require('../templates/loan-form.hbs'),
  button: require('../templates/loan-add-button.hbs')
};
require('./object.observe-polyfill');

var $container = $('.lc-inputs .wrap'),
    $lc = $('#oah-loan-comparison'),
    $mobileOverview = $('.mobile-overview'),
    $button,
    $mobileButton,
    formIDs = ['a', 'b', 'c'],
    currentForm = 0;

$container.append( templates.form({form_id: formIDs[currentForm]}) )
          .append( templates.button() );
$button = $('#lc-add-button');
$mobileButton = $('#mobile-lc-add-button');

// Set up form A on page load.
setupLoanForm( formIDs[currentForm] );

// Set up additional forms as requested.
function showForm() {
  var prev = formIDs[ currentForm++ ],
      curr = formIDs[ currentForm ];
  $button.before( templates.form({form_id: curr}) );
  copyFormValues( '#lc-input-' + prev, '#lc-input-' + curr );
  setupLoanForm( curr );
  // If it's the last form, remove the button.
  if ( currentForm === formIDs.length - 1 ) {
    $button.remove();
  }
}

// show desktop forms
$button.on( 'click', '.btn', showForm );

// add mobile form and mobile summary
$mobileButton.on('click', '.btn', function(){
  var $parent = $(this).parents('.mobile-overview'),
      $bDetails = $('#mobile-loanb-details');
  showForm();
  $parent.removeClass('inactive');
  $bDetails.removeClass('hidden');
  $mobileButton.hide();
});

// toggle the inputs on mobile
$lc.on('click', '.lc-toggle', function(ev) {
  ev.preventDefault();
  var $link = $(this).attr('href'),
      $inputs = $($link),
      $editLink = $('.lc-edit-link'),
      $parent = $(this).parents('.mobile-overview'),
      hasEditLink = $(this).hasClass('lc-edit-link');

  $mobileOverview.toggleClass( 'inactive', hasEditLink );
  $parent.toggleClass( 'inactive', !hasEditLink );

  $inputs.toggleClass('input-open');
  $editLink.toggle();
});