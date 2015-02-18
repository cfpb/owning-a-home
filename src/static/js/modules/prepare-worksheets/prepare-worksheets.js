// Import modules.
require( '../secondary-nav' );
var _locationServices = require( './util/location-services' );
var _model = require( './worksheet-model' );
var _worksheet = require( './worksheet-controller' ); 
var config = require( './config' ); 
var Handlebars = require("hbsfy/runtime");
var $ = require('jquery');


// DOM references.
var _worksheetsDOM = document.querySelector('.page-contents');
var _btnNext = document.querySelector('.btn-worksheet-next');
var _btnPrev = document.querySelector('.btn-worksheet-prev');

// General app properties.
var _page = 1;
var TOTAL_PAGES = 3;


function init() {
  // Load ?page=<page number> from URL or default to page 1.
  _page = Number(_locationServices.getURLParameter('page')) || 1;

  // Set default data in model if goals worksheet is not populated.  
  var worksheet = _model.getWorksheet('personal');
  if (!worksheet) {
    _model.setDefaultData();
  }
  _loadPage(_page);
}

function _nextClicked() {
  _page++;
  // Prevent double-clicks beyond bounds before button is disabled.
  if (_page > TOTAL_PAGES) _page = TOTAL_PAGES;
  _loadPage(_page);
}

function _prevClicked() {
  _page--;
  // Prevent double-clicks beyond bounds before button is disabled.
  if (_page < 1) _page = 1;
  _loadPage(_page);
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
  if ( btn.classList.contains( 'btn__disabled' ) ) {
    btn.addEventListener( 'mousedown', action, false );
    btn.classList.remove( 'btn__disabled' );
  }
}

function _deactivateBtn( btn, action ) {
  btn.removeEventListener( 'mousedown', action, false );
  btn.classList.add( 'btn__disabled' );
}

function _loadPage(page) {
  // Clear worksheet DOM.
  _worksheetsDOM.innerHTML = '';

  switch(Number(page)) {
  case 1 :
    _loadWorksheets();
    break;
  case 2 :
    _loadNotes();
    break;
  case 3 :
    _loadSummary();
    break;
  }
  _updateNavigationState();
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
  var worksheetTypes = ['personal', 'risks', 'flags'];
  for ( i = 0; i < worksheetTypes.length; i++ ) {
    var worksheet = _model.getWorksheet(worksheetTypes[i]);
    var rows = _model.filterEmptyRows(worksheet, {skipLast: true});

    var data = config.worksheetData[worksheetTypes[i]]();

    var options = {
      container: _worksheetsDOM.querySelector('.worksheet-' + worksheetTypes[i]),
      type: worksheetTypes[i],
      rows: rows,
      data: data
    }

    $.extend(options, config.worksheetModules[worksheetTypes[i]]());

    _worksheet.create(options); 
  };    
}

function _loadNotes() {
  var pageTemplate = require( '../../templates/prepare-worksheets/page-notes.hbs' );
  var pageHtml = pageTemplate();

  _worksheetsDOM.innerHTML = pageHtml;
  var goals = _model.filterEmptyRows(_model.combineGoals());
  var data = config.worksheetData['alternatives']();
  
  var options = $.extend({
    container: _worksheetsDOM.querySelector('.worksheet-notes'),
    type: 'notes',
    rows: goals,
    data: data
  }, config.worksheetModules['alternatives']());

  _worksheet.create(options);
}

function _loadSummary() {
  var pageTemplate = require( '../../templates/prepare-worksheets/page-summary.hbs' );
  var summarySection = require( '../../templates/prepare-worksheets/page-summary-section.hbs' );  
  Handlebars.registerPartial('summarySection', summarySection);
  
  var templateData = {summarySection: summarySection};
  var filterOpts = {requireGrade: true};
  var goals = _model.filterEmptyRows(_model.combineGoals(), filterOpts);
  templateData.goals = _model.sortWorksheetByGrade(goals, 'goals');
  var risks = _model.filterEmptyRows(_model.getWorksheet('risks'), filterOpts);
  templateData.risks = _model.sortWorksheetByGrade(risks, 'risks');
  var flags = _model.filterEmptyRows(_model.getWorksheet('flags'), filterOpts);
  templateData.flags = _model.sortWorksheetByGrade(flags, 'flags');
  
  var pageHtml = pageTemplate(templateData);
  _worksheetsDOM.innerHTML = pageHtml;
}

init();
