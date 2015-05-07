var $ = jQuery = require('jquery');
var debounce = require('debounce');
var formatUSD = require('format-usd');
require('tooltips');
var loanService = require('./loan-comparison/loan');

var React = require('react');
var defaultLoan = {
    'credit-score': 700,
    'downpayment': 20000,
    'price': 400000,
    'rate-structure': 'fixed',
    'points': 0,
    'loan-term': 30,
    'loan-type': 'conf',
    'arm-type': '5-1',
    'state': 'CA',
    'interest-rate': 3.875
};
var loanA = $.extend({}, defaultLoan);
loanService.updateLoanCalculations (loanA)
loanService.updateLoanCalculations (loanA, true);
var loanB = $.extend({}, defaultLoan);
loanService.updateLoanCalculations (loanB)

loanService.updateLoanCalculations (loanB, true);

loanOutputs = [
    {
        prop: 'closing-costs',
        title: 'Estimated cash to close'
    },
    {
        prop: 'downpayment',
        title: 'Down payment'
    }
];

var LoanItemDisplay = React.createClass({
  render: function() {
      // todo: this could be a callback to process loan data
    return (
        <td>
            {this.props.loan[this.props.loanProp]}
        </td>
    );
  }
});

var LoanOutputRow = React.createClass({
  render: function() {
      var that = this;
      var tableCells = this.props.loans.map(function (loan) {
          return (
              <td><LoanItemDisplay loanProp={that.props.output.prop} loan={loan} /></td>
          );
      });
    return (
        <tr>
            <td className="label-cell" dangerouslySetInnerHTML={{__html: this.props.output.title}}/>
            {tableCells}
        </tr>
    );
  }
});

var LoanOutputsSection = React.createClass({
  render: function() {   
    var loans = this.props.loans;

    var tableRows = this.props.outputs.map(function (output) {
        return (
            <LoanOutputRow output={output} loans={loans} />
        );
    });   
    return (
        <table className="unstyled">
            <thead>
                <tr>
                  <th>Outputs</th>
                  <th>Scenario A</th>
                  <th>Scenario B</th>
                </tr>
              </thead>
              <tbody>
                {tableRows}
              </tbody>
        </table>
    );
  }
});

React.render(
  <LoanOutputsSection outputs={loanOutputs} loans={[loanA, loanB]}/>,
  document.getElementById('app-container')
);