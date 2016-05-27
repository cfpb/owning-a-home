var React = require('react');
var OutputUSD = require('./../react-components/output-usd.jsx');

/**
* WorksheetOutput.
* Displays the value with appropriate format,
* or a placeholder ('--').
*
* Props other than 'val' that are passed in 
* will be passed through to element rendered by component.
*
*/
var WorksheetOutput = React.createClass({
  propTypes: {
    value: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    type: React.PropTypes.string
  },
  
  getDefaultProps: function () {
    return {
      type: 'usd'
    }
  },
  
  shouldComponentUpdate: function (nextProps, nextState) {
    return this.props.value !== nextProps.value;
  },

  render: function() {
    var {value, placeholder, ...other} = this.props;
    if (!value && this.props.hasOwnProperty('placeholder')) {
      return (<span {...other}>{placeholder}</span>);
    } else if (this.props.type === 'usd') {
      return (<OutputUSD value={value} {...other}/>);
    } else if (this.props.type === 'percent') {
      return (<span {...other}>{this.props.value + '%'}</span>);
    }  
  }
});

module.exports = WorksheetOutput;