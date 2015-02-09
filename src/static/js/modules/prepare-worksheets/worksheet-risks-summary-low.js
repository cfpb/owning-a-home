var _grades = require('./inputs/input-graded-grades');

var worksheetSettings = {
  template: require( '../../templates/prepare-worksheets/worksheet-risks-summary-low.hbs' ),
  inputModule: require( './inputs/input-text' ),
  type: 'risks',
  skipEmpties: true,
  showOnlyGrade: _grades.LOW,
  getDefaultInputOptions: _getDefaultInputOptions
};
this.worksheetSettings = worksheetSettings;

// @return [Object] Default settings for a new user input control.
function _getDefaultInputOptions() {
  return {
    inputValue: '',
    placeholder: '',
    highGradeText: '',
    mediumGradeText: '',
    lowGradeText: '',
    deletable: false
  };
}
