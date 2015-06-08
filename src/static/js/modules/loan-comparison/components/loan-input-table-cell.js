var $ = jQuery = require('jquery');
var React = require('react');
var assign = require('object-assign');

var common = require('../common');
var LoanActions = require('../actions/loan-actions');

var StyledSelect = require('./styled-select');
var StyledTextInput = require('./styled-text-input');
var RadioInput = require('./input-radio-group');
var DownpaymentInput = require('./loan-input-downpayment');
var InterestRateInput = require('./loan-input-interest-rate');
var Output = require('./loan-output');

var components = {
    'price': StyledTextInput,
    'points': RadioInput,
    'downpayment': DownpaymentInput,
    'interest-rate': InterestRateInput,
    'loan-amount': Output,
    'loan-summary': Output
};

// props for a specific loan property's component
var customProps = {
    'arm-type': function (loan) {
        return {className: loan['is-arm'] ? '' : 'hidden'}
    },
    'downpayment': function (loan) {
        return {onChange: handleChange.bind(null, loan.id)}
    },
    'loan-term': function (loan) {
        return {
            disabledItemCheck: armDisabledItemCheck.bind(null, loan, 'loan-term'),
            className: loan.errors['loan-term'] ? 'highlight-dropdown' : ''
        }
    },
    'loan-type': function (loan) {
        return {
            disabledItemCheck: armDisabledItemCheck.bind(null, loan, 'loan-type'),
            className: loan.errors['loan-type'] ? 'highlight-dropdown' : ''
        }
    },
    'points': {
        childClassName: 'inline-radio lc-radio',
        className: 'radio-fieldset input-content'
    }
}

// Checks to see if a loan type or term select option should be disabled
// because the loan is adjustable & the option is disallowed
function armDisabledItemCheck (loan, prop, option) {
    var disallowedOptions = common.armDisallowedOptions[prop];
    return (loan['is-arm'] && $.inArray(option.val, disallowedOptions) >= 0);
}

// Sends loan update action when a loan prop changes
function handleChange (loanId, prop, changeVal) {
    // we expect either a change event with a target.value,
    // or the value itself, returned from a debounced function
    var val;
    if (changeVal && typeof changeVal === 'object') {
        val = changeVal.target.value;
    } else {
        val = changeVal;
    }
    LoanActions.update(loanId, prop, val);
}


var LoanInputTableCell = React.createClass({    
    coreProps: function (loan, prop) {
        // core props differ dep. on whether component is a simple input,
        // which just needs a value, or an output/custom component,
        // which needs the loan/prop/scenario
        var outputOrCustomComponents = ['downpayment', 'interest-rate', 'loan-amount', 'loan-summary'];
        var props = $.inArray(prop, outputOrCustomComponents) !== -1 
                    ? {loan: loan, prop: prop, scenario: this.props.scenario}
                    : {value: loan[prop]};
        return props;
    },
    optionProps: function (loan, prop) {
        // adds options arrays to dropdowns & radio groups
        var items = common.options[prop];
        if (items) {
            // options might be a static array stored in common, 
            // or a dynamic array stored on the loan
            return {items: typeof items === 'string' ? loan[items] : items};
        }
    },
    customProps: function (loan, prop) {
        // custom props for a particular component
        var custom = customProps[prop];
        if (custom) {
            return typeof custom === 'function' ? custom(loan) : custom;
        }
    },
    generateComponentProps: function () {
        var prop = this.props.prop;
        var loan = this.props.loan;
        
        // base component props for all components
        var componentProps = {
            id: 'inputs-' + prop + '-' + loan.id,
            onChange: handleChange.bind(null, loan.id, prop),
            disabled: this.props.rowType === 'linked' && loan.id > 0
        };
        
        // configure additional props
        assign(componentProps, this.coreProps(loan, prop), this.optionProps(loan, prop), this.customProps(loan, prop));
    
        return componentProps;
    },
    
    render: function () {
        var Component = components[this.props.prop] || StyledSelect;        
        var props = this.generateComponentProps();
        
        return (
            <td className={'input-' + this.props.loan.id}>
                <Component {...props}/>
            </td>
        );
    }
});

module.exports = LoanInputTableCell;
