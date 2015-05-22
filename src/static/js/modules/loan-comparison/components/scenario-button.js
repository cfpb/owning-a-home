var React = require('react');

var ScenarioButton = React.createClass({
    render: function () {
        return (
            <a className="btn btn-primary scenario-picker-button" onClick={this.props.handleChange}>
               {this.props.title}
            </a>
        )
    }
})

module.exports = ScenarioButton;