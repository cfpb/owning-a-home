var $ = jQuery = require('jquery');

var React = require('react');
var common = require('../common');
var components = {
    'select': require('./loan-input-select'),
    'text': require('./loan-input-text'),
    'output': require('./loan-output'),
    'radio': require('./loan-input-radio'),
    'downpayment': require('./loan-input-downpayment'),
    'interest-rate': require('./loan-input-interest-rate')
}
var Tooltip = require('./tooltip');

var rowData = {
    'state': {
        title: 'State', 
        opts: {options: common.stateOptions}
    },
    'county': {
        title: 'County', 
        opts: {options: 'counties'}
    },
    'credit-score': {
        title: 'Credit Score', 
        opts: {options: common.creditScoreOptions}
    },
    'price': {
        title: 'House price', 
        type: 'text', 
        opts: {className: 'dollar-input'}
    },
    'downpayment': {
        title: 'Down payment', 
        type: 'downpayment'
    },
    'loan-amount': {
        title: 'Loan Amount', 
        type: 'output'
    },
    'rate-structure': {
        title: 'Rate structure',
        opts: {options: common.rateStructureOptions}
    },
    'arm-type': {
        title: 'ARM type',
        opts: {
            options: common.armOptions,
            classCheck: function (loan) {
                return loan['is-arm'] ? '' : 'hidden';
            }
        }
    },
    'loan-term': {
        title: 'Loan term',
        opts: {
            options: common.termsOptions,
            classCheck: function (loan) {
                return loan['term-error'] ? 'highlight-dropdown' : '';
            },
            disabledOptionCheck: function (loan, option) {
                return (loan['is-arm'] && $.inArray(option.val, common.armDisallowedTerms) !== -1);
            }
        }
    },
    'loan-type': {
        title: 'Loan type',
        opts: {
            options: common.typeOptions,
            classCheck: function (loan) {
                return loan['type-error'] ? 'highlight-dropdown' : '';
            },
            disabledOptionCheck: function (loan, option) {
                // TODO: is in disallowed terms
                return (loan['is-arm'] && $.inArray(option.val, common.armDisallowedTypes) !== -1);
            }
        }
    },
    'loan-summary': {
        title: 'Loan Option', 
        type: 'output'
    },
    'points': {
        title: 'Discount points and credits', 
        type: 'radio',
        opts: {options: common.pointsOptions}
    },
    'interest-rate': {
        title: 'Interest Rate', 
        type: 'interest-rate',
        opts: {options: 'rates'}
    }
    
}

var LoanInputRow = React.createClass({
    render: function() {
        var data = rowData[this.props.prop];
        var type = data.type || 'select';
        var Component = components[type];
        var className = (type === 'radio' || type === 'output') ? '' : 'input-row';
        var notes = (this.props.scenario || {}).inputNotes;
        if (notes && notes[this.props.prop]) {
            className += ' highlight';
        }
        var tableCells = this.props.loans.map(function (loan) {
          return (
              <td><Component loan={loan} prop={this.props.prop} scenario={this.props.scenario} opts={data.opts}/></td>
          );
        }, this);
        return (
            <tr className={className}>
                <td className="label-cell">
                    <span className="label-text">{data.title}</span>
                    <Tooltip text={common.inputTooltips[this.props.prop]}/>
                </td>
                {tableCells}
            </tr>
        );
    }
});

module.exports = LoanInputRow;
