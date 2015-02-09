// Import modules.
var _eventObserver = require( '../util/event-observer' );

function create(options) {
  return new ButtonGradingGroup(options);
}

// ButtonGradingGroup UI element constructor.
function ButtonGradingGroup(options) {
  // TODO see if bind() can be used in place of _self = this.
  // Note bind()'s lack of IE8 support.
  var _self = this;

  var _grades = require('./input-graded-grades');

  // The grade of this input.
  var grade = _grades.UNSET;
  var lastNode;

  var btnsGradeDOM = options.container.querySelectorAll(options.selector);

  var input;
  for (var b = 0, len = btnsGradeDOM.length; b < len; b++) {
    input = btnsGradeDOM[b];
    if (input.classList.contains('active')) {
      lastNode = input;
    }
    input.addEventListener('mousedown', gradeSelected(input, b));
  }

  // @param node [Object] The DOM element for the grade selection button.
  // @param btnIndex [Number] The index position of the button.
  function gradeSelected(node, btnIndex) {
    return function() {
      if (node === lastNode) {
        unsetGrades(node);
      } else {
        grade = _grades.findGrade(btnIndex);
        if (!lastNode) {
          node.classList.add('active');
          options.container.classList.add('active');
        } else {
          lastNode.classList.remove('active');
          node.classList.add('active');
        }
        lastNode = node;
      }
      _self.dispatchEvent( 'change', {target: _self} );
    };
  }

  function unsetGrades(node) {
    if (node) {
      node.classList.remove('active');
    }
    options.container.classList.remove('active');
    grade = _grades.UNSET;
    lastNode = undefined;
  }

  function getGrade() {
    return grade;
  }

  function setGrade(toGrade) {
    var newGrade = _grades.findGrade(toGrade);
    if (newGrade === _grades.UNSET) {
      unsetGrades(lastNode);
    } else {
      gradeSelected( btnsGradeDOM[newGrade], newGrade )();
    }
  }

  // Expose public methods
  this.getGrade = getGrade;
  this.setGrade = setGrade;

  // Attach additional methods.
  _eventObserver.attach(this);
}

// Expose public methods.
this.create = create;
