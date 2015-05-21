var React = require('react');
var StyledSelect = require('./styled-select');
var ScenarioButton = require('./scenario-button');
var common = require('../common');
var ScenarioActions = require('../actions/scenario-actions');

var ScenarioSection = React.createClass({
    changeScenario: function (event) {
        ScenarioActions.update(event.target.value);
    },
    render: function () {
        var scenario = this.props.scenario;
        return (
            <div id="scenarios">
                <div className="content-l">
                    <div className="content-l_col content-l_col-1">
                        <h3 className="u-mb0 u-hide-on-mobile">{"Let's get started."}</h3>
                    </div>
                    <div className="content-l_col content-l_col-3-8">
                        <h4>Use our preset scenarios.</h4>
                        <label forHtml="scenario-picker-select" className="scenario-picker-label">
                            Explore how <span className="u-visually-hidden">this scenario will affect your loan costs.</span>
                        </label>   
                        <StyledSelect val={(scenario || {}).val}
                                     options={common.scenarios}
                                     handleChange={this.changeScenario}
                                     title='Select a scenario'
                                     componentId="scenario-picker-select"
                                     className="scenario-picker-select"/>
                        <div className="short-desc" aria-hidden={true}>will affect your loan costs.</div>
                    </div>
                    <div className="content-l_col scenario-alternates">
                        OR
                    </div>
                    <div className="content-l_col content-l_col-3-8">
                        <h4 className="h4">Design your own scenarios.</h4>
                        <p className="short-desc">Adjust the factors that affect loan costs to compare two options of your choosing.</p>
                        <ScenarioButton title="Design my own scenario"/>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = ScenarioSection;