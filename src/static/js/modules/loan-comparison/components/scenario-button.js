var React = require('react');
var CFButton = require('cf-button');
var ScenarioActions = require('../actions/scenario-actions');

var ScenarioButton = React.createClass({
    handleChange: function (e) {
        ScenarioActions.custom(this.props.reset);
    },
    render: function () {
        return (
            <CFButton config="primary" onClick={this.handleChange}>{this.props.title}</CFButton>
        )
    }
})

module.exports = ScenarioButton;