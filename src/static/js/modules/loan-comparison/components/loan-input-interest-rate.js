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
        } else if (this.props.loan['edited']) {
            className += ' update';
        }
        return className;
    },
    render: function() {
        return (
            <div className={this.setClass()}>
                <StyledSelect value={this.props.loan[this.props.prop]} 
                              items={this.props.items}
                              onChange={this.props.onChange}/>
                <button className='btn btn__primary interest-rate-update' onClick={this.fetchRates}>
                    Update rates and costs
                </button>
                <div className='btn btn__disabled interest-rate-loading'></div>
            </div>
        );
    }
});

module.exports = InterestRateInput;