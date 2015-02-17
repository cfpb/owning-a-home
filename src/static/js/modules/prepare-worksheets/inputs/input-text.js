// Import modules.
var _eventObserver = require( '../util/event-observer' );
var _domHelper = require( '../util/dom-helper' );
var _uuid = require( '../util/uuid' );

function create( options ) {
  return new InputText(options);
}

// InputText UI element constructor.
function InputText( options ) {
  // TODO see if bind() can be used in place of _self = this.
  // Note bind()'s lack of IE8 support.
  var _self = this;

  // Load our handlebar templates.
  var _template = require( '../../../templates/prepare-worksheets/input-text.hbs' );
  var _templateSettings = {
    inputValue: options.inputValue,
    altTextValue: options.altText
  };
  var _snippet = _template( _templateSettings );

  // This appendChild could be replaced by jquery or similar if desired/needed.
  var _node = _domHelper.appendChild( options.container, _snippet );

  // DOM references.
  var _textDOM = _node.querySelector('p:last-child');
  var _altTextDOM = _node.querySelector('p:first-child');

  // @return [Object] The contents of the text input and the button grade.
  function getState() {
    return {
      text: _templateSettings.inputValue,
      altText: _templateSettings.altTextValue
    };
  }

  // @param state [Object] `text` and `altText` values.
  function setState(state) {
    var text = state.text === undefined ? '' : state.text;
    var altText = state.altText === undefined ? null : state.altText;
    _textDOM.innerHTML = text;
    _altTextDOM.innerHTML = altText;
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
