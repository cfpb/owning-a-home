var React = require('react');
var CFButton = require('cf-button');

var ScenarioButton = React.createClass({
    render: function () {
        return (
            <CFButton config="primary" onClick={this.props.handleChange} className="scenario-picker-button">{this.props.title}</CFButton>
        )
    }
})

module.exports = ScenarioButton;