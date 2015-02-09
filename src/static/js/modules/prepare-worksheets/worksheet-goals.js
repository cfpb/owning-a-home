var worksheetSettings = {
  template: require( '../../templates/prepare-worksheets/worksheet-goals.hbs' ),
  inputModule: require( './inputs/input-graded' ),
  type: 'goals',
  getDefaultInputOptions: _getDefaultInputOptions
};
this.worksheetSettings = worksheetSettings;

var _worksheet;
// @param worksheet [Object] The associated worksheet instance.
// @param container [HTMLNode] (optional) HTML element containing buttons, etc.
this.loadInto = function ( worksheet, container ) {
  _worksheet = worksheet;
  _initAddBtn( container );
  _initResetBtn( container );
};

// @return [Object] Default settings for a new user input control.
function _getDefaultInputOptions() {
  return {
    inputValue: '',
    placeholder: 'Fill in your own goal',
    highGradeText: 'High',
    mediumGradeText: 'Med',
    lowGradeText: 'Low',
    deletable: true
  };
}

function _initAddBtn( container ) {
  var contextSelector = '.worksheet-' + worksheetSettings.type;
  var btnAdd = container.querySelector( contextSelector + ' .btn-worksheet-add-row' );
  btnAdd.addEventListener( 'mousedown', _addRowClickHandler, false );
}

function _initResetBtn( container ) {
  var contextSelector = '.worksheet-' + worksheetSettings.type;
  var btnReset = container.querySelector( contextSelector + ' .btn-worksheet-reset' );
  btnReset.addEventListener( 'mousedown', _resetClickHandler, false );
}

function _addRowClickHandler() {
  _worksheet.addRow();
}

function _resetClickHandler() {
  _worksheet.reset();
}
