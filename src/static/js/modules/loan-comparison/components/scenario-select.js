var React = require('react');
var ScenarioActions = require('../actions/scenario-actions');
var common = require('../common');

var ScenarioSelect = React.createClass({
    handleChange: function (e) {
        ScenarioActions.update(e.target.value);
    },
    generateOptions: function () {
        var scenarioItems = common.scenarios.map(function (opt) {
            return (
                <option value={opt.val}>{opt.label}</option>
            );
        });
        scenarioItems.unshift(<option disabled selected={this.props.scenario ? false : true}>{'Select a scenario'}</option>);
        return scenarioItems;
    },
    render: function () {
        var currentScenario = (this.props.scenario || {}).val;
        return (
              <div className="select-content">
                <select 
                    name="input-scenario"
                    className="recalc" 
                    id="input-scenario"
                    value={currentScenario}
                    onChange={this.handleChange}>
                  {this.generateOptions()}
                </select>
              </div>
        )
    }
})

module.exports = ScenarioSelect;