var React = require('react');
//var CFButton = require('cf-button');

var ScenarioButton = React.createClass({
    render: function () {
        var className = 'scenario-picker-button';
        if (!this.props.scenario) {
            className += ' u-hide-on-mobile';
        }
        return (
            
            <button config="primary" onClick={this.props.handleChange} className={className} disabled={!this.props.scenario}>{this.props.title}</button>
        )
    }
})

module.exports = ScenarioButton;