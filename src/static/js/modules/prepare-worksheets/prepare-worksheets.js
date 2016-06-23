'use strict';

// Import modules.
var $ = require( 'jquery' );
var _locationServices = require( './util/location-services' );
var _model = require( './worksheet-model' );
var _worksheet = require( './worksheet-controller' );
var config = require( './worksheet-config' );
var Handlebars = require( 'hbsfy/runtime' );
require( '../../../vendor/jquery.easing/jquery.easing.js' );
require( '../../../vendor/cf-expandables/cf-expandables.js' );

// DOM references.
var _worksheetsDOM = document.querySelector( '.page-contents' );
var _btnNext = document.querySelector( '.btn-worksheet-next' );
var _btnPrev = document.querySelector( '.btn-worksheet-prev' );

// General app properties.
var _page = 1;
var TOTAL_PAGES = 3;
var _pageLoad = true;

function init() {
  // Load ?page=<page number> from URL or default to page 1.
  _page = Number( _locationServices.getURLParameter( 'page' ) ) || 1;

  // Set default data in model if goals worksheet is not populated.
  var worksheet = _model.getWorksheet( 'personal' );
  if ( !worksheet ) {
    _model.setDefaultData();
  }
  _loadPage( _page );
}

function _nextClicked() {
  _page++;
  // Prevent double-clicks beyond bounds before button is disabled.
  if ( _page > TOTAL_PAGES ) { _page = TOTAL_PAGES; }
  _loadPage( _page );
}

function _prevClicked() {
  _page--;
  // Prevent double-clicks beyond bounds before button is disabled.
  if ( _page < 1 ) { _page = 1; }
  _loadPage( _page );
}

function _updateNavigationState() {
  // At a middle page.
  if ( _page > 1 && _page < TOTAL_PAGES ) {
    _activateBtn( _btnNext, _nextClicked );
    _activateBtn( _btnPrev, _prevClicked );

  // At the first page.
  } else if ( _page === 1 ) {
    _activateBtn( _btnNext, _nextClicked );
    _deactivateBtn( _btnPrev, _prevClicked );

  // At the last page.
  } else {
    _deactivateBtn( _btnNext, _nextClicked );
    _activateBtn( _btnPrev, _prevClicked );
  }
}

function _activateBtn( btn, action ) {
  if ( btn.className.indexOf( 'btn__disabled' ) > -1 ) {
    btn.addEventListener( 'mousedown', action, false );
    btn.className = btn.className.replace( 'btn__disabled', '' );
  }
}

function _deactivateBtn( btn, action ) {
  btn.removeEventListener( 'mousedown', action, false );
  btn.className += ' btn__disabled';
}

function _loadPage( page ) {
  // Clear worksheet DOM.
  _worksheetsDOM.innerHTML = '';

  var run = {
    1: _loadWorksheets,
    2: _loadNotes,
    3: _loadSummary
  };
  run[Number( page )]();
  _updateNavigationState();

  if ( !_pageLoad ) {
    $( 'html, body' ).animate( {
      scrollTop: $( '.page-contents' ).offset().top
    }, 750 );
  }
  _pageLoad = false;

}

/* // TEMP - DEBUG - display worksheet data in console.
document.querySelector('.official-website').addEventListener('mousedown', function() {
  console.log( 'git...', _model.getData().worksheets.goals );
} );
*/

function _loadWorksheets() {
  // Generate page html
  var pageTemplate = require( '../../templates/prepare-worksheets/page-worksheets.hbs' );
  var pageHtml = pageTemplate();
  _worksheetsDOM.innerHTML = pageHtml;

  // Add interactive sections for each of the worksheet types to the page
  var worksheetTypes = [ 'personal', 'financial', 'risks', 'flags' ];
  for ( var i = 0, len = worksheetTypes.length; i < len; i++ ) {
    var worksheet = _model.getWorksheet( worksheetTypes[i] );
    var rows = _model.filterEmptyRows( worksheet, { skipLast: true } );

    var data = config.worksheetData[worksheetTypes[i]]();

    var options = {
      container: _worksheetsDOM.querySelector( '.worksheet-' + worksheetTypes[i] ),
      type: worksheetTypes[i],
      rows: rows,
      data: data
    };

    $.extend( options, config.worksheetModules[worksheetTypes[i]]() );

    _worksheet.create( options );
  }
}

function _loadNotes() {
  var pageTemplate = require( '../../templates/prepare-worksheets/page-notes.hbs' );
  var pageHtml = pageTemplate();

  _worksheetsDOM.innerHTML = pageHtml;
  var goals = _model.filterEmptyRows( _model.combineGoals() );
  var data = config.worksheetData.alternatives();

  var options = $.extend( {
    container: _worksheetsDOM.querySelector( '.worksheet-notes' ),
    type:      'notes',
    rows:      goals,
    data:      data
  }, config.worksheetModules.alternatives() );

  _worksheet.create( options );
}

function _loadSummary() {
  var pageTemplate = require( '../../templates/prepare-worksheets/page-summary.hbs' );
  var summarySection = require( '../../templates/prepare-worksheets/page-summary-section.hbs' );
  var summaryError = require( '../../templates/prepare-worksheets/page-summary-error.hbs' );
  Handlebars.registerPartial( {
    summarySection: summarySection,
    summaryError: summaryError
  } );

  var templateData = { summarySection: summarySection, summaryError: summaryError };
  var filterOpts = { requireGrade: true };
  var combinedGoals = _model.combineGoals();
  var filteredGoals = _model.filterEmptyRows( combinedGoals, filterOpts );
  templateData.goals = _model.sortWorksheetByGrade( filteredGoals, 'goals' );
  // Check for errors.
  var goalErrors = config.errorMessages.goals;
  if ( !combinedGoals.length ) {
    templateData.goalsError = goalErrors.emptyInputs;
  } else if ( !filteredGoals.length ) {
    templateData.goalsError = goalErrors.noGrade;
  }

  var filteredRisks = _model.filterEmptyRows( _model.getWorksheet( 'risks' ), filterOpts );
  templateData.risks = _model.sortWorksheetByGrade( filteredRisks, 'risks' );
  // Check for errors.
  if ( !filteredRisks.length ) {
    var riskErrors = config.errorMessages.risks;
    templateData.risksError = riskErrors.noGrade;
  }

  var filteredFlags = _model.filterEmptyRows( _model.getWorksheet( 'flags' ), filterOpts );
  templateData.flags = _model.sortWorksheetByGrade( filteredFlags, 'flags' );
  // Check for errors.
  if ( !filteredFlags.length ) {
    var flagErrors = config.errorMessages.flags;
    templateData.flagsError = flagErrors.noGrade;
  }

  var pageHtml = pageTemplate( templateData );
  _worksheetsDOM.innerHTML = pageHtml;
  // HACK: routing hack, to load page 1 when error messages clicked.
  $( '.worksheet-summary a:not(.expandable_target)' ).click( function( evt ) {
    evt.preventDefault();
    _page = 1;
    _loadPage( 1 );
  } );
}

init();
