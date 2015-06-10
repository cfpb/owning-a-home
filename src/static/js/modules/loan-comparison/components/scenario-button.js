var React = require('react');
var CFButton = require('cf-button');

var ScenarioButton = React.createClass({
    render: function () {
        var className = 'scenario-picker-button';
        if (!this.props.scenario) {
            className += ' u-hide-on-mobile';
        }
        return (
            <CFButton config="primary" onClick={this.props.handleChange} className={className} disabled={!this.props.scenario}>{this.props.title}</CFButton>
        )
    }
})

module.exports = ScenarioButton;