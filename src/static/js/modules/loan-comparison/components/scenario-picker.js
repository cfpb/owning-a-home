var React = require('react');
var StyledSelect = require('./styled-select');
var ScenarioButton = require('./scenario-button');
var common = require('../common');
var ScenarioActions = require('../actions/scenario-actions');
var $ = jQuery = require('jquery');

var ScenarioPicker = React.createClass({
    changeScenario: function (event) {
        var val = event ? event.target.value : null;
        if (val != this.props.scenario) {
            ScenarioActions.update(val);
        }
        if (this.props.scrollTo) {
            $('html,body').animate({
                    scrollTop: $("#"+ this.props.scrollTo).offset().top},
                    'slow');
        }
    },
    render: function () {
        var scenario = this.props.scenario;
        return (
            <div>
                <div className="content-l_col scenario-block">
                    <h4>Use our preset scenarios</h4>
                    <label forHtml="scenario-picker-select" className="scenario-picker-label">
                        Explore how <span className="u-visually-hidden">a scenario will affect your loan costs.</span>
                    </label>   
                    <StyledSelect value={(scenario || {}).val}
                                  items={common.scenarios}
                                  onChange={this.changeScenario}
                                  title='Select a scenario'
                                  id="scenario-picker-select"
                                  className="scenario-picker-select"/>
                    <div className="short-desc" aria-hidden={true}>will affect your loan costs.</div>
                </div>
                <div className="content-l_col scenario-alternates">
                    OR
                </div>
                <div className="content-l_col scenario-block">
                    <h4 className="h4">Design your own scenarios</h4>
                    <p className="short-desc">Adjust the factors that affect loan costs to compare two options of your choosing.</p>
                    <ScenarioButton title="Design my own scenario" scenario={this.props.scenario} handleChange={this.changeScenario}/>
                </div>
            </div>
        )
    }
});

module.exports = ScenarioPicker;