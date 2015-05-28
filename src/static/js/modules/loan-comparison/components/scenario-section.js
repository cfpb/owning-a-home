var React = require('react');
var ScenarioPicker = require('./scenario-picker');

var ScenarioSection = React.createClass({
    render: function () {
        var scenario = this.props.scenario;
        return (
            <div id="scenario-section">
                <div className="content-l">
                    <div className="content-l_col content-l_col-1">
                        <h3 className="u-hide-on-mobile">{"Let's get started."}</h3>
                    </div>
                    <ScenarioPicker scenario={this.props.scenario}/>
                </div>
            </div>
        )
    }
});

module.exports = ScenarioSection;