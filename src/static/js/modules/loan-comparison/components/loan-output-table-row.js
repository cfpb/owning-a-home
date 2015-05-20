var React = require('react');
var LoanOutputCell = require('./loan-output-table-cell');

var LoanOutputRow = React.createClass({
    render: function () {
        var loans = this.props.loans.map(function (loan) {
            return (
                <LoanOutputCell loan={loan} prop={this.props.prop} />
            )
        }, this);
        return (
          <tr>
            <th>{this.props.label}</th>
{/*            <LoanOutputCell prop={this.props.result} loans={this.props.loans} label={this.props.label} resultType={this.props.resultType}  />
         */ } 
            {loans}
          </tr>
        );
    }
});

module.exports = LoanOutputRow;