var React = require('react');
var common = require('../common');
var LoanOutput = require('./loan-output');
var LoanOutputRow = require('./loan-output-table-row');
var OutputAlert = require('./output-alert');

var resultsTables = {
    'closing-costs': ['downpayment','lender-fees','discount','processing','third-party-fees','third-party-services','insurance','taxes-gov-fees','prepaid-expenses','initial-escrow'],
    'monthly-payment': ['monthly-principal-interest','monthly-mortgage-insurance','monthly-hoa-dues','monthly-taxes-insurance'],
    'overall-costs': ['loan-term','principal-paid','interest-fees-paid']
}

var resultsSub = ['discount','processing','third-party-services','insurance'];

var LoanOutputTableGroup = React.createClass({
    isLoading: function () {
        var loading;
        for (var i = 0; i < this.props.loans.length; i++) {
            var loan = this.props.loans[i];
            if (loan['rate-request'] || loan['county-request'] || loan['mtg-ins-request']) {
                loading = true;
                break;

            }            
        }

        return loading;
    },
    render: function() {
        var loading = "";
        var results = ['closing-costs','monthly-payment','overall-costs'].map(function (prop) {
            return (
                <LoanOutputTable result={prop} prop={prop} loans={this.props.loans}  scenario={this.props.scenario} />
            )
        }, this);
        var msg;
        if (this.isLoading()) {
            loading = "loading";
            msg = <OutputAlert />;
        }


        return (
            <section className="comparison-results content-l">  
                          
                               
                <div className="content-l_col-3-4 content-l_col output-table">
                    {msg}

                    <div className={loading}>
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
            var type = jQuery.inArray(prop, resultsSub) !== -1 ? 'sub' : 'main';
            return (
                <LoanOutputRow prop={prop} loans={this.props.loans} label={common.getPropLabel(prop)} scenario={this.props.scenario} resultType={type} />
            )
        }, this);
        return (
            <table className="lc-results-table expandable expandable__table expandable__no-bg" loans={this.props.loans} prop={this.props.prop}>
                <thead className="u-visually-hidden">
                    <tr>
                        <th>Costs</th>
                        <th>Scenario A</th>
                        <th>Scenario B</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <thead className="expandable_target expandable_header">
                    <LoanOutputTableHead loans={this.props.loans} prop={this.props.prop}  label={common.getPropLabel(this.props.prop)} scenario={this.props.scenario} />
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
                <LoanOutputRow prop={this.props.prop} loans={this.props.loans} label={this.props.label} scenario={this.props.scenario} resultType='primary' />
                <td className="callout-educational">
                    Educational callout
                </td>
            </tr>
        )
    }
});

module.exports = LoanOutputTableGroup;
