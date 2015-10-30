var React = require('react');
var formatUSD = require('format-usd');
var positive = require('stay-positive');

/**
* OutputUSD.
* Takes a value and an optional decimalPlaces parameter,
* and outputs a span containing the value formatted as usd.
*
*/
var OutputUSD = React.createClass({

  propTypes: {
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    decimalPlaces: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      decimalPlaces: 0
    };
  },

  format: function (val) {
    // $0 doesn't need decimals
    var decimalPlaces = (val == 0 || isNaN(val)) ? 0 : this.props.decimalPlaces;
    val = formatUSD(val || 0, {decimalPlaces: decimalPlaces});
    return val;
  },

  render: function() {
    var {value, ...other} = this.props;
    return (
      <span {...other}>{this.format(value)}</span>
    );
  }
});

module.exports = OutputUSD;