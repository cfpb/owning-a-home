var React = require('react');
var formatUSD = require('format-usd');
var positive = require('stay-positive');
var FormattedNumericInput = require('./formatted-numeric-input.jsx');


/**
* InputUSD.
* Returns FormattedNumericInput, passing it a usd formatter.
*
*/
var InputUSD = React.createClass({
  propTypes: {
    decimalPlaces: React.PropTypes.number,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])
  },

  getDefaultProps: function() {
    return {
      decimalPlaces: 0
    };
  },

  format: function (val) {
    // $0 doesn't need decimals
    var decimalPlaces = (val == 0 || isNaN(val)) ? 0 : this.props.decimalPlaces;
    return formatUSD(positive(val), {decimalPlaces: decimalPlaces});
  },

  render: function () {
    return (
      <FormattedNumericInput {...this.props} formatter={this.format} />
    );
  }
});

module.exports = InputUSD;