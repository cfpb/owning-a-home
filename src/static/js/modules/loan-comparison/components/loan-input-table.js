var React = require('react');
var common = require('../common');
var LoanInputRow = require('./loan-input-table-row');

var LoanInputTable = React.createClass({
    render: function() { 
        return (
            <table className="unstyled">
                <LoanInputRowGroup header='1. About you' 
                                   rows={['state', 'county', 'credit-score']}
                                   colHeaders={['', 'Scenario A', 'Scenario B']}
                                   loans={this.props.loans} 
                                   scenario={this.props.scenario} />
                                   
                <LoanInputRowGroup header='2. About the home' 
                                   rows={['price', 'downpayment', 'loan-amount']}
                                   loans={this.props.loans} 
                                   scenario={this.props.scenario} />
                                   
                <LoanInputRowGroup header='3. About the loan' 
                                   rows={['rate-structure', 'arm-type', 'loan-term', 'loan-type', 'loan-summary', 'points']}
                                   loans={this.props.loans}
                                   scenario={this.props.scenario} />
                                   
                <LoanInputRowGroup rows={['interest-rate']}
                                   loans={this.props.loans} 
                                   scenario={this.props.scenario} />
            </table>
        );
    }
});

var LoanInputRowGroup = React.createClass({
    render: function () {
        var colHeaders = this.props.colHeaders;
        var rows = this.props.rows.map(function (prop) {
            return (
                <LoanInputRow prop={prop} loans={this.props.loans} scenario={this.props.scenario}/>
            )
        }, this);
        return (
            <tbody>
                {this.props.header &&
                    <tr className="header-row"><td colSpan="3">{this.props.header}</td></tr>
                }
                {colHeaders &&
                    <tr className="colHeader-row"><td>{colHeaders[0]}</td><td>{colHeaders[1]}</td><td>{colHeaders[2]}</td></tr>
                }
                {rows}
            </tbody>
        );
    }
});

module.exports = LoanInputTable;
