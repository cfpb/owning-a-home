var React = require('react');
var ScenarioActions = require('../actions/scenario-actions');
var common = require('../common');

var ScenarioSelect = React.createClass({
    handleChange: function (e) {
        ScenarioActions.update(e.target.value);
    },
    render: function () {
        var scenarioItems = [];
        var scenarios = common.scenarios;
        var id = (this.props.scenario || {}).id;
        if (!id) {
            scenarioItems.push(<option disabled>{'Select a scenario'}</option>);
        }
        
        for (var key in scenarios) {
            if (scenarios.hasOwnProperty(key)) {
                var scenario = scenarios[key];
                scenarioItems.push(<option value={key}>{scenario.title}</option>);
            }
        }
        
        return (
              <div className="select-content">
                <select 
                    name="input-scenario"
                    className="recalc" 
                    id="input-scenario"
                    value={id}
                    onChange={this.handleChange}>
                  {scenarioItems}
                </select>
              </div>
        )
    }
})

module.exports = ScenarioSelect;