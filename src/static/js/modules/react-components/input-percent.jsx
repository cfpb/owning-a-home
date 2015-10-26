var React = require('react');
var FormattedNumericInput = require('./formatted-numeric-input.jsx');

/**
* InputPercentage.
* Returns FormattedNumericInput, passing it a formatter that
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

  format: function (val) {
    return (val || 0) + '%';
  },

  render: function () {
    return (
      <FormattedNumericInput {...this.props} formatter={this.format} />
    );
  }
});

module.exports = InputPercentage;