var React = require('react');
var ScenarioActions = require('../actions/scenario-actions');

var ScenarioButton = React.createClass({
    handleChange: function (e) {
        ScenarioActions.custom();
    },
    render: function () {
        return (
              <a className="btn btn-primary" onClick={this.handleChange}>Enter your own information</a>
        )
    }
})

module.exports = ScenarioButton;