function create() {
  return new Worksheet();
}

function Worksheet() {
  var _settings;
  var InputGraded;

  var _inputGradedGroupDOM;
  var _inputsGradedList = []; // List of InputGraded instances.
  var _inputsGradedListIndex = {};

  function init(config) {
    _settings = config.settings;
    InputGraded = _settings.inputModule;
  }

  function loadInto(container, data) {
    var snippet = _settings.worksheetTemplate();
    container.innerHTML = snippet;

    if (data) {
      _generateInputs(data);
    } else {
      _loadDefaults();
    }

    // Set up button interactivity - Add a new graded input item.
    var btnAdd = container.querySelector('.btn-add-input-graded');
    btnAdd.addEventListener('mousedown', _addItemClickHandler);
  }

  function _loadDefaults() {
    _generateInputs(_settings.defaultValues);
  }

  function _generateInputs(data) {
    // DOM reference.
    _inputGradedGroupDOM = document.querySelector('.worksheet-goal .input-graded-group');

    var options = {};
    options.container = _inputGradedGroupDOM;
    var input, index;
    for ( var g = 0, len = data.length; g < len; g++ ) {
      options.inputValue = data[g].text;
      options.gradeValue = data[g].grade;
      input = InputGraded.create(options);
      input.addEventListener('delete', _inputDeleted);
      index = _inputsGradedList.push(input) - 1;
      _inputsGradedListIndex[input.UUID] = index;
    }
  }

  function _inputDeleted(evt) {
    _inputsGradedList.splice(_inputsGradedListIndex[evt.target.UUID], 1);
    delete _inputsGradedListIndex[evt.target];

    // Rebuilts list index.
    _inputsGradedListIndex = [];
    for ( var g = 0, len = _inputsGradedList.length; g < len; g++ ) {
      _inputsGradedListIndex[_inputsGradedList[g].UUID] = g;
    }
  }

  function _recordState() {
    var recordedState = [];
    for ( var g = 0, len = _inputsGradedList.length; g < len; g++ ) {
      recordedState.push( _inputsGradedList[g].getState() );
    }
    return recordedState;
  }

  function _addItemClickHandler(evt) {
    var options = {
      container: _inputGradedGroupDOM,
      inputValue: ""
    };
    _inputsGradedList.push(InputGraded.create(options));
  }

  // @return [Array] Array of recorded inputs.
  function getState() {
    return _recordState();
  }

  // @param data [String] The saved data as a JSON string.
  function loadState(data) {
    var json = JSON.parse(data);
    for ( var i = 0, len = json.length; i < len; i++ ) {
      _inputsGradedList[i].setState(json[i]);
    }
  }

  // Reset the state to the default values.
  function resetState() {
    _loadDefaults();
  }

  // Expose methods externally for instance.
  this.init = init;
  this.loadInto = loadInto;
  this.getState = getState;
  this.loadState = loadState;
  this.resetState = resetState;
}

// Expose methods externally.
this.create = create;
