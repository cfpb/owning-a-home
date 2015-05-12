var React = require('react');
var LoanActions = require('../actions/loan-actions');

var LoanTypeInput = React.createClass({
  handleChange: function (e) {
      LoanActions.update(this.props.loan.id, this.props.prop, e.target.value);
  },
  render: function() {
      // option disabled check
      // highlight check
    var loan = this.props.loan;
    var prop = this.props.prop;
    var val = loan[prop];
    var isArm = loan['is-arm'];
    var classStr = 'select-content';
    if (loan['type-error']) {
        classStr += ' highlight-dropdown';
    }
    return (
        <div className={classStr}>
          <select 
              ref="select"
              name={prop}
              value={val}
              onChange={this.handleChange}>
              <option value="conf">Conventional</option>
              <option value="fha" disabled={isArm}>FHA</option>
              <option value="va" disabled={isArm}>VA</option>
          </select>
        </div>
    );
  }
});

module.exports = LoanTypeInput;