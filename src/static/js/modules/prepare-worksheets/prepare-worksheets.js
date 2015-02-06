// Import modules.
require("../secondary-nav");

// Worksheet instance factory.
var Worksheet = require('./worksheet');

// Goals worksheet settings.
var _worksheetGoalsSettings = require('./worksheet/goals-settings');
var _worksheetGoals;

// DOM references.
var _worksheetsDOM = document.querySelector('.worksheets');
var _btnNext = document.querySelector('.btn-worksheet-next');
var _btnPrev = document.querySelector('.btn-worksheet-prev');

// General app properties.
var _currentContext; // The current worksheet that's displayed.
var _savedData; // The data from the worksheets in JSON.
var _page = 1;
var TOTAL_PAGES = 3;

function init() {
  _loadWorksheets();
  _btnNext.addEventListener('mousedown', _nextClicked, false);
  _btnPrev.addEventListener('mousedown', _prevClicked, false);
  _btnNext.classList.remove('btn__disabled');
}

function _nextClicked() {
  _page++;
  if (_page === TOTAL_PAGES) {
    _btnNext.classList.add('btn__disabled');
  } else {
    _btnPrev.classList.remove('btn__disabled');
  }
  _loadPage(_page);
}

function _prevClicked() {
  _page--;
  if (_page === 1) {
    _btnPrev.classList.add('btn__disabled');
  } else {
    _btnNext.classList.remove('btn__disabled');
  }
  _loadPage(_page);
}

function _loadPage(page) {
  _saveData();
  switch(page) {
    case 1 :
      _loadWorksheets(_loadData());
    break;
    case 2 :
      _loadNotes();
    break;
    case 3 :
      _loadSummaryPage(_loadData());
    break;
  }
}

function _saveData() {
  _savedData = _currentContext.getState();
}

function _loadData() {
  return _savedData;
}

function  _loadWorksheets(data) {
  console.log('load worksheet');
  _worksheetGoals = Worksheet.create();
  _worksheetGoals.init(_worksheetGoalsSettings);
  _worksheetGoals.loadInto(_worksheetsDOM, data);
  _currentContext = _worksheetGoals;

  // TEMP Example of loading state from embedded JSON.
  //var data = JSON.parse(document.getElementById('data').innerHTML);
  // worksheetGoals.init(worksheetsDOM, data);

  // TEMP Example of loading an example state.
  // var str = '[{"text":"test","grade":0},{"text":"testing","grade":1},{"text":"dude","grade":2}]';
  // worksheetGoals.loadState(str);
}

function _loadNotes(data) {
  console.log('load notes');
}

function _loadSummaryPage(data) {
  console.log('load summary page');
  var template = require('../../templates/prepare-worksheets/worksheet-summary.hbs');
  var snippet = template({"inputs":data});
  _worksheetsDOM.innerHTML = snippet;
}

init();
