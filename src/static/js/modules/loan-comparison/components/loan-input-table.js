var React = require('react');
var common = require('../common');
var LoanInputRow = require('./loan-input-table-row');

var LoanInputTable = React.createClass({
    inputRows: function (rows) {
        return (rows.map(function(prop){
            return <LoanInputRow prop={prop} loans={this.props.loans} scenario={this.props.scenario}/>;
        }, this))
    },
    render: function() { 
        return (
            <table className="unstyled">
                <tr className="header-row"><td colSpan="3">1. About you</td></tr>
                <tr><td></td><td>Scenario A</td><td>Scenario B</td></tr>
                {this.inputRows(['state', 'county', 'credit-score'])}
                
                <tr className="header-row"><td colSpan="3">2. About the home</td></tr>
                {this.inputRows(['price', 'downpayment', 'loan-amount'])}
                
                <tr className="header-row"><td colSpan="3">3. About the loan</td></tr>
                {this.inputRows(['rate-structure', 'arm-type', 'loan-term', 'loan-type', 'loan-summary', 'points'])}     
                
                {this.inputRows(['interest-rate'])}     
            </table>
        );
    }
});

module.exports = LoanInputTable;
