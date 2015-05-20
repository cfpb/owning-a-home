var $ = jQuery = require('jquery');
var React = require('react');
var common = require('../common');
var LoanActions = require('../actions/loan-actions');
var utils = require('../utils');
var Tooltip = require('./tooltip');
var StyledSelect = require('./styled-select');
var Output = require('./loan-output');
var TextInput = require('./input-text');
var RadioInput = require('./input-radio');
var DownpaymentInput = require('./loan-input-downpayment');
var InterestRateInput = require('./loan-input-interest-rate');

var components = {
    'price': TextInput,
    'points': RadioInput,
    'downpayment': DownpaymentInput,
    'interest-rate': InterestRateInput,
    'loan-amount': Output,
    'loan-summary': Output
};

var classNames = {
    'arm-type': function (loan, prop) {
        return (loan['is-arm'] ? '' : 'hidden');
    },
    'loan-term': armErrorClassCheck,
    'loan-type': armErrorClassCheck
}

var disabledOptionChecks = {
    'loan-term': armDisabledOptionCheck,
    'loan-type': armDisabledOptionCheck
}

var armErrorClassCheck = function (loan, prop) {
    return loan.errors[prop] ? 'highlight-dropdown' : '';
}

var armDisabledOptionCheck = function (loan, prop, option) {
    var disallowedOptions = common.armDisallowedOptions[prop];
    return (loan['is-arm'] && $.inArray(option, disallowedOptions) >= 0);
}

var LoanInputRow = React.createClass({
    propTypes: {
        prop: React.PropTypes.string.isRequired,
        loans: React.PropTypes.array.isRequired,
        scenario: React.PropTypes.object // or null
    },
    handleChange: function (loanId, prop, eventOrVal) {
        var val;
        if (typeof eventOrVal === 'object' && eventOrVal) {
            val = eventOrVal.target.value;
        } else {
            val = eventOrVal;
        }
        LoanActions.update(loanId, prop, val);
    },
    generateCells: function () {
        var Component = components[this.props.prop] || StyledSelect;
        var prop = this.props.prop;
        
        return this.props.loans.map(function (loan) {
            // Different props for different components:
            // generic input components get the value of the specified loan prop;
            // loan outputs & loan-specific components get loan data
            var props;
            if ($.inArray(prop, ['loan-amount', 'loan-summary', 'downpayment', 'interest-rate']) >= 0) {
                props = {loan: loan, prop: prop, scenario: this.props.scenario};
            } else {
                props = {val: loan[prop]};
            }
            
            // Pass in options, className, & disabledOptionCheck function if they exist.                                      
            var options = common.options[prop];
            if (options) {
                props.options = typeof options === 'string' ? loan[options] : options;
            }
            var disabledOptionCheck = disabledOptionChecks[prop];
            if (disabledOptionCheck) {
                props.disabledOptionCheck = disabledOptionCheck.bind(this, loan, prop);
            }
            var className = classNames[prop];
            if (className) {
                props.className = className(loan, prop);
            }  
    
            return (
                <td>
                      <Component componentId={prop + '-' + loan.id} handleChange={this.handleChange.bind(this, loan.id, prop)} {...props}/>
                </td>
              );
        }, this);
        
    },
    render: function () {
        var prop = this.props.prop;
        var label = common.propLabels[prop] || utils.capitalizeFirst(prop.split('-').join(' '));
        var notes = (this.props.scenario || {}).inputNotes;
        var educationalNote = (notes  || {})[prop];
        var className = '';
        className += educationalNote ? ' highlight' : '';
        className += ($.inArray(prop, ['loan-amount', 'loan-summary', 'points']) >= 0) ? '' : ' padded-row';
        return (
            <tr className={className}>
                <td className="label-cell">
                    <span className="label-text">{label}</span>
                    <Tooltip text={common.inputTooltips[prop]}/>
                </td>
                {this.generateCells()}
            </tr>
        );
    }
});

module.exports = LoanInputRow;
