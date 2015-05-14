var React = require('react');
var LoanActions = require('../actions/loan-actions');
var LoanSelect = require('./loan-input-select');

var InterestRateInput = React.createClass({
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
                <LoanSelect prop='interest-rate' loan={this.props.loan} opts={this.props.opts}/>
                <button className='btn btn__primary interest-rate-update' onClick={this.fetchRates}>
                    Update rates and costs
                </button>
                <div className='btn btn__disabled interest-rate-loading'></div>
            </div>
        );
    }
});

module.exports = InterestRateInput;