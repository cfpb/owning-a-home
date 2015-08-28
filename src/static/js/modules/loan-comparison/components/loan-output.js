var React = require('react');
var formatUSD = require('format-usd');
var positive = require('stay-positive');

var LoanOutput = React.createClass({
    formatOutput: function (prop, val) {
        if (prop === 'loan-amount') {
            val = formatUSD(positive(val), {decimalPlaces:0})
        } else if (prop !== 'loan-summary' && prop !== 'loan-term') {
            val = formatUSD(val, {decimalPlaces:0});
        }
        return val;
    },
    render: function() {
        var prop = this.props.prop;
        return (
            <span>{this.formatOutput(prop, this.props.loan[prop])}</span>
        );
    }
});

module.exports = LoanOutput;