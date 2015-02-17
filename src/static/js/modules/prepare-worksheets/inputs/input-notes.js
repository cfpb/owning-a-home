// Import modules.
var _eventObserver = require( '../util/event-observer' );
var _domHelper = require( '../util/dom-helper' );
var _uuid = require( '../util/uuid' );

function create( options ) {
  return new InputNotes(options);
}

// InputNotes UI element constructor.
function InputNotes( options ) {
  // TODO see if bind() can be used in place of _self = this.
  // Note bind()'s lack of IE8 support.
  var _self = this;

  // Load our handlebar templates.
  var _template = require( '../../../templates/prepare-worksheets/input-notes.hbs' );
  var _templateSettings = {
    inputValue: options.inputValue,
    altTextValue: options.altText
  };
  var snippet = _template( _templateSettings );

  // This appendChild could be replaced by jquery or similar if desired/needed.
  var node = _domHelper.appendChild( options.container, snippet );

  // DOM references.
  var _textDOM = node.querySelector('p');
  var _altTextInputDOM = node.querySelector('input');

  // Listen for updates to the text or grading buttons.
  _altTextInputDOM.addEventListener( 'keyup', _changedHandler );

  function _changedHandler() {
    _self.dispatchEvent( 'change', {target: _self, state: getState()} );
  }


  // @return [Object] The contents of the text input and the button grade.
  function getState() {
    return {
      text: _templateSettings.inputValue,
      altText: _altTextInputDOM.value
    };
  }

  // @param state [Object] `text` and `altText` values.
  function setState(state) {
    var text = state.text === undefined ? '' : state.text;
    var altText = state.altText === undefined ? null : state.altText;
    _textDOM.innerHTML = text;
    _altTextInputDOM.value = altText;
  }

  // Expose instance's public methods.
  this.getState = getState;
  this.setState = setState;

  // Attach additional methods.
  _eventObserver.attach(this);
  _uuid.attach(this);
}

// Expose public methods.
this.create = create;
