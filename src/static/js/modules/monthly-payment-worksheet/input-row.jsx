var React = require('react');
var InputUSD = require('../react-components/input-usd.jsx');
var InputPercentage = require('../react-components/input-percent.jsx');

var MPWInputRow = React.createClass({
  shouldComponentUpdate: function (nextProps, nextState) {
    return this.props.value !== nextProps.value;
  },
  render: function () {
    var noteHTML;
    var {id, title, type, value, note, cb, ...other} = this.props;
    var Component = type == 'percent' ? InputPercentage : InputUSD;
    var className = "content-l input-row";
    if (note) {
      noteHTML = <em dangerouslySetInnerHTML={{__html:note}}></em>;
      className += ' annotated-row';
    }
    
    return (
      <div className={className}>
        <div className="label-col">
          <label htmlFor={id}>
            <h4>{title}</h4>
            {noteHTML}
          </label>
        </div>
        <div className="input-col">
          <Component id={id} value={value} onChange={cb.bind(null, id)} {...other}/>
        </div>
      </div>
    )
  }
});

module.exports = MPWInputRow;