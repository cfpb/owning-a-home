var React = require('react');
var ScenarioSelect = require('./scenario-select');
var ScenarioButton = require('./scenario-button');

var ScenarioSection = React.createClass({
    
    render: function () {
        var str = "Let's get started";
        return (
            <div id="scenarios">
              <h3>{str}</h3>
              <div className="content-l_col content-l_col-3-8">
                <h3 className="h4">Explore your total loan costs using our prepopulated scenarios.</h3>
                <ScenarioSelect scenario={this.props.scenario}/>
              </div>
              <div className="content-l_col content-l_col-1-8">
                OR
              </div>
              <div className="content-l_col content-l_col-3-8">
                <h3 className="h4">Compare the costs of different loan options with your own information.</h3>
                <ScenarioButton/>
              </div>
            </div>
        )
    }
});

module.exports = ScenarioSection;