var React = require('react');
var common = require('../common');
var LoanOutput = require('./loan-output');

var LoanOutputCell = React.createClass({
    displayClassNames: function(loan, prop, type) {
        var loanID = loan['id'] === 0 ? 'a' : 'b',
            propResult = prop + '-display-' + loanID,
            loanScenario = 'lc-result-' + loanID,
            classes = propResult + ' ' + loanScenario + ' lc-result';
        if (type === 'primary') {
            classes += ' lc-primary-result';
        }
        return classes;
    },
    render: function () {
        var loan = this.props.loan,
            prop = this.props.prop,
            resultType = this.props.resultType;
        return (
            <td className={this.displayClassNames(loan,prop,resultType)}>
                <LoanOutput loan={loan} prop={prop}/>
            </td>
        );
    }
});

module.exports = LoanOutputCell;