// Import modules.
var $ = require("jquery");
require("../secondary-nav");
var inputGradedFactory = require("./input-graded");

// DOM HTML element references.
var worksheetsDOM = $(".worksheets").get(0);
var inputGradedGroupDOM;

var inputsGradedGroup = []; // List of InputGraded instances.

function init() {
  loadUserInputPage();
}

function loadUserInputPage() {
  var template = require('../../templates/prepare-worksheets/worksheet-goals.hbs');
  var snippet = template();
  worksheetsDOM.innerHTML = snippet;

  var data = JSON.parse(document.getElementById('data').innerHTML); // TEMP mock data
  data = null; // TEMP disabled temporary mock data and load defaults
  if (data) {
    generateInputs(data);
  } else {
    loadDefaults();
  }

  // Set up button interactivity - Add a new graded input item.
  $(".btn-add-input-graded").click(addItemClickHandler);
}

function loadFeedbackPage() {
  
}

function loadSummaryPage() {
  var template = require('../../templates/prepare-worksheets/worksheet-summary.hbs');
  var snippet = template({"inputs":recordedState});
  worksheetsDOM.innerHTML = snippet;
}

function loadDefaults() {
  // Saved values for the goal inputs.
  var defaultGoalInputValues = [
    {"text": "I want more space (for example, to accommodate a growing family)","grade": null},
    {"text": "I want certain features (for example, a yard)","grade": null},
    {"text": "I want to locate in a particular area (for example, a certain school district)","grade": null},
    {"text": "I want to decorate, renovate, or otherwise personalize my home","grade": null},
    {"text": "","grade": null},
    {"text": "", "grade": null}
  ];

  generateInputs(defaultGoalInputValues);
}

function generateInputs(data) {
  // DOM reference.
  inputGradedGroupDOM = $(".worksheet-goal .input-graded-group");

  var options = {};
  options.container = inputGradedGroupDOM.get(0);
  for ( var g = 0, len = data.length; g < len; g++ ) {
    options.inputValue = data[g].text;
    options.gradeValue = data[g].grade;
    inputsGradedGroup.push(inputGradedFactory.create(options));
  }
}

$(".btn-next").click(recordState);

var recordedState = [];
function recordState() {
  for ( var g = 0, len = inputsGradedGroup.length; g < len; g++ ) {
    recordedState.push( inputsGradedGroup[g].getState() );
  }

  // TEMP Example of loading an example state.
  // var str = '[{"text":"test","grade":0},{"text":"testing","grade":1},{"text":"dude","grade":2}]';
  // loadState(str);

  loadSummaryPage();
}

function loadState(data) {
  var json = JSON.parse(data);
  for ( var i = 0, len = json.length; i < len; i++ ) {
    inputsGradedGroup[i].setState(json[i]);
  }
}

function addItemClickHandler(evt) {
  var options = {
    container: inputGradedGroupDOM.get(0),
    inputValue: ""
  };
  inputsGradedGroup.push(inputGradedFactory.create(options));
}

init();
