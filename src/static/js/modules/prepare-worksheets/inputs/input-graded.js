// Import modules.
var _eventObserver = require( '../util/event-observer' );
var _domHelper = require( '../util/dom-helper' );
var _uuid = require( '../util/uuid' );

function create( options ) {
  return new InputGraded( options );
}

// InputGraded UI element constructor.
function InputGraded( options ) {
  // TODO see if bind() can be used in place of _self = this.
  // Note bind()'s lack of IE8 support.
  var _self = this;

  // Load our handlebar templates.
  var _template = require( '../../../templates/prepare-worksheets/input-graded.hbs' );
  var _templateSettings = {
    inputValue: options.inputValue,
    placeholderValue: options.placeholder,
    highGradeText: options.highGradeText,
    mediumGradeText: options.mediumGradeText,
    lowGradeText: options.lowGradeText,
    deletable: options.deletable
  };
  var _grades = require( './input-graded-grades' );
  if ( options.gradeValue === _grades.HIGH ) _templateSettings.highGrade = true;
  if ( options.gradeValue === _grades.MEDIUM ) _templateSettings.mediumGrade = true;
  if ( options.gradeValue === _grades.LOW ) _templateSettings.lowGrade = true;
  var _snippet = _template( _templateSettings );

  // This appendChild could be replaced by jquery or similar if desired/needed.
  var _node = _domHelper.appendChild( options.container, _snippet );

  // DOM references.
  var _textInputDOM = _node.querySelector('.input-with-btns_input input');

  // Add events for handling deletion of the node.
  if ( options.deletable ) {
    var btnDeleteDOM = _node.querySelector('.btn-input-delete');
    btnDeleteDOM.addEventListener( 'mousedown', deleteItem, false );

    this.deleteItem = deleteItem;
  }

  // Deletes this graded input.
  function deleteItem( evt ) {
    _node.parentNode.removeChild( _node );
    _self.dispatchEvent( 'delete', {target: _self} );
  }

  var _module = require( './button-grading-group' );
  var _selector = '.input-with-btns_btns .btn';
  var _buttonGradingGroup = _module.create( {container: _node, selector: _selector} );

  // Listen for updates to the text or grading buttons.
  _textInputDOM.addEventListener( 'keyup', _changedHandler );
  _buttonGradingGroup.addEventListener( 'change', _changedHandler );

  function _changedHandler() {
    _self.dispatchEvent( 'change', {target: _self, state: getState()} );
  }

  // @return [Object] The contents of the text input and the button grade.
  function getState() {
    return {
      text: _textInputDOM.value,
      grade: _buttonGradingGroup.getGrade()
    };
  }

  // @param state [Object] `text` and `grade` values.
  function setState( state ) {
    var text = state.text === undefined ? '' : state.text;
    var grade = state.grade === undefined ? null : state.grade;
    _textInputDOM.value = text;
    _buttonGradingGroup.setGrade( grade );
  }

  // Expose instance's public methods.
  // 'deleteItem' is also included earlier.
  this.getState = getState;
  this.setState = setState;

  // Attach additional methods.
  _eventObserver.attach(this);
  _uuid.attach(this);
}

// Expose public methods.
this.create = create;
