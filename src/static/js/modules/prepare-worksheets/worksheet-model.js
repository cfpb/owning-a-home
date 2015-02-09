/*
  Example default structure as JSON:

  {
    "worksheets" :
    {
      "goals" :
      [
        {
          "text" : "I want more space (for example, to accommodate a growing family)",
          "grade" : null,
          "altText" : "",
          "explanation" : ""
        },
        {
          "text" : "I want certain features (for example, a yard)",
          "grade" : null,
          "altText" : "",
          "explanation" : ""
        },
        {
          "text" : "I want to locate in a particular area (for example, a certain school district)",
          "grade" : null,
          "altText" : "",
          "explanation" : ""
        },
        {
          "text" : "I want to decorate, renovate, or otherwise personalize my home",
          "grade" : null,
          "altText" : "",
          "explanation" : ""
        },
        {
          "text" : "",
          "grade" : null,
          "altText" : "",
          "explanation" : ""
        },
        {
          "text" : "",
          "grade" : null,
          "altText" : "",
          "explanation" : ""
        }
      ]
    ,
      "flags" :
      [
        {
          "text" : "Is there a chance you might move in the next few months?",
          "grade" : null,
          "altText" : "",
          "explanation" : ""
        }
      ]
    ,
      "risks" :
      [
        {
          "text" : "Your home value could decline",
          "grade" : null,
          "altText" : "",
          "explanation" : ""
        }
      ]
    }
  }
*/

var _dataStore = {worksheets: {}};

// CRUD operations for the worksheet as a whole.
this.setWorksheet = function (type, value) {
  _dataStore.worksheets[type] = value;
};

this.getWorksheet = function (type) {
  return _dataStore.worksheets[type];
};

this.deleteWorksheet = function (type) {
  delete _dataStore.worksheets[type];
};

this.getDefaultWorksheet = function (type) {
  var defaults = this.getDefaultData();
  return defaults.worksheets[type];
};

// CRUD operations for the worksheet rows.
this.deleteWorksheetRow = function ( type, row ) {
  _dataStore.worksheets[type].splice( row, 1 );
};

this.getWorksheetRow = function ( type, row ) {
  row = _dataStore.worksheets[type][row];
  if ( !row ) {
    throw new Error('Requested row out of worksheet bounds!');
  }
  return row;
};

this.addWorksheetRow = function ( type, count ) {
  for ( var i = 0; i < count; i++ ) {
    _dataStore.worksheets[type].push( _getDefaultRow() );
  }
};

this.setWorksheetRow = function ( type, row, data ) {
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      this.setWorksheetProperty(type, row, key, data[key]);
    }
  }
};

// CRUD operations for the worksheet properties.
this.setWorksheetProperty = function ( type, row, key, value ) {
  var worksheet = this.getWorksheet( type );
  if ( !worksheet[row] ) {
    worksheet[row] = {};
  }
  worksheet[row][key] = value;
  this.setWorksheet(type, worksheet);
};

this.getWorksheetProperty = function ( type, row, key ) {
  return this.getWorksheet(type)[row][key];
};

this.deleteWorksheetProperty = function ( type, row, key ) {
  var value = '';
  if ( key === 'grade' ) {
    value = null;
  }
  this.setWorksheetProperty( type, row, key, value );
};

// Utility methods.
this.setData = function (data) {
  _dataStore = data;
};

this.getData = function () {
  return _dataStore;
};

this.getDefaultData = function () {
  return { worksheets : { goals : [ { text : 'I want more space (for example, to accommodate a growing family)', grade : null, altText : '', explanation : '' }, { text : 'I want certain features (for example, a yard)', grade : null, altText : '', explanation : '' }, { text : 'I want to locate in a particular area (for example, a certain school district)', grade : null, altText : '', explanation : '' }, { text : 'I want to decorate, renovate, or otherwise personalize my home', grade : null, altText : '', explanation : '' }, { text : '', grade : null, altText : '', explanation : '' }, { text : '', grade : null, altText : '', explanation : '' } ] , flags : [ { text : 'Is there a chance you might move in the next few months?', grade : null, altText : '', explanation : '' } ] , risks : [ { text : 'Your home value could decline', grade : null, altText : '', explanation : '' } ] } };
};

// Private methods.
function _getDefaultRow () {
  return {
    text: '',
    grade: null,
    altText: '',
    explanation: ''
  };
}

// Currently unused private utility methods.
// Could be used to verify parameter integrity.
function _checkType ( type ) {
  var types = this.types();
  var found = false;
  for ( var t = 0, len = types; t < len; t++ ) {
    if ( type === types[t] ) {
      found = true;
    }
  }
  return found;
}

function _checkProperty ( prop ) {
  var props = this.properties();
  var found = false;
  for ( var p = 0, len = props; p < len; p++ ) {
    if ( prop === props[p] ) {
      found = true;
    }
  }
  return found;
}
