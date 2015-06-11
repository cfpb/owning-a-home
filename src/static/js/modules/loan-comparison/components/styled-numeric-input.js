var React = require('react');
var common = require('../common');
var TextInput = require('./input-text');
var nonNumericRegex = /[^0-9.]+/g;

// Enforce numeric input
var numericValidator = function (val) {
    return val.replace(nonNumericRegex, '');
}

// optionally adds a unit (dollar or percent sign) to input
// when className 'dollar-input' or 'percent-input' passed in
var StyledNumericInput = React.createClass({
    render: function() {
        // pass through everything but className
        var props = common.omit(this.props, 'className');
        props.validator = numericValidator;
        return (
            <div className={this.props.className}>
                <span className="unit"></span>
                <TextInput {...props}/>
            </div>
        );
    }
});

module.exports = StyledNumericInput;