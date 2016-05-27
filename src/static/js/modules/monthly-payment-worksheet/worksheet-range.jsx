var React = require('react');
var InputRange = require('./../react-components/input-range.jsx');
var OutputUSD = require('./../react-components/output-usd.jsx');

/**
* WorksheetRange.
*
* Props other than 'prop' and 'data' that are passed in 
* will be passed through to element rendered by component.
*
*/
var WorksheetRange = React.createClass({
  
  render: function() {
    var {max, val, ...other} = this.props;
    
    return (
      <div>
        <div style={{float: "right"}}><OutputUSD value={this.props.max}/></div>
        <div><OutputUSD value="0"/></div>
        <InputRange value={this.props.val} max={this.props.max}{...other}/>
      </div>
    );
  }
});

module.exports = WorksheetRange;