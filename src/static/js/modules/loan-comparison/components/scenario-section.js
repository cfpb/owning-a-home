var React = require('react');
var ScenarioPicker = require('./scenario-picker');

var ScenarioSection = React.createClass({
    render: function () {
        var scenario = this.props.scenario;
        return (
            <div id="scenario-section">
                <div className="content-l">
                    <div className="content-l_col content-l_col-3-4">
                        <h3 className="u-hide-on-mobile">{"Explore how loan options affect costs."}</h3>
                        <ScenarioPicker scenario={this.props.scenario}/>
                    </div>
                    <div className="content-l_col content-l_col-1-4">
                        <img src="http://placekitten.com/g/500/300" />
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = ScenarioSection;