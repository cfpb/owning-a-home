// Import modules.
var _model = require( './worksheet-model' );
var _domHelper = require( './util/dom-helper' );
var _dataDocument = require( './util/data-document' );

// @param options [Object] Options such as the worksheet type, settings, etc.
// @return [Object] A new Worksheet instance.
function create( options ) {
  return new Worksheet(options);
}

// Constructor for a Worksheet instance.
// @param options [Object] Options such as the worksheet type, settings, etc.
function Worksheet( options ) {
  var _settings = options.worksheetSettings;

  // What type of worksheet this is (goals, flags, or risks).
  var _type = _settings.type;

  // Options for the inputs, such as the default text, etc.
  var _getDefaultInputOptions = _settings.getDefaultInputOptions;

  // Whether inputs with empty text should be skipped for rendering.
  var _skipEmpties = _settings.skipEmpties;

  var _showOnlyGrade = _settings.showOnlyGrade;

  // Template to load.
  var _worksheetTemplate = _settings.template;

  // The input module to instantiate for user inputs or data display.
  var InputModule = _settings.inputModule;

  var _inputsGroupDOM;
  var _inputsList = []; // List of InputModule instances.
  var _inputsListIndex = {};

  function loadInto(container, data) {
    var snippet = _worksheetTemplate( data );
    var node = _domHelper.appendChild( container, snippet );
    _inputsGroupDOM = node.querySelector('.worksheet-input-group');

    if ( data && data.length > 0 ) {
      _generateInputs(data);
    } else {
      _loadDefaults();
    }

    if ( options.loadInto ) {
      options.loadInto(this, container);
    }
  }

  function _loadDefaults() {
    _generateInputs( _model.getDefaultWorksheet( _type ) );
  }

  function _generateInputs( data ) {
    var options = _getDefaultInputOptions();
    options.container = _inputsGroupDOM;
    for ( var g = 0, len = data.length; g < len; g++ ) {
      options.inputValue = data[g].text;
      options.gradeValue = data[g].grade;
      options.altText = data[g].altText;
      options.explanation = data[g].explanation;

      // BUG - If an empty entry is before entries with values and
      // altText is added to the later entries, the values will be
      // shifted into the void occupied by the empties.
      if ( _skipEmpties === true && options.inputValue === '' ) {
        continue;
      }

      // Skip this input if it's not set to a grade to show.
      // Only runs if:
      // (a) showOnlyGrade is set.
      // (b) grade set matches grade selected by user.
      if ( _showOnlyGrade !== undefined && _showOnlyGrade !== options.gradeValue ) {
        continue;
      }

      _initInput( options );
    }
  }

  // Creates and adds event listeners to input.
  // @return [Object] An input module instance.
  function _initInput( options ) {
    var input, index;
    input = InputModule.create( options );

    // If input broadcasts events, listen for deletion.
    if (input.addEventListener) {
      input.addEventListener('change', _inputChanged);
      input.addEventListener('delete', _inputDeleted);
    }
    index = _inputsList.push(input) - 1;
    _inputsListIndex[input.UUID] = index;
    return input;
  }

  // @param evt [Object] Event object of the change event.
  function _inputChanged( evt ) {
    var target = evt.target;
    _model.setWorksheetRow( _type, _inputsListIndex[target.UUID], target.getState() );
  }

  // @param evt [Object] Event object of the delete event.
  function _inputDeleted( evt ) {
    _model.deleteWorksheetRow( _type, _inputsListIndex[evt.target.UUID] );

    _inputsList.splice(_inputsListIndex[evt.target.UUID], 1);
    delete _inputsListIndex[evt.target];

    // Rebuilts input list index.
    _inputsListIndex = [];
    for ( var g = 0, len = _inputsList.length; g < len; g++ ) {
      _inputsListIndex[_inputsList[g].UUID] = g;
    }
  }

  // @param options [Object] The values/options for the new row data.
  //   If omitted the default input values are used.
  function addRow( options ) {
    if (!options) {
      options = _getDefaultInputOptions();
    }
    options.container = _inputsGroupDOM;
    _initInput( options );
    _model.addWorksheetRow( _type, 1 );
  }

  // Reset the state to the default values.
  function reset() {
    _inputsGroupDOM.innerHTML = '';
    _inputsList = [];
    _inputsListIndex = {};

    var defaultWorksheet = _model.getDefaultWorksheet( _type );
    _model.setWorksheet( _type, defaultWorksheet );

    _loadDefaults();
  }

  // @return [Array] List of inputs that have data that can be recorded.
  //   Could be input elements, plain text, or buttons.
  function getInputs() {
    return _inputsList;
  }

  // Expose instance's methods externally.
  this.loadInto = loadInto;
  this.getInputs = getInputs;
  this.addRow = addRow;
  this.reset = reset;

  // Attach additional methods.
  _dataDocument.attach(this);
}

// Expose methods externally.
this.create = create;
