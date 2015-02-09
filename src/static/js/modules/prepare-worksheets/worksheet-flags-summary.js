var worksheetSettings = {
  template: require( '../../templates/prepare-worksheets/worksheet-flags-summary.hbs' ),
  inputModule: require( './inputs/input-text' ),
  type: 'flags',
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
