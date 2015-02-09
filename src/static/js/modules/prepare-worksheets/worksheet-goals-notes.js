var worksheetSettings = {
  template: require( '../../templates/prepare-worksheets/worksheet-goals-notes.hbs' ),
  inputModule: require( './inputs/input-notes' ),
  type: 'goals',
  skipEmpties: true,
  getDefaultInputOptions: _getDefaultInputOptions
};
this.worksheetSettings = worksheetSettings;

// @return [Object] Default settings for a new user input control.
function _getDefaultInputOptions() {
  return {
    inputValue: '',
    placeholder: 'Fill in your own goal',
    highGradeText: 'High',
    mediumGradeText: 'Med',
    lowGradeText: 'Low',
    deletable: false
  };
}
