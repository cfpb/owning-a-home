var React = require('react');
var common = require('../common');
var LoanOutput = require('./loan-output');
var LoanOutputRow = require('./loan-output-table-row');

var LoanOutputTableGroup = React.createClass({
    render: function() {
        var results = ['closing-costs','monthly-payment','overall-costs'].map(function (prop) {
            return (
                <LoanOutputTable result={prop} prop={this.props.prop} loans={this.props.loans} />
            )
        }, this);
        return (
            <section className="comparison-results content-l">
                <div className="content-l_col-3-4 content-l_col">
                    <div>
                        <header className="u-mb20 u-mt20">
                            <div className="input-headers" aria-hidden="true">
                                <div className="comparison-input-column"></div>
                                <div className="comparison-input-column comparison-input-column-a"><h3>Scenario A</h3></div>
                                <div className="comparison-input-column comparison-input-column-b"><h3>Scenario B</h3></div>
                            </div>
                        </header>
                        <div>
                            {results}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
});

var LoanOutputTable = React.createClass({
    render: function() {
        var rows = ['downpayment','third-party-services'].map(function (prop) {
            return (
                <LoanOutputRow prop={prop} loans={this.props.loans} label={common.propLabels[prop]} resultType='main' />
            )
        }, this);
        return (
            <table className="lc-results-table expandable expandable__table expandable__no-bg expandable__expanded" loans={this.props.loans}>
                <thead className="u-visually-hidden">
                    <tr>
                        <th>Costs</th>
                        <th>Scenario A</th>
                        <th>Scenario B</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <thead className="expandable_target expandable_header">
                    <LoanOutputTableHead loans={this.props.loans} result={this.props.result}  label={common.propLabels[this.props.result]}/>
                </thead>
                <tbody className="expandable_content">
                    {rows}
                </tbody>
            </table>
        );
    }
});

var LoanOutputTableHead = React.createClass({
    headingIcon: function(result) {
        var icon = 'cf-icon cf-icon-';
        if (result === 'closing-costs') {
            icon += 'mortgage';
        } else if (result === 'monthly-payment') {
            icon += 'date';
        } else if (result === 'overall-costs') {
            icon += 'owning-home';
        }
        return icon;
    },
    render: function() {
        // var summaryHeading = this.props.result.map(function (prop) {
        //     return (
                
        //     )
        // }, this);
        var loans = this.props.loans.map(function (loan) {
            var loanID = loan['id'] === 0 ? 'a' : 'b',
                propResult = this.props.result + '-display-' + loanID,
                loanScenario = 'lc-result-' + loanID;

            var classes = 'lc-primary-result ' + propResult + ' ' + loanScenario + ' lc-result';

            return (
                <td className={classes}><LoanOutput loan={loan} prop={this.props.result}/></td>
            )
        }, this);
        return (
            <tr>
                <th scope="row" className="lc-primary-result-heading">
                    <h4 className="results-section-heading">
                        <span className={this.headingIcon(this.props.result)}></span>&nbsp;
                        {this.props.label}
                    </h4>
                    <span className="expandable_header-right expandable_link">
                        <span className="expandable_cue-open">
                            <span className="u-visually-hidden">Show</span>
                            <span className="cf-icon cf-icon-plus-round"></span>
                        </span>
                        <span className="expandable_cue-close">
                            <span className="u-visually-hidden">Hide</span>
                            <span className="cf-icon cf-icon-minus-round"></span>
                        </span>
                    </span>
                </th>
                    {loans}
                    {/*<LoanOutputRow prop={this.props.result} loans={this.props.loans} label={this.props.label} resultType='primary' />*/}
                <td className="callout-educational">
                    Educational callout
                </td>
            </tr>
        )
    }
});

module.exports = LoanOutputTableGroup;
