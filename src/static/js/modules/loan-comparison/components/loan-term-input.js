var React = require('react');
var LoanActions = require('../actions/loan-actions');

var LoanTermInput = React.createClass({
  handleChange: function (e) {
      LoanActions.update(this.props.loan.id, this.props.prop, e.target.value);
  },
  render: function() {
      // option disabled check
      // error state check
    var loan = this.props.loan;
    var prop = this.props.prop;
    var val = loan[prop];
    var isArm = loan['is-arm'];
    var classStr = 'select-content';
    if (loan['term-error']) {
        classStr += ' highlight-dropdown';
    }
    return (
        <div className={classStr}>
          <select 
              ref="select"
              name={prop}
              value={val}
              onChange={this.handleChange}>
              
              <option value="30">30 years</option>
              <option value="15" disabled={isArm}>15 years</option>
          </select>
        </div>
    );
  }
});

module.exports = LoanTermInput;