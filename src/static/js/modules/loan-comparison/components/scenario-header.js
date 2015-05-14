var React = require('react');

var ScenarioHeader = React.createClass({
    render: function () {
        return (
            <div>
                {this.props.scenario &&
                    <div className="content-l">
                        <div className="content-l_col content-l_col-3-4">
                            <h2>{this.props.scenario.title}</h2>
                            <p className="short-desc">{this.props.scenario.intro}</p>
                        </div>
                    </div>                    
                }
            </div>
        )
    }
})

module.exports = ScenarioHeader;