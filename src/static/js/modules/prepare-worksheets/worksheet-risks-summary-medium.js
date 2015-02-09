var _grades = require('./inputs/input-graded-grades');

var worksheetSettings = {
  template: require( '../../templates/prepare-worksheets/worksheet-risks-summary-medium.hbs' ),
  inputModule: require( './inputs/input-stacked-text' ),
  type: 'risks',
  skipEmpties: true,
  showOnlyGrade: _grades.MEDIUM,
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
