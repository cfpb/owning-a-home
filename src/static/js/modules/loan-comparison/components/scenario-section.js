var React = require('react');
var ScenarioSelect = require('./scenario-select');
var ScenarioButton = require('./scenario-button');

var ScenarioSection = React.createClass({
    
    render: function () {
        return (
            <div id="scenarios" className="block block__border-top block__padded-top">
                <div className="content-l">
                    <div className="content-l_col content-l_col-1">
                        <h3 className="u-mb0">{"Let's get started"}</h3>
                    </div>
                    <div className="content-l_col content-l_col-3-8">
                        <h3 className="h4">Explore your total loan costs using our prepopulated scenarios.</h3>
                        <ScenarioSelect scenario={this.props.scenario}/>
                    </div>
                    <div className="content-l_col scenario-alternates">
                        OR
                    </div>
                    <div className="content-l_col content-l_col-3-8">
                        <h3 className="h4">Compare the costs of different loan options with your own information.</h3>
                        <ScenarioButton/>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = ScenarioSection;