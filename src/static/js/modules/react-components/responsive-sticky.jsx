var w, d, b;
var React = require('react');
var ReactDOM = require('react-dom');
var Sticky = require('react-sticky').Sticky;

var ResponsiveSticky = React.createClass({
  
  getInitialState: function () {
    return {
      on: false
    };
  },
  
  componentDidMount: function() {
    w = window;
    d = document.documentElement;
    b = document.getElementsByTagName('body')[0];
    this.updateSize();
    window.addEventListener('resize', this.handleResize);
  },
  
  updateSize: function () {
    var width = w.innerWidth || d.clientWidth || b.clientWidth;
    var on = width > 600;
    if (on != this.state.on) {
      this.setState({on: on});
    }
  },
  
  handleResize: function () {
    this.updateSize(); 
  },
  
  render: function() {
    return (
      <Sticky isActive={this.state.on}>{this.props.children}</Sticky>
    );
  }
  
});

module.exports = ResponsiveSticky;