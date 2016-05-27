var React = require('react');
var $ = require('jquery');
var OutputUSD = require('./../react-components/output-usd.jsx');


/**
* Range input.
*/

// TODO: add options for min != 0

var RangeInput = React.createClass({
  propTypes: {
    
  },
  
  getDefaultProps: function () {
    return {
      max: 0,
      min: 0,
      step: 1,
      showValueLabel: true
    }
  },

  getInitialState: function () {
    return {
      value: this.props.value
    }
  },
  
  shouldComponentUpdate: function (nextProps, nextState) {
    return this.props.value != nextProps.value || this.props.max != nextProps.max || this.state.left != nextState.left;
  },
  
  componentDidMount: function () {
    if (this.props.showValueLabel) {
      console.log('yes!')
      this.repositionValueLabel();

      if (window.attachEvent) {
        window.attachEvent('onresize', this.repositionValueLabel);
      }
      else if (window.addEventListener) {
        window.addEventListener('resize', this.repositionValueLabel);
      }
    }
  },
  
  componentWillReceiveProps: function (props) {
    if (props.value != this.props.value) {
      this.updateValue(props.value, props.max)
    } else if (this.props.max != props.max) {
      this.setState({left: this.calculateValueLabelOffset(this.state.value, props.max)});
    }
  },
  
  change: function (e) {
    this.updateValue(e.target.value, this.props.max, true); 
  },
  
  calculateValueLabelOffset: function (val, max) {
    var containerWidth = this.refs['container'].offsetWidth;
    var labelWidth = this.refs['currentValue'].offsetWidth;
    if (max == 0) {
      return 0;
    }
    return (val / max) * (containerWidth - labelWidth);
  },
  
  updateValue: function (val, max, propagateChange) {
    var component = this;
    var newState = {value: val};
    if (this.props.showValueLabel) {
      newState.left = this.calculateValueLabelOffset(val, max);
    }
    this.setState(newState, function () {
      if (propagateChange && typeof component.props.onChange == 'function') {
        component.props.onChange(val)
      }
    });
  },
  
  repositionValueLabel: function () {
    this.setState({left: this.calculateValueLabelOffset(this.state.value, this.props.max)});
  },
  
  render: function () {
    var {value, onChange, max, min, ...other} = this.props;
    var valueLabel;
    var labelStyle = {position: 'absolute', left: this.state.left + 'px', paddingTop: '5px'}
    if (this.props.showValueLabel) {
      valueLabel = (
        <div style={labelStyle} ref="currentValue" className="currentValue">
         <OutputUSD value={this.state.value} className="medium-text"/>
        </div>
      );
    }
    return (
      <div className="inputContainer" ref="container" style={{position: 'relative', marginBottom: '30px'}}>
        <input
          type="range"
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          value={this.state.value}
          onChange={this.change}
          {...other}
          />
          {valueLabel}
      </div>
    );
  }
});

module.exports = RangeInput;