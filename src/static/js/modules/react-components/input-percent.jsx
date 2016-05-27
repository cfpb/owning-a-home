var React = require('react');
var NumericInput = require('./numeric-input.jsx');

/**
* InputPercentage.
* Returns NumericInput, passing it a formatter that
* adds a percentage sign to the end of content.
*
*/

var InputPercentage = React.createClass({
  propTypes: {
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
    return (parseFloat(val) || 0).toFixed(decimalPlaces) + '%'
  },

  render: function () {
    return (
      <NumericInput {...this.props} blurFormat={this.format} />
    );
  }
});

module.exports = InputPercentage;