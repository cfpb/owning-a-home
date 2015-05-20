var React = require('react');
var common = require('../common');
var LoanOutput = require('./loan-output');

var LoanOutputCell = React.createClass({
    // displayClassNames: function(loan, result, type) {
    //     var //loanID = this.props.loans.loan['id'] === 0 ? 'a' : 'b',
    //         loanID = 'a',
    //         propResult = result + '-display-' + loanID,
    //         loanScenario = 'lc-result-' + loanID,
    //         classes = propResult + ' ' + loanScenario + ' lc-result';
    //     if (type === 'primary') {
    //         classes += ' lc-primary-result';
    //     }
    //     return classes;
    // },
    render: function () {
        return (
            <td>
            {/*<td className={this.displayClassNames(this.props.loan,prop,this.props.resultType)}>*/}
                <LoanOutput loan={this.props.loan} prop={this.props.prop}/>
            </td>
        );
    }
});

module.exports = LoanOutputCell;