var $ = jQuery = require('jquery');
var React = require('react');
var assign = require('object-assign');

var common = require('../common');
var LoanActions = require('../actions/loan-actions');

var StyledSelect = require('./styled-select');
var StyledNumericInput = require('./styled-numeric-input');
var RadioInput = require('./input-radio-group');
var DownpaymentInput = require('./loan-input-downpayment');
var InterestRateInput = require('./loan-input-interest-rate');
var Output = require('./loan-output');

var Message = require('./message');

var components = {
    'price': StyledNumericInput,
    'points': RadioInput,
    'downpayment': DownpaymentInput,
    'interest-rate': InterestRateInput,
    'loan-amount': Output,
    'loan-summary': Output
};

// Checks for error messages that should be displayed
// in a specific loan property's table cell.
var errorMessages = {
    'county': function (loan) {
        return loan.errors['county'];
    },
    'downpayment': function (loan) {
        return loan.errors['downpayment'];
    },
    'loan-summary': function (loan) {
        return loan.errors['loan-term'] || loan.errors['loan-type'];
    }
}

// props for a specific loan property's component
var customProps = {
    'arm-type': function (loan) {
        return {className: loan['rate-structure'] === 'arm' ? '' : 'hidden'}
    },
    'downpayment': function (loan) {
        return {onChange: handleChange.bind(null, loan.id)}
    },
    'loan-term': function (loan) {
        return {
            disabledItemCheck: armDisabledItemCheck.bind(null, loan, 'loan-term')
        }
    },
    'loan-type': function (loan) {
        // if this is a jumbo loan type, get the dropdown menu 
        // option data for this loan type
        var jumboItem = common.jumboTypes[loan['loan-type']];
        var obj = {
            disabledItemCheck: loanTypeDisabledCheck.bind(null, loan, jumboItem),
        }
        // copy loan type options & add this jumbo type to them
        if (jumboItem) {
            obj.items = common.options['loan-type'].slice(0);
            obj.items.push(jumboItem);
        }
        return obj;
    },
    'county': function (loan) {
        var obj =  {
            config: {
                labelProp: 'county',
                valProp: 'complete_fips'
                
            }
        };
        // show a title if there are counties but no county is selected
        if (loan['counties'] && !loan['county']) {
            obj.config.title = 'Select a county'
        }
        // ??? show loading only during initial request for counties on page load
        if (loan['county-request'] && !loan['need-county']) {
            obj.className = 'loading';
        }
        return obj;
    },
    'price': {className: 'dollar-input'},
    'points': {
        childClassName: 'inline-radio lc-radio',
        className: 'radio-fieldset input-content'
    }
}

// Checks to see if a loan type or term select option should be disabled
// because the loan is adjustable & the option is disallowed
function armDisabledItemCheck (loan, prop, option) {
    var disallowedOptions = common.armDisallowedOptions[prop];
    return (loan['rate-structure'] === 'arm' && $.inArray(option.val, disallowedOptions) >= 0);
}

function loanTypeDisabledCheck (loan, isJumbo, option) {
    var disabled;
    if (isJumbo) {
        disabled = $.inArray(option.val, loan['disallowed-types']) >= 0;
    } else {
        disabled = armDisabledItemCheck(loan, 'loan-type', option);
    }
    return disabled;
}

// Sends loan update action when a loan prop changes
function handleChange (loanId, prop, val) {
    // val can either be an event object
    // or the value from a debounced function.
    if (typeof val === 'object' && val) {
        val = val.target.value;
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
    
    generateComponentProps: function (loan, prop) {
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
    
    showError: function (loan, prop) {
        // Check for error messages that will be displayed in this cell.
        // This check is necessary because one prop's error message might
        // be displayed in another prop's cell -- for example, 
        // 'loan-term' & 'loan-type' errors are displayed with 'loan-summary'
        var msg = errorMessages[prop] ? errorMessages[prop](loan) : null;
        if (msg) {
           return <Message message={msg} type="error"/>; 
        }
    },
    
    render: function () {
        var prop = this.props.prop;
        var loan = this.props.loan;
        var Component = components[prop] || StyledSelect;        
        var props = this.generateComponentProps(loan, prop);
        var className = 'input-' + loan.id;
        className += loan['errors'].hasOwnProperty(prop) ? ' error' : '';
    
        return (
            <td className={className}>
                <Component {...props}/>
                {this.showError(loan, prop)}
            </td>
        );
    }
});

module.exports = LoanInputTableCell;
