var React = require('react');
var calc = require('./../monthly-payment-calc');
var OutputUSD = require('./../react-components/output-usd.jsx');

/**
* WorksheetOutput.
* Using prop name as key, gets a value from worksheet data 
* OR runs a calculation (TODO: move calculations out),
* then displays the value with appropriate format.
*
* Props other than 'prop' and 'data' that are passed in 
* will be passed through to element rendered by component.
*
*/
var WorksheetOutput = React.createClass({
  propTypes: {
    prop: React.PropTypes.string,
    data: React.PropTypes.object
  },

  render: function() {
    var {data, prop, ...other} = this.props;
    var val, element;
    if (data.hasOwnProperty(prop)) {
      val = data[prop];
    } else if (typeof calc[prop] === 'function') {
      val = calc[prop](data);
    }

    if (prop === 'percentageIncomeAvailable') {
      element = (<span {...other}>{val || 0}%</span>)
    } else {
      element = (<OutputUSD value={val} {...other}/>)
    }

    return element;
  }
});

module.exports = WorksheetOutput;