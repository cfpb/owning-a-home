var React = require('react');
var ScenarioPicker = require('./scenario-picker');

var NextSteps = React.createClass({
    print: function () {
        window.focus();
        window.print();
    },
    render: function () {
        return (
            <div className="next-steps-container">
                <div className="content-l content-l__main">
                    <div className="content-l_col content-l_col-1">
                        <div id="next-steps">
                            <div className="step-block">
                                <h3 className="h4">Print your information</h3>
                                <p className="short-desc">
                                    Print this worksheet for extra information and tips that can help you make informed decisions when choosing a mortgage loan. This resource is great to have handy when you discuss your budget with your spouse, visit your lender, or figure your way around the mortgage process.
                                </p>
                                <a className="btn btn-primary" onClick={this.print}>
                                   Print
                                </a>
                            </div>
                            <div className="step-block">
                                <h3 className="h4">Explore another scenario</h3>
                                <ScenarioPicker scenario={this.props.scenario} scrollTo="loans-container"/>
                            </div>
                            <div className="step-block">
                                <h3 className="h4">Learn more about the mortgage process</h3>
                                <p className="short-desc">
                                    To get a better understanding of all loan terms, interest rate types, and loan types visit our Loan Options Guide. This resource explains the pros and cons of several loan options to help you choose the mortgage that will be the best fit for you and your family.
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