var React = require('react');
var LoanActions = require('../actions/loan-actions');

var InterestRateInput = React.createClass({
  handleChange: function (e) {
      LoanActions.update(this.props.loan.id, this.props.prop, e.target.value);
  },
  render: function() {
    return (
        <div className="interest-rate-container">
            <div className="select-content interest-rate-content">
                <select name="interest-rate-select" className="recalc" onChange={this.handleChange}>
                </select>
            </div>
            <button className="btn btn__primary interest-rate-update">
                Update rates and costs
            </button>
            <div className="btn btn__disabled interest-rate-loading"></div>
        </div>
    );
  }
});

module.exports = InterestRateInput;