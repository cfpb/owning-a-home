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
            <table className="unstyled loan-input-table">
                <tr className="header-row"><th colSpan="4"><h3>About you</h3></th></tr>
                <tr className="subhead-row">
                    <th></th>
                    <th className="input-0"><h4>Scenario A</h4></th>
                    <th className="link"></th>
                    <th className="input-1"><h4>Scenario B</h4></th>
                </tr>
                {this.inputRows(['state', 'county', 'credit-score'])}
                
                <tr className="header-row"><th colSpan="4"><h3>About the home</h3></th></tr>
                {this.inputRows(['price', 'downpayment', 'loan-amount'])}

                <tr className="header-row"><th colSpan="4"><h3>About the loan</h3></th></tr>
                {this.inputRows(['rate-structure', 'arm-type', 'loan-term', 'loan-type', 'loan-summary', 'points'])}     

                
            </table>
        );
    }
});

module.exports = LoanInputTable;
