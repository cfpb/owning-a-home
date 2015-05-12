var React = require('react');
var formatUSD = require('format-usd');
var positive = require('stay-positive');

function formatOutput(prop, val) {
    if (prop === 'loan-amount') {
        val = formatUSD(positive(val), {decimalPlaces:0})
    } else if (prop !== 'loan-summary' && prop !== 'loan-term') {
        val = formatUSD(val, {decimalPlaces:0});
    }
    return val;
}

var LoanOutput = React.createClass({
  render: function() {
     var prop = this.props.prop;
    return (
        <span>{formatOutput(prop, this.props.loan[prop])}</span>
    );
  }
});

module.exports = LoanOutput;