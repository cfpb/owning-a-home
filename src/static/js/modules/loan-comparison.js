var $ = jQuery = require('jquery');
var debounce = require('debounce');
var formatUSD = require('format-usd');
require('tooltips');
var loanService = require('./loan-comparison/loan');
var loanUI = require('./loan-comparison/loan-ui');
var common = require('./loan-comparison/common');


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

var scenario;

loanOutputs = [
    {
        prop: 'closing-costs',
        title: 'Estimated cash to close',
        tooltip: 'Tooltip!'
    },
    {
        prop: 'downpayment',
        title: 'Down payment',
        tooltip: 'Tooltip!'
    }
];

var LoanItemDisplay = React.createClass({
  render: function() {
     var prop = this.props.output.prop;
    return (
        <td>
            <td>{loanUI.formatOutput(prop, this.props.loan[prop])}</td>
        </td>
    );
  }
});

var LoanOutputRow = React.createClass({
  render: function() {
      var output = this.props.output;
      var tableCells = this.props.loans.map(function (loan) {
          return (
              <LoanItemDisplay loan={loan} output={output}/>
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
                  <th></th>
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

var LoanComparisonScenarioSection = React.createClass({
    getInitialState: function () {
        return {
            scenario: undefined
        }
    },
    handleChange: function (e) {
        this.setState({
            scenario: e.target.value
        });
    },
    render: function () {
        var scenarioData = this.props.scenarios;
        var scenarios= this.props.scenarioList.map(function (key) {
            var scenario = scenarioData[key];
            return (
                <option value={key}>{scenario.title}</option>
            );
        });
        return (
            <div id="scenarios">
              <div className="content-l_col content-l_col-1-2">
                  <div className="select-content">
                    <select 
                        name="input-scenario"
                        className="recalc" 
                        id="input-scenario"
                        value={this.state.scenario}
                        onChange={this.handleChange}>
                      {scenarios}
                    </select>
                  </div>
                  <div>{this.state.scenario}</div>
              </div>
            </div>
        )
    }
})

var LoanComparisonContainer = React.createClass({
  render: function() {   
    return (
        <div>
            <LoanComparisonScenarioSection scenarios={this.props.scenarios} scenarioList={this.props.scenarioList}/>
            <LoanOutputsSection outputs={this.props.outputs} loans={this.props.loans}/>
        </div>
    );
  }
});

React.render(
  <LoanComparisonContainer outputs={loanOutputs} loans={[loanA, loanB]} scenarios={common.scenarios} scenarioList={common.scenarioList}/>,
  document.getElementById('app-container')
);