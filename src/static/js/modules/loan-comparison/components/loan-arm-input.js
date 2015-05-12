var React = require('react');
var LoanActions = require('../actions/loan-actions');

var LoanArmInput = React.createClass({
  handleChange: function (e) {
      LoanActions.update(this.props.loan.id, this.props.prop, e.target.value);
  },
  render: function() {
    var prop = this.props.prop;
    var val = this.props.loan[prop];
    var classStr = 'select-content';
    if (!this.props.loan['is-arm']) {
        classStr += ' hidden';
    }
    return (
        <div className={classStr}>
          <select 
              ref="select"
              name={prop}
              value={val}
              onChange={this.handleChange}>
                <option value="3-1">3/1</option>
                <option value="5-1">5/1</option>
                <option value="7-1">7/1</option>
                <option value="10-1">10/1</option>
          </select>
        </div>
    );
  }
});

module.exports = LoanArmInput;