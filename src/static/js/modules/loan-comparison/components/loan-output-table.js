var React = require('react');
var common = require('../common');
var LoanOutputRow = require('./loan-output-table-row');

var LoanOutputTable = React.createClass({
    render: function() {
        var summary = [1, 2, 3].map(function (prop) {
            return (
              <th><h4>heading</h4></th>
            )
        }, this);
        var rows = ['price', 'downpayment'].map(function (prop) {
            return (
                <LoanOutputRow prop={prop} loans={this.props.loans} label={common.propLabels[prop]} />
            )
        }, this);
        return (
            <table className="unstyled" loans={this.props.loans}>
              <thead>
                <tr>
                {summary}
                </tr>
              </thead>
              <tbody>
                {rows}
              </tbody>
                {
                 // <LoanInputRowGroup 
                  // header=''
                  // rows={['price', 'downpayment', 'loan-amount']}
                  // loans={this.props.loans} />
                }
            </table>
        );
    }
});

module.exports = LoanOutputTable;
