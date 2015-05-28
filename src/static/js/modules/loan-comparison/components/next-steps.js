var React = require('react');
var ScenarioPicker = require('./scenario-picker');

var NextSteps = React.createClass({
    render: function () {
        return (
            <div>
                <div className="content-l content-l__main">
                    <div className="content-l_col content-l_col-1">
                        <h2 className="u-mb-0">Next Steps</h2>
                        <div id="next-steps">
                            <div className="step-block">
                                <h3 className="h4">Print your information.</h3>
                                <p className="short-desc">
                                    Dead men tell no tales broadside mizzen clipper hearties grapple wench case shot sloop swing the lead. Tack mizzenmasty.
                                </p>
                                <a className="btn btn-primary">
                                   Print
                                </a>
                            </div>
                            <div className="step-block">
                                <h3 className="h4">Explore another scenario.</h3>
                                <ScenarioPicker scenario={this.props.scenario} scrollTo="loans-container"/>
                            </div>
                            <div className="step-block">
                                <h3 className="h4">Learn more about the mortgage process.</h3>
                                <p className="short-desc">
                                    Dead men tell no tales broadside mizzen clipper hearties grapple wench case shot sloop swing the lead. Tack mizzenmasty.
                                </p>
                                <p>
                                    <a href={baseURL + 'process'} className="jump-link jump-link__right">
                                      <span className="jump-link_text">Explore loan options</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = NextSteps;