var React = require('react');

var nonNumericRegex = /[^0-9.]+/g;
var allowedKeys = [ 8, 9, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 
96, 97, 98, 99, 100, 101, 102, 103, 104, 105,  190 ];

/**
* FormattedNumericInput.
* Formats the contents of an input when it is not focused,
* and removes the formatting while it is being edited.
* Also enforces numeric values, preventing non-numeric content
* from being entered and screening out non-numeric characters
* from passed in values.
*
*/

var FormattedNumericInput = React.createClass({
  propTypes: {
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    formatter: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func
    ])
  },

  getInitialState: function () {
    return {
      value: this.getDisplayValue(this.props.value)
    };
  },

  format: function (val) {
    return typeof this.props.formatter === 'function'
           ? this.props.formatter(val) 
           : val;
  },

  strip: function (val) {
    val = (!val && val !== 0) ? '' : val;
    return val.toString().replace(nonNumericRegex, '');
  },

  getDisplayValue: function (val) {
    return this.format(this.strip(val));
  },

  blur: function () {
    this.setState({value: this.getDisplayValue(this.props.value)});
    typeof this.props.onBlur == 'function' && this.props.onBlur(val);
  },

  change: function (e) {
    var val = e.target.value;
    var state = this.state;
    state.value = val;
    this.setState(state);
    typeof this.props.onChange == 'function' && this.props.onChange(this.strip(val));
  },

  focus: function () {
    this.setState({focused: true, value: this.strip(this.state.value)});
    typeof this.props.onFocus == 'function' && this.props.onFocus(val);
  },

  keypress: function (e) {
    var pressedKey = e.which;
    if (allowedKeys.indexOf(pressedKey) === -1 || (e.shiftKey && pressedKey !== 9)) {
      e.preventDefault();
    }
    typeof this.props.onKeyDown == 'function' && this.props.onKeyDown(val);
  },

  componentWillReceiveProps: function (props) {
    // don't update the value while it is being edited
    // TODO:  may need to reconsider this if validation is taking place
    // outside the component on change events
    // could update here under those circumanstances if the value has changed
    if (!this.state.focused && props.hasOwnProperty('value')) {
      this.setState({value: this.getDisplayValue(props.value)});
    }
  },

  render: function () {
    var {value, onChange, onBlur, onFocus, onKeyDown, ...other} = this.props;
    return (
      <input type="text" value={this.state.value} onBlur={this.blur} onFocus={this.focus} onKeyDown={this.keypress} onChange={this.change} {...other} />
    );
  }
});

module.exports = FormattedNumericInput;