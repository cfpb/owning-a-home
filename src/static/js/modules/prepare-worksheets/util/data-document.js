// Allows decorating of an object with methods for
// loading and retrieving the state of a document with user inputted data.

// @param target [Object] An object to attach methods to.
function attach(target) {
  var inputs = target.hasOwnProperty('getInputs') ? target.getInputs() : [];
  var proxy = new DataDocument(inputs);
  target.getData = proxy.getData;
  target.loadData = proxy.loadData;
  return target;
}

// @param inputs [Array] List of user inputs.
function DataDocument(inputs) {
  var _inputs = inputs;

  // @return [Array] Array of recorded inputs.
  function getData() {
    var recordedState = [];
    for ( var g = 0, len = _inputs.length; g < len; g++ ) {
      recordedState.push( _inputs[g].getState() );
    }
    return recordedState;
  }

  // @param data [String] The saved data as a JSON string.
  function loadData(data) {
    if (_inputs.length === 0) return this;
    var json = JSON.parse(data);
    for ( var i = 0, len = json.length; i < len; i++ ) {
      _inputs[i].setState(json[i]);
    }

    return this;
  }

  // Expose instance methods externally.
  return {
    getData: getData,
    loadData: loadData
  };
}

// Expose public methods externally.
this.attach = attach;
