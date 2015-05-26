var React = require('react');
var common = require('../common');
var LoanOutput = require('./loan-output');
var LoanOutputRow = require('./loan-output-table-row');

var resultsTables = {
    'closing-costs': ['downpayment','lender-fees','discount','processing','third-party-services','insurance','taxes-gov-fees','prepaid-expenses','initial-escrow'],
    'monthly-payment': ['monthly-principal-interest','monthly-mortgage-insurance','monthly-hoa-dues','monthly-taxes-insurance'],
    'overall-costs': ['loan-term','principal-paid','interest-fees-paid']
}

var LoanOutputTableGroup = React.createClass({
    render: function() {
        var results = ['closing-costs','monthly-payment','overall-costs'].map(function (prop) {
            return (
                <LoanOutputTable result={prop} prop={prop} loans={this.props.loans} />
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
        var tableRows = resultsTables[this.props.prop];
        var rows = tableRows.map(function (prop) {
            return (
                <LoanOutputRow prop={prop} loans={this.props.loans} label={common.propLabels[prop]} resultType='main' />
            )
        }, this);
        return (
            <table className="lc-results-table expandable expandable__table expandable__no-bg expandable__expanded" loans={this.props.loans} prop={this.props.prop}>
                <thead className="u-visually-hidden">
                    <tr>
                        <th>Costs</th>
                        <th>Scenario A</th>
                        <th>Scenario B</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <thead className="expandable_target expandable_header">
                    <LoanOutputTableHead loans={this.props.loans} prop={this.props.prop}  label={common.propLabels[this.props.prop]}/>
                </thead>
                <tbody className="expandable_content">
                    {rows}
                </tbody>
            </table>
        );
    }
});

var LoanOutputTableHead = React.createClass({
    render: function() {
        return (
            <tr>
                <LoanOutputRow prop={this.props.prop} loans={this.props.loans} label={this.props.label} resultType='primary' />
                <td className="callout-educational">
                    Educational callout
                </td>
            </tr>
        )
    }
});

module.exports = LoanOutputTableGroup;
