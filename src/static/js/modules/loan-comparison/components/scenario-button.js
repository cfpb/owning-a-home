var React = require('react');
var CFButton = require('CFButton');
var ScenarioActions = require('../actions/scenario-actions');

var ScenarioButton = React.createClass({
    handleChange: function (e) {
        ScenarioActions.custom(this.props.reset);
    },
    render: function () {
        return (
            <a className="btn btn-primary" 
             onClick={this.handleChange}>
                {this.props.title}
            </a>
        )
    }
})

module.exports = ScenarioButton;