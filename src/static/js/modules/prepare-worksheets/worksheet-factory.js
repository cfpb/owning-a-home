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

// Create goals summary.
this.createWorksheetGoalsSummaryHigh = function () {
  var settings = require( './worksheet-goals-summary-high' );
  return Worksheet.create( settings );
};

this.createWorksheetGoalsSummaryMedium = function () {
  var settings = require( './worksheet-goals-summary-medium' );
  return Worksheet.create( settings );
};

this.createWorksheetGoalsSummaryLow = function () {
  var settings = require( './worksheet-goals-summary-low' );
  return Worksheet.create( settings );
};

// Create red flags summary.
this.createWorksheetFlagsSummaryHigh = function () {
  var settings = require( './worksheet-flags-summary-high' );
  return Worksheet.create( settings );
};

this.createWorksheetFlagsSummaryMedium = function () {
  var settings = require( './worksheet-flags-summary-medium' );
  return Worksheet.create( settings );
};

this.createWorksheetFlagsSummaryLow = function () {
  var settings = require( './worksheet-flags-summary-low' );
  return Worksheet.create( settings );
};

// Create risks summary.
this.createWorksheetRisksSummaryHigh = function () {
  var settings = require( './worksheet-risks-summary-high' );
  return Worksheet.create( settings );
};

this.createWorksheetRisksSummaryMedium = function () {
  var settings = require( './worksheet-risks-summary-medium' );
  return Worksheet.create( settings );
};

this.createWorksheetRisksSummaryLow = function () {
  var settings = require( './worksheet-risks-summary-low' );
  return Worksheet.create( settings );
};
