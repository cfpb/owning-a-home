// Import modules.
require("../secondary-nav");

// Worksheet instance factory.
var Worksheet = require('./worksheet');

// Goals worksheet settings.
var _worksheetGoalsSettings = require('./worksheet/goals-settings');
var _worksheetGoals;

// DOM references.
var _worksheetsDOM = document.querySelector('.worksheets');

function init() {

  _worksheetGoals = Worksheet.create();
  _worksheetGoals.init(_worksheetGoalsSettings);
  _worksheetGoals.loadInto(_worksheetsDOM);

  // TEMP Example of loading state from embedded JSON.
  //var data = JSON.parse(document.getElementById('data').innerHTML);
  // worksheetGoals.init(worksheetsDOM, data);

  // TEMP Example of loading an example state.
  // var str = '[{"text":"test","grade":0},{"text":"testing","grade":1},{"text":"dude","grade":2}]';
  // worksheetGoals.loadState(str);

  var btnNext = document.querySelector('.btn-next');
  btnNext.addEventListener('mousedown', _nextClicked, false);
}

function _nextClicked() {
  loadSummaryPage(_worksheetGoals.getState());
}

function loadSummaryPage(data) {
  var template = require('../../templates/prepare-worksheets/worksheet-summary.hbs');
  var snippet = template({"inputs":data});
  _worksheetsDOM.innerHTML = snippet;
}

init();
