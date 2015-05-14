var React = require('react');
var ErrorMessage = require('./error-message');
var LoanTextInput = require('./loan-input-text');

var LoanDownpaymentInput = React.createClass({
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
                <LoanTextInput className='small-input percent-input' prop='downpayment-percent' maxLength='2' placeholder='10' loan={this.props.loan}/>
                <LoanTextInput className='mid-input dollar-input' prop='downpayment' placeholder='20,000' loan={this.props.loan}/>
                <ErrorMessage opts={{showMessage: this.showError}}/>
            </div>
        );
    }
});

module.exports = LoanDownpaymentInput;