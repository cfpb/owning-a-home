var React = require('react');
var common = require('../common');
var LoanInputRow = require('./loan-input-table-row');

var InterestRateTable = React.createClass({

    render: function() { 
        return (
            <table className="unstyled loan-input-table">  
                <LoanInputRow prop="interest-rate" loans={this.props.loans} scenario={this.props.scenario}/>
            </table>
        );
    }
});

module.exports = InterestRateTable;