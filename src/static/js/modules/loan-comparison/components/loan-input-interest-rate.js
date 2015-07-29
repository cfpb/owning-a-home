var React = require('react');
var LoanActions = require('../actions/loan-actions');
var StyledSelect = require('./styled-select');

var InterestRateInput = React.createClass({
    disableRates: function (option) {
        //return (this.props.scenario && this.props.loan['interest-rate'] != option.val);
        //disabledItemCheck={this.disableRates}
    },
    fetchRates: function () {
        LoanActions.fetchRates(this.props.loan.id);
    },
    setClass: function () {
        var className = 'interest-rate-container';
        if (this.props.loan['rate-request']) {
            className += ' updating';
        }
        return className;
    },
    render: function() {
        return (
            <div className={this.setClass()}>
                <StyledSelect value={this.props.loan[this.props.prop]} 
                              items={this.props.items}
                              onChange={this.props.onChange}/>
                <div className='btn btn__disabled interest-rate-loading'></div>
            </div>
        );
    }
});

module.exports = InterestRateInput;