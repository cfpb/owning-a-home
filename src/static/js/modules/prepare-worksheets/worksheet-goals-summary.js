var worksheetSettings = {
  template: require( '../../templates/prepare-worksheets/worksheet-goals-summary.hbs' ),
  inputModule: require( './inputs/input-text' ),
  type: 'goals',
  skipEmpties: true,
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
