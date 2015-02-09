// Import modules.
require( '../secondary-nav' );
var _locationServices = require( './util/location-services' );
var _model = require( './worksheet-model' ); // The data from the worksheets in JSON.

// Worksheet instance factory and worksheets.
var _worksheetFactory = require('./worksheet-factory');

// DOM references.
var _worksheetsDOM = document.querySelector('.worksheets');
var _btnNext = document.querySelector('.btn-worksheet-next');
var _btnPrev = document.querySelector('.btn-worksheet-prev');

// General app properties.
var _currentContext = []; // The current worksheets that are displayed.
var _page = 1;
var TOTAL_PAGES = 3;

function init() {

  // Load ?page=<page number> from URL or default to page 1.
  _page = Number(_locationServices.getURLParameter('page')) || 1;

  // Set default data in model if goals worksheet is not populated.
  var worksheet = _model.getWorksheet('goals');
  if (!worksheet) {
    _model.setData( _model.getDefaultData() );
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
    _loadSummaryPage();
    break;
  }
  _updateNavigationState();
}

/* // TEMP - DEBUG - display worksheet data in console.
document.querySelector('.official-website').addEventListener('mousedown', function() {
  console.log( 'git...', _model.getData().worksheets.goals );
} );
*/

function  _loadWorksheets() {
  var data = _model.getWorksheet('goals');
  var goals = _worksheetFactory.createWorksheetGoals();
  goals.loadInto( _worksheetsDOM, data );

  data = _model.getWorksheet('flags');
  var flags = _worksheetFactory.createWorksheetFlags();
  flags.loadInto( _worksheetsDOM, data );

  data = _model.getWorksheet('risks');
  var risks = _worksheetFactory.createWorksheetRisks();
  risks.loadInto( _worksheetsDOM, data );

  _currentContext = [
    {
      'type': 'goals',
      'data': goals
    },
    {
      'type': 'flags',
      'data': flags
    },
    {
      'type': 'risks',
      'data': risks
    }
  ];

  // TEMP Example of loading state from embedded JSON.
  //var data = JSON.parse(document.getElementById('data').innerHTML);
  //_goals.loadInto( _worksheetsDOM, data );
  //_currentContext = _goals;

  // TEMP Example of loading an example state.
  //var str = '[{"text":"test","grade":0},{"text":"testing","grade":1},{"text":"dude","grade":2}]';
  //_goals.loadData(str);
}

function _loadNotes() {
  var data = _model.getWorksheet('goals');
  var notes = _worksheetFactory.createWorksheetGoalsNotes();
  notes.loadInto( _worksheetsDOM, data );
  _currentContext = [
    {
      'type': 'goals',
      'data': notes
    }
  ];
}

function _loadSummaryPage() {

  // Prepare goals summary.
  var data = _model.getWorksheet('goals');
  var goalsSummaryHigh = _worksheetFactory.createWorksheetGoalsSummaryHigh();
  goalsSummaryHigh.loadInto( _worksheetsDOM, data );

  data = _model.getWorksheet('goals');
  var goalsSummaryMedium = _worksheetFactory.createWorksheetGoalsSummaryMedium();
  goalsSummaryMedium.loadInto( _worksheetsDOM, data );

  data = _model.getWorksheet('goals');
  var goalsSummaryLow = _worksheetFactory.createWorksheetGoalsSummaryLow();
  goalsSummaryLow.loadInto( _worksheetsDOM, data );

  // Prepare red flags summary.
  data = _model.getWorksheet('flags');
  var flagsSummaryHigh = _worksheetFactory.createWorksheetFlagsSummaryHigh();
  flagsSummaryHigh.loadInto( _worksheetsDOM, data );

  data = _model.getWorksheet('flags');
  var flagsSummaryMedium = _worksheetFactory.createWorksheetFlagsSummaryMedium();
  flagsSummaryMedium.loadInto( _worksheetsDOM, data );

  data = _model.getWorksheet('flags');
  var flagsSummaryLow = _worksheetFactory.createWorksheetFlagsSummaryLow();
  flagsSummaryLow.loadInto( _worksheetsDOM, data );

  // Prepare risks summary.
  data = _model.getWorksheet('risks');
  var risksSummaryHigh = _worksheetFactory.createWorksheetRisksSummaryHigh();
  risksSummaryHigh.loadInto( _worksheetsDOM, data );

  data = _model.getWorksheet('risks');
  var risksSummaryMedium = _worksheetFactory.createWorksheetRisksSummaryMedium();
  risksSummaryMedium.loadInto( _worksheetsDOM, data );

  data = _model.getWorksheet('risks');
  var risksSummaryLow = _worksheetFactory.createWorksheetRisksSummaryLow();
  risksSummaryLow.loadInto( _worksheetsDOM, data );


  _currentContext = [
    {
      'type': 'goals',
      'data': goalsSummaryHigh
    },
    {
      'type': 'goals',
      'data': goalsSummaryMedium
    },
    {
      'type': 'goals',
      'data': goalsSummaryLow
    },
    {
      'type': 'flags',
      'data': flagsSummaryHigh
    },
    {
      'type': 'flags',
      'data': flagsSummaryMedium
    },
    {
      'type': 'flags',
      'data': flagsSummaryLow
    },
    {
      'type': 'risks',
      'data': risksSummaryHigh
    },
    {
      'type': 'risks',
      'data': risksSummaryMedium
    },
        {
      'type': 'risks',
      'data': risksSummaryLow
    }
  ];
}

init();
