var React = require('react');
var ErrorMessage = require('./error-message');
var TextInput = require('./input-text');
var assign = require('object-assign');
var mortgageCalculations = require('../mortgage-calculations');

var LoanDownpaymentInput = React.createClass({
    getInitialState: function () {
        return this.getDownpaymentState(this.props.loan);
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState(this.getDownpaymentState(nextProps.loan));
    },
    getDownpaymentState: function (loan) {
        return {
            'downpayment': loan['downpayment'],
            'downpayment-percent': mortgageCalculations['downpayment-percent'](loan)
        };
    },
    updateDownpayment: function (percent) {
        this.setState({
            'downpayment-percent': percent,
            'downpayment': mortgageCalculations['downpayment'](assign({}, this.props.loan, {'downpayment-percent': percent}))
        });
        this.props.handleChange(this.state.downpayment);
    },
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
                    val={this.state['downpayment-percent']}
                    className='small-input percent-input' 
                    maxLength='2' 
                    placeholder='10' 
                    handleChange={this.updateDownpayment}/>
                <TextInput 
                    val={this.state['downpayment']}
                    className='mid-input dollar-input' 
                    placeholder='20,000' 
                    handleChange={this.props.handleChange}/>
                <ErrorMessage opts={{showMessage: this.showError}}/>
            </div>
        );
    }
});

module.exports = LoanDownpaymentInput;