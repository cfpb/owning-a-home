var React = require('react');
var ScenarioPicker = require('./scenario-picker');

var ScenarioSection = React.createClass({
    render: function () {
        var scenario = this.props.scenario;
        return (
            <div id="scenario-section">
                <div className="content-l">
                    <div className="content-l_col content-l_col-3-4">
                        <h1>{"Explore how loan options affect costs"}</h1>
                        <div className="content-l">
                            <ScenarioPicker scenario={this.props.scenario}/>
                        </div>
                    </div>
                    <div className="content-l_col content-l_col-1-4">
                        <img className="lc-ill" src="../static/img/ill-loan-comparison.png" alt="" />
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = ScenarioSection;