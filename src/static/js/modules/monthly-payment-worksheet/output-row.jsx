var React = require('react');
var WorksheetOutput = require('../monthly-payment-worksheet/worksheet-output.jsx');

var MPWOutputRow = React.createClass({
  shouldComponentUpdate: function (nextProps, nextState) {
    return this.props.value !== nextProps.value;
  },
  render: function () {
    var noteHTML;
    var {rowClass, prefix, title, value, note, labelClass, outputClass, ...other} = this.props;
    var className = "content-l output-row ";
    rowClass && (className += rowClass);    
    if (note) {
      noteHTML = <em dangerouslySetInnerHTML={{__html:note}}></em>;
      className += ' annotated-row';
    }
    return (
      <div className={className}>
        <div className="label-col">
          <div className="label">
            <p className={labelClass}>{title}</p>
            {noteHTML}
          </div>
        </div>
        <div className="input-col">
          <span>
            {prefix} <WorksheetOutput value={value} className={outputClass} {...other}/>
          </span>
        </div>
      </div>
    )
  }
});

module.exports = MPWOutputRow;

