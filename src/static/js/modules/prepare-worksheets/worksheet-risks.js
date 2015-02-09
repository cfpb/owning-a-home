var worksheetSettings = {
  template: require( '../../templates/prepare-worksheets/worksheet-risks.hbs' ),
  inputModule: require( './inputs/input-graded' ),
  type: 'risks',
  getDefaultInputOptions: _getDefaultInputOptions
};
this.worksheetSettings = worksheetSettings;

var _worksheet;
// @param worksheet [Object] The associated worksheet instance.
// @param container [HTMLNode] (optional) HTML element containing buttons, etc.
this.loadInto = function ( worksheet, container ) {
  _worksheet = worksheet;
  _initAddBtn( container );
};

// @return [Object] Default settings for a new user input control.
function _getDefaultInputOptions() {
  return {
    inputValue: '',
    placeholder: 'Identify your own risk',
    highGradeText: 'Yes',
    mediumGradeText: 'Maybe',
    lowGradeText: 'No',
    deletable: false
  };
}

function _initAddBtn( container ) {
  var contextSelector = '.worksheet-' + worksheetSettings.type;
  var btnAdd = container.querySelector( contextSelector + ' .btn-worksheet-add-row' );
  btnAdd.addEventListener( 'mousedown', _addRowClickHandler, false );
}

function _addRowClickHandler() {
  var options = _getDefaultInputOptions();
  options.deletable = true;
  _worksheet.addRow( options );
}
