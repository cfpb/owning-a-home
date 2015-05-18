var React = require('react');
var common = require('../common');
var LoanOutputRow = require('./loan-output-table-row');

var LoanOutputTableGroup = React.createClass({
    render: function() {
        var results = ['closing','monthly','overall'].map(function (prop) {
            return (
                <div>
                    <h1>{prop}</h1>
                    <div>
                        <LoanOutputTable result={prop} prop={this.props.prop} loans={this.props.loans} results={['interest-fees-paid','monthly-hoa-dues']}/>
                    </div>
                </div>
            )
        }, this);
        return (
            <section className="comparison-results content-l">
                <div className="content-l_col-3-4 content-l_col">
                {results}
                </div>
            </section>
        );
    }
});

var LoanOutputTable = React.createClass({
    render: function() {
        var rows = this.props.results.map(function (prop) {
            return (
                <LoanOutputRow prop={prop} loans={this.props.loans} label={common.propLabels[prop]} />
            )
        }, this);
        return (
            <table className="unstyled" loans={this.props.loans}>
                <thead>
                    <LoanOutputTableHead loans={this.props.loans} result={this.props.result} />
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
});

var LoanOutputTableHead = React.createClass({
    render: function() {
        var summary = [this.props.result,'loan a $','loan b $'].map(function (prop) {
            return (
              <th><h4>{prop}</h4></th>
            )
        }, this);
        return (
            <tr>
            {summary}
            </tr>
        )
    }
});

module.exports = LoanOutputTableGroup;
