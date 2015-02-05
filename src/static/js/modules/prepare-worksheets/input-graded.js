var eventObserver = require('./event-observer.js');

function create(options) {
  return new InputGraded(options);
}

// InputGraded UI element constructor.
function InputGraded(options) {

  // TODO see if bind() can be used in place of self = this.
  // Note bind()'s lack of IE8 support.
  var self = this;

  eventObserver.attach(this);

  // Load our handlebar templates.
  var template = require('../../templates/prepare-worksheets/input-graded.hbs');
  var container = options.container;
  var templateSettings = {
    input_value: options.inputValue
  }
  var grades = require('./input-graded-grades');
  if (options.gradeValue === grades.HIGH) templateSettings.high_grade = true;
  if (options.gradeValue === grades.MEDIUM) templateSettings.medium_grade = true;
  if (options.gradeValue === grades.LOW) templateSettings.low_grade = true;
  var snippet = template(templateSettings);

  // Convert the arbitary HTML of the template in a DOM node,
  // and append it to the container.
  var temp = document.createElement('div');
  temp.innerHTML = snippet;
  var node = container.appendChild(temp.children[0]);

  // DOM references.
  var textInputDOM = node.querySelector('.input-with-btns_input input');
  var btnDeleteDOM = node.querySelector('.btn-delete');

  // Add events for handling deletion of the node.
  btnDeleteDOM.addEventListener('mousedown', deleteItem);

  // Deletes this graded input.
  function deleteItem(evt) {
    node.parentNode.removeChild(node);
    self.dispatchEvent('deleted', {target:node});
  }

  var module = require('./button-grading-group');
  var selector = '.input-with-btns_btns .btn';
  var buttonGradingGroup = module.create({container:node, selector:selector});

  // @return [Object] The contents of the text input and the button grade.
  function getState() {
    return {
      text: textInputDOM.value,
      grade: buttonGradingGroup.getGrade()
    }
  }

  // @param state [Object] `text` and `grade` values.
  function setState(state) {
    var text = state.text === undefined ? '' : state.text;
    var grade = state.grade === undefined ? null : state.grade;
    textInputDOM.value = text;
    buttonGradingGroup.setGrade(grade);
  }

  // Expose InputGraded instance's public methods.
  this.deleteItem = deleteItem;
  this.getState = getState;
  this.setState = setState;
}

// Expose public methods.
this.create = create;
