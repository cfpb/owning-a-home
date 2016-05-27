var React = require('react');
var formatUSD = require('format-usd');
var positive = require('stay-positive');
var NumericInput = require('./numeric-input.jsx');


/**
* InputUSD.
* Returns NumericInput, passing it a usd formatter.
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
      decimalPlaces: 2
    };
  },

  format: function (val) {
    // $0 doesn't need decimals; don't force decimals where there are none
    var decimalPlaces = val && val.toString().indexOf(".") !== -1 ? this.props.decimalPlaces : 0;
    return formatUSD(positive(val) || 0, {decimalPlaces: decimalPlaces});
  },

  render: function () {
    return (
      <NumericInput {...this.props} blurFormat={this.format} />
    );
  }
});

module.exports = InputUSD;