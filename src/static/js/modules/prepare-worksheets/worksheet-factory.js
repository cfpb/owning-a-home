// Import modules.
var Worksheet = require( './worksheet' );

this.createWorksheetGoals = function () {
  var settings = require( './worksheet-goals' );
  return Worksheet.create( settings );
};

this.createWorksheetFlags = function () {
  var settings = require( './worksheet-flags' );
  return Worksheet.create( settings );
};

this.createWorksheetRisks = function () {
  var settings = require( './worksheet-risks' );
  return Worksheet.create( settings );
};

this.createWorksheetGoalsNotes = function () {
  var settings = require( './worksheet-goals-notes' );
  return Worksheet.create( settings );
};

this.createWorksheetGoalsSummary = function () {
  var settings = require( './worksheet-goals-summary' );
  return Worksheet.create( settings );
};

this.createWorksheetFlagsSummary = function () {
  var settings = require( './worksheet-flags-summary' );
  return Worksheet.create( settings );
};

this.createWorksheetRisksSummary = function () {
  var settings = require( './worksheet-risks-summary' );
  return Worksheet.create( settings );
};
