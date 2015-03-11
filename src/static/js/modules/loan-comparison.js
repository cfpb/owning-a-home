var $ = require('jquery');
var setupLoanForm = require('./formalize');
var copyFormValues = require('./clone-form');
var templates = {
  form: require('../templates/loan-form.hbs'),
  button: require('../templates/loan-add-button.hbs')
};
require('./object.observe-polyfill');
var supportsAccessors = require('./supports-accessors');
var objectify = require('objectified');
var loans = {};

var $container = $('.lc-inputs .form-container'),
    $lc = $('#oah-loan-comparison'),
    $mobileOverview = $('.mobile-overview'),
    $addButton,
    $mobileAddButton,
    $addButtons,
    mobileButtonId,
    $mobileLoanB,
    formIDs = ['a', 'b', 'c'],
    currentForm = 0;

$container.append( templates.form({form_id: formIDs[currentForm]}) )
          .append( templates.button() );
$addButton = $('#lc-add-button');
mobileButtonId = 'mobile-lc-add-button';
$mobileAddButton = $('#' + mobileButtonId);
$addButtons = $addButton.add($mobileAddButton);
$mobileLoanB = $('.loan-b');

// set up onboarding form
var sharedLoanData = objectify('#onboarding', [
  {
    name: 'location',
    source: 'location'
  },
  {
    name: 'maxfico',
    source: function() {
      var score = parseInt($('#credit-score-select').val()) || 0;
      var maxfico;
      if (score === 600) {
        maxfico = 620;
      } else if (score === 841) {
        maxfico = 850;
      } else {
        maxfico = score + 19;
      }
      return maxfico;
    }
  },
  {
    name: 'minfico',
    source: 'credit-score-select'
  }
]);

sharedLoanData.update();

if (supportsAccessors) {
  Object.observe(sharedLoanData, updateLoans);
} else {
  var oldData = $.extend( {}, sharedLoanData);
  setInterval(function(){
    if (JSON.stringify(loan) !== JSON.stringify(oldData)) {
      updateLoans([]);
      oldData = $.extend({}, sharedLoanData);
    }
  }, 500);
}

function getSharedVals() {
  var tmp = {};
  $.each(['location', 'minfico', 'maxfico'], function (ind, key) {
    tmp[key] = sharedLoanData[key];
  });
  return tmp;
}

function updateLoans () {
  var vals = getSharedVals();
  $.each(loans, function (ind, loan) {
    $.extend(loan, vals);
  });
}

function addLoan (id) {
  return setupLoanForm(id, getSharedVals());
}

// Set up form A on page load.
loans = addLoan(formIDs[currentForm]);

// Set up additional forms as requested.
function showForm(isMobile) {
  var prev = formIDs[ currentForm++ ],
      curr = formIDs[ currentForm ];
  $addButton.before( templates.form({form_id: curr}) );
  if (isMobile) {
  }
  //copyFormValues( '#lc-input-' + prev, '#lc-input-' + curr );
  addLoan(curr);
  // If it's the last form, remove the button.
  if ( currentForm === formIDs.length - 1 ) {
    $addButton.remove();
  }
}

// show desktop forms
$addButtons.on('click', function(e) {
  var isMobile = $(e.target).attr('id') === mobileButtonId;
  showForm(isMobile);
  if (currentForm === 1) {
    $mobileLoanB.removeClass('inactive');
    $('#mobile-loanb-details').removeClass('hidden');
    $mobileAddButton.hide();
  }
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
