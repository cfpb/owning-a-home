var React = require('react');
var ErrorMessage = require('./error-message');
var TextInput = require('./styled-text-input');
var assign = require('object-assign');
var mortgageCalculations = require('../mortgage-calculations');

var LoanDownpaymentInput = React.createClass({
    // TODO: move error display to table-row?
    showError: function() {
        var loan = this.props.loan;
        if (loan['downpayment-too-high']) {
            return 'downpayment-too-high';
        } else if (loan['downpayment-too-low']) {
            return 'downpayment-too-low-' + loan['loan-type'].split('-')[0];
        }
        return false;
    },
    render: function() {
        return (
            <div>
                <TextInput
                    value={this.props.loan['downpayment-percent']}
                    className='small-input percent-input' 
                    maxLength='2' 
                    placeholder='10' 
                    onChange={this.props.onChange.bind(this, 'downpayment-percent')}/>
                <TextInput 
                    value={this.props.loan['downpayment']}
                    className='mid-input dollar-input' 
                    placeholder='20,000' 
                    onChange={this.props.onChange.bind(this, 'downpayment')}/>
                <ErrorMessage opts={{showMessage: this.showError}}/>
            </div>
        );
    }
});

module.exports = LoanDownpaymentInput;