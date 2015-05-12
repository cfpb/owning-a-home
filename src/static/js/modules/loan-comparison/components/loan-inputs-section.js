var React = require('react');
var LoanSelect = require('./loan-select');
var common = require('../common');
var LoanPriceInput = require('./loan-price-input');
var LoanArmInput = require('./loan-arm-input');
var LoanTermInput = require('./loan-term-input');
var LoanTypeInput = require('./loan-type-input');
var DownpaymentInput = require('./loan-downpayment-input');
var PointsInput = require('./loan-points-input');
var InterestRateInput = require('./interest-rate-input');
var LoanOutput = require('./loan-output');
var ErrorMessage = require('./error-message');

var loanInputGroups = [
    {
        groupHeader: '1. About you',
        cellHeaders: ['', 'Scenario A', 'Scenario B'],
        rows: [
        {
            label: 'State',
            prop: 'state',
            component: LoanSelect, 
            tooltip: 'State tooltip',
            opts: {
                options: common.stateOptions
            }
        },
        {
            label: 'County',
            prop: 'county',
            component: LoanSelect,
            opts: {
                options: [{label: '', val: ''}, {label: '', val: ''}]
            }
        },
        {
            label: 'Credit Score',
            prop: 'credit-score',
            component: LoanSelect,
            opts: {
                options: common.creditScoreOptions
            }
        }
        ]
    },
    {
        groupHeader: '2. About the home',
        rows: [
        {
            label: 'House price',
            prop: 'price',
            component: LoanPriceInput
        },
        {
            label: 'Downpayment',
            prop: 'downpayment',
            component: DownpaymentInput
        },
        {
            label: 'Loan Amount',
            prop: 'loan-amount',
            component: LoanOutput,
            type: 'display'
        }
        ]
    },
    {
        groupHeader: '3. About the loan',
        rows: [
        {
            label: 'Rate structure',
            prop: 'rate-structure',
            component: LoanSelect,
            opts: {
                options: common.rateStructureOptions
            } 
        },
        {
            label: 'ARM type',
            prop: 'arm-type',
            component: LoanArmInput
        },
        {
            label: 'Loan term',
            prop: 'loan-term',
            component: LoanTermInput
        },
        {
            label: 'Loan type',
            prop: 'loan-type',
            component: LoanTypeInput
        },
        {
            label: 'Loan Option',
            prop: 'loan-summary',
            component: LoanOutput,
            type: 'display'
        },
        {
            label: 'Discount points and credits',
            prop: 'points',
            component: PointsInput
        },
        {
            label: 'Interest Rate',
            prop: 'interest-rate',
            component: InterestRateInput
        }
        ]
    }
];

var LoanInputsSection = React.createClass({
  render: function() { 
    var tbodies = loanInputGroups.map(function (group) {
        return (
            <LoanInputsRowGroup loans={this.props.loans} scenario={this.props.scenario} opts={group}/>
        );
    }, this);  
    return (
        <table className="unstyled">
            {tbodies}
        </table>
    );
  }
});

var LoanInputsRowGroup = React.createClass({
  render: function() { 
    var opts = this.props.opts;
    var cellHeaderRow;
    
    if (opts.cellHeaders) {
      var headerCells = opts.cellHeaders.map(function (header) {
         return (
           <td>{header}</td>
         )
      }, this);
      cellHeaderRow = (<tr>{headerCells}</tr>);
    }
    
    var rows = opts.rows.map(function (row) {
       return (
         <LoanInputRow row={row} loans={this.props.loans} scenario={this.props.scenario}/>
       )
    }, this); 
    
    return (
        <tbody>
            <tr><td colSpan="3">{opts.groupHeader}</td></tr>
            {cellHeaderRow}
            {rows}
        </tbody>
    );
  }
});

var LoanInputRow = React.createClass({

  render: function() {
      var rowData = this.props.row;
      var scenario = this.props.scenario;
      var note = scenario ? scenario.inputNotes[rowData.prop] : '';
      var noteSpan = note ? (<span className="hidden">{note}</span>) : null;
      var InputComponent = rowData.component;
      var tableCells = this.props.loans.map(function (loan) {
          return (
              <td><InputComponent loan={loan} prop={rowData.prop} opts={rowData.opts}/></td>
          );
      }, this);
    
    return (
        <tr className={note ? 'highlight' : ''}>
            <td className="label-cell">
                <span className="label-text">{rowData.label}</span>
                <span className="lc-tooltip" data-toggle="tooltip" role="tooltip" data-original-title="" title="">
                    <span className="cf-icon cf-icon-help-round"></span>
                </span>
                <span className="help-text">{rowData.tooltip}</span>
                {noteSpan}
            </td>
            {tableCells}
        </tr>
    );
  }
});

module.exports = LoanInputsSection;
