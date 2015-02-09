/*
  Example default structure as JSON:

  {
    "worksheets" :
    {
      "goals" :
      [
        {
          "text" : "I want more space (e.g., for a growing family)",
          "grade" : null,
          "altText" : "Could you move to a larger rental unit instead?",
          "explanation" : ""
        },
        {
          "text" : "I want certain features (e.g., a yard)",
          "grade" : null,
          "altText" : "Could you find these features in a rental unit in your community?  (Renting doesn’t always have to mean living in an apartment.  In many areas you can find single-family homes for rent).",
          "explanation" : ""
        },
        {
          "text" : "I want to live in a particular area (e.g., a certain school district)",
          "grade" : null,
          "altText" : "Are there rental units available in your desired location?",
          "explanation" : ""
        },
        {
          "text" : "I want the freedom to decorate or renovate",
          "grade" : null,
          "altText" : "Are there things you could do to make your rental feel more like your own?",
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
          "text" : "There is chance I might move within the next few years",
          "grade" : null,
          "altText" : "Renters have more flexibility. It can be risky and expensive to buy if you end up needing to move again within a few years.",
          "explanation" : ""
        },
        {
          "text" : "My current employment is short-term or unstable",
          "grade" : null,
          "altText" : "Owning a home is a long-term financial commitment.  If you’re not confident that you’ll be able to continue earning at a similar level for the foreseeable future, it might make more sense to keep renting.",
          "explanation" : ""
        },
        {
          "text" : "I find fixing things and doing yardwork to be a real hassle",
          "grade" : null,
          "altText" : "In a lot of ways, it’s simpler and more financially predictable to rent.",
          "explanation" : ""
        }
      ]
    ,
      "risks" :
      [
        {
          "text" : "My home value could decline and my could lose your equity",
          "grade" : null,
          "altText" : "You could even find yourself owing more than your home is worth.  In 2008-2012, house prices declined dramatically nationwide, with up to X% declines in some areas.",
          "explanation" : ""
        },
        {
          "text" : "Major repairs can be urgent, expensive, and unexpected",
          "grade" : null,
          "altText" : "When the furnace springs a leak or a tree falls on the roof, these aren’t repairs that you can wait to make.  New homeowners consistently say that they were surprised how much maintenance costs.",
          "explanation" : ""
        },
        {
          "text" : "Minor repairs add up quickly, in terms of time and money",
          "grade" : null,
          "altText" : "Think of all the little things that you are used to calling your landlord to deal with: a cracked window, a broken dishwasher, or a clogged toilet.  As a homeowner, you will either have to fix these yourself or call and pay for a professional.",
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
  return { "worksheets" : { "goals" : [ { "text" : "I want more space (e.g., for a growing family)", "grade" : null, "altText" : "Could you move to a larger rental unit instead?", "explanation" : "" }, { "text" : "I want certain features (e.g., a yard)", "grade" : null, "altText" : "Could you find these features in a rental unit in your community? (Renting doesn’t always have to mean living in an apartment. In many areas you can find single-family homes for rent).", "explanation" : "" }, { "text" : "I want to live in a particular area (e.g., a certain school district)", "grade" : null, "altText" : "Are there rental units available in your desired location?", "explanation" : "" }, { "text" : "I want the freedom to decorate or renovate", "grade" : null, "altText" : "Are there things you could do to make your rental feel more like your own?", "explanation" : "" }, { "text" : "", "grade" : null, "altText" : "", "explanation" : "" }, { "text" : "", "grade" : null, "altText" : "", "explanation" : "" } ] , "flags" : [ { "text" : "There is chance I might move within the next few years", "grade" : null, "altText" : "Renters have more flexibility. It can be risky and expensive to buy if you end up needing to move again within a few years.", "explanation" : "" }, { "text" : "My current employment is short-term or unstable", "grade" : null, "altText" : "Owning a home is a long-term financial commitment. If you’re not confident that you’ll be able to continue earning at a similar level for the foreseeable future, it might make more sense to keep renting.", "explanation" : "" }, { "text" : "I find fixing things and doing yardwork to be a real hassle", "grade" : null, "altText" : "In a lot of ways, it’s simpler and more financially predictable to rent.", "explanation" : "" } ] , "risks" : [ { "text" : "My home value could decline and my could lose your equity", "grade" : null, "altText" : "You could even find yourself owing more than your home is worth. In 2008-2012, house prices declined dramatically nationwide, with up to X% declines in some areas.", "explanation" : "" }, { "text" : "Major repairs can be urgent, expensive, and unexpected", "grade" : null, "altText" : "When the furnace springs a leak or a tree falls on the roof, these aren’t repairs that you can wait to make. New homeowners consistently say that they were surprised how much maintenance costs.", "explanation" : "" }, { "text" : "Minor repairs add up quickly, in terms of time and money", "grade" : null, "altText" : "Think of all the little things that you are used to calling your landlord to deal with: a cracked window, a broken dishwasher, or a clogged toilet. As a homeowner, you will either have to fix these yourself or call and pay for a professional.", "explanation" : "" } ] } };
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
