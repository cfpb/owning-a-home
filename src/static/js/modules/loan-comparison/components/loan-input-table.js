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
            <table className="unstyled" id="loan-input-table">
                <tr className="header-row"><th colSpan="3">1. About you</th></tr>
                <tr>
                    <th></th>
                    <th className="input-0">Scenario A</th>
                    <th className="link"></th>
                    <th className="input-1">Scenario B</th>
                </tr>
                {this.inputRows(['state', 'county', 'credit-score'])}
                
                <tr className="header-row"><th colSpan="3">2. About the home</th></tr>
                {this.inputRows(['price', 'downpayment', 'loan-amount'])}

                <tr className="header-row"><th colSpan="3">3. About the loan</th></tr>
                {this.inputRows(['rate-structure', 'arm-type', 'loan-term', 'loan-type', 'loan-summary', 'points'])}     

                {this.inputRows(['interest-rate'])}
                
            </table>
        );
    }
});

module.exports = LoanInputTable;
