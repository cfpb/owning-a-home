var React = require('react');
var SelectInput = require('./styled-select');
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
            <div id="scenarios" className="block block__border-top block__padded-top">
                <div className="content-l">
                    <div className="content-l_col content-l_col-1">
                        <h3 className="u-mb0">{"Let's get started"}</h3>
                    </div>
                    <div className="content-l_col content-l_col-3-8">
                        <h3 className="h4">Explore your total loan costs using our prepopulated scenarios.</h3>                
                        <div className='select-content'>
                                
                        <SelectInput val={(scenario || {}).val}
                                     options={common.scenarios}
                                     handleChange={this.changeScenario}
                                     title='Select a scenario'/>
                        </div>
                    </div>
                    <div className="content-l_col scenario-alternates">
                        OR
                    </div>
                    <div className="content-l_col content-l_col-3-8">
                        <h3 className="h4">Compare the costs of different loan options with your own information.</h3>
                        <ScenarioButton title="Enter your own information" reset='true'/>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = ScenarioSection;