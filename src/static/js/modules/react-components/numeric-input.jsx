var React = require('react');
var Input = require('./input.jsx');

var numRegex = /[^0-9.,]+/g; // allow commas
var numRegexStrict = /[^0-9.]+/g; // no commas

/**
* NumericInput.
* Enforces numeric values, screening out non-numeric characters.
* Defaults to text input that displays numbers as strings with commas.
*
* TODO: at the moment, only allows positive numbers in text input. 
* Add option for handling negative numbers.
*/

var NumericInput = React.createClass({
  propTypes: {
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])
  },

  getInitialState: function () {
    return {
      value: this.focus(this.strip(this.props.value))
    };
  },
  
  getDefaultProps: function() {
    return {
      numeric: false, 
      localeString: 'en'
    };
  },

  strip: function (val, strict) {
    // if val exists & is not a number, replace all non-numeric characters
    if (val) {
      if (isNaN(val)) {
        val = val.toString().replace(strict ? numRegexStrict : numRegex, '');
      }
    }
    return val;
  },

  change: function (val) {
    var numericVal = this.strip(val); 
    this.setState({value: numericVal});
    typeof this.props.onChange == 'function' && this.props.onChange(numericVal);
  },
  
  focus: function (val) {
    if (!this.props.numeric) {
      // enforce numeric
      val = this.strip(val, true);
      
      // remove zeroes for easier editing
      if (!val) {
        return '';
      }
      
      // enforce decimal places according to decimalPlaces param
      if (this.props.hasOwnProperty('decimalPlaces')) {
        val = this.props.decimalPlaces ? parseFloat(val) : parseInt(val, 10);

        if (this.props.decimalPlaces && val % 1 != 0) {
          val = val.toFixed(this.props.decimalPlaces);
        }
      }

      // format according to localeString param
      if (!this.props.numeric) {
        val = Number(val).toLocaleString(this.props.localeString);
      }
    }
   
    return val;
  },

  componentWillReceiveProps: function (props) {
    // update state if, after numeric enforcement, new value !== current value
    var processedVal =  this.strip(props.value);
    if (processedVal !== this.state.value) {
      this.setState({value: processedVal});
    }
  },

  render: function () {
    var {value, onChange, onBlur, onFocus, inputType, ...other} = this.props;
    return (
      <Input value={this.state.value} onChange={this.change} focusFormat={this.focus} {...other} />
    );
  }
});

module.exports = NumericInput;