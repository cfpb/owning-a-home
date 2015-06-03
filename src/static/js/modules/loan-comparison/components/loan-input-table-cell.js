var $ = jQuery = require('jquery');
var React = require('react');
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

function armErrorClassCheck (loan, prop) {
    return loan.errors[prop] ? 'highlight-dropdown' : '';
}

function armDisabledItemCheck (loan, prop, option) {
    var disallowedOptions = common.armDisallowedOptions[prop];
    return (loan['is-arm'] && $.inArray(option.val, disallowedOptions) >= 0);
}

var classNames = {
    'arm-type': function (loan, prop) {
        return (loan['is-arm'] ? '' : 'hidden');
    },
    'loan-term': armErrorClassCheck,
    'loan-type': armErrorClassCheck
}

var disabledItemChecks = {
    'loan-term': armDisabledItemCheck,
    'loan-type': armDisabledItemCheck
}

var LoanInputTableCell = React.createClass({
    
    handleChange: function (changeVal) {
        // we expect either a change event with a target.value,
        // or the value itself, returned from a debounced function
        var val;
        if (changeVal && typeof changeVal === 'object') {
            val = changeVal.target.value;
        } else {
            val = changeVal;
        }
        LoanActions.update(this.props.loan.id, this.props.prop, val);
    },
    
    generateComponentProps: function () {
        var prop = this.props.prop;
        var loan = this.props.loan;
        var scenario = this.props.scenario;
        var rowType = this.props.rowType;
        var props;
        
        // base props differ dep. on type of component
        if ($.inArray(prop, ['loan-amount', 'loan-summary', 'downpayment', 'interest-rate']) >= 0) {
            // custom components & outputs need the loan, prop, & scenario data
            props = {loan: loan, prop: prop, scenario: scenario};
        } else {
            // input components need the value of this loan's prop
            props = {value: loan[prop]};
        }
        
        // common props
        props.id = 'inputs-' + prop + '-' + loan.id;
        props.onChange = this.handleChange;
        
        // optional props: 
        // pass in options, className, & disabledItemCheck function, if they exist.                                      
        var items = common.options[prop];
        if (items) {
            props.items = typeof items === 'string' ? loan[items] : items;
        }
        var disabledItemCheck = disabledItemChecks[prop];
        if (disabledItemCheck) {
            props.disabledItemCheck = disabledItemCheck.bind(this, loan, prop);
        }
        var className = classNames[prop];
        if (className) {
            props.className = typeof className === 'function' ? className(loan, prop) : className;
        }
        
        // scenario-based props: 
        // if this prop is linked, the second loan's inputs will be disabled
        if (rowType === 'linked' && loan.id > 0) {
            props.disabled = true;
        }
        
        // points radio group props
        // TODO: improve this
        if (prop == 'points') {
            props.childClassName = 'inline-radio lc-radio';
            props.className = 'radio-fieldset input-content';
        }
        
        return props;
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
