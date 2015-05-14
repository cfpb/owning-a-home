var React = require('react');
var LoanOutput = require('./loan-output');

var LoanOutputRow = React.createClass({
    render: function () {
        var loans = this.props.loans.map(function (loan) {
            return (
                <td><LoanOutput loan={loan} prop={this.props.prop}/></td>
            )
        }, this);
        return (
          <tr>
            <th>{this.props.label}</th>
            {loans}
          </tr>
        );
    }
});

module.exports = LoanOutputRow;