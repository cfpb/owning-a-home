var $ = jQuery = require('jquery');
var React = require('react');
var common = require('../common');
var utils = require('../utils');
var Tooltip = require('./tooltip');
var SelectInput = require('./loan-input-select');
var Output = require('./loan-output');
var TextInput = require('./loan-input-text');
var RadioInput = require('./loan-input-radio');
var DownpaymentInput = require('./loan-input-downpayment');
var InterestRateInput = require('./loan-input-interest-rate');

var components = {
    'price': TextInput,
    'points': RadioInput,
    'downpayment': DownpaymentInput,
    'interest-rate': InterestRateInput,
    'loan-amount': Output,
    'loan-summary': Output
};

var opts = {
    'loan-type': armChecks,
    'loan-term': armChecks,
    'arm-type': {
        classCheck: function (loan, prop) {
            return prop === 'arm-type' && !loan['is-arm'];
        }
    }
};

var armChecks = {
    classCheck: function (loan, prop) {
        return loan.errors[prop];
    },
    disabledOptionCheck: function (loan, prop, opt) {
        return (loan['is-arm'] && $.inArray(opt, common.armDisallowedOptions[prop]) >= 0);
    }
}

var LoanInputRow = React.createClass({
    propTypes: {
        prop: React.PropTypes.string.isRequired,
        loans: React.PropTypes.array.isRequired,
        scenario: React.PropTypes.object // or null
    },
    render: function () {
        var prop = this.props.prop;
        var Component = components[prop] || SelectInput;
        var label = common.propLabels[prop] || utils.capitalizeFirst(prop.split('-').join(' '));
        var notes = (this.props.scenario || {}).inputNotes;
        var educationalNote = notes[prop];
        var className = '';
        className += educationalNote ? ' highlight' : '';
        className += ($.inArray(prop, ['loan-amount', 'loan-summary', 'points']) >= 0) ? '' : ' padded-row';
        var loanCells = this.props.loans.map(function (loan) {
          return (
              <td><Component loan={loan} prop={prop} scenario={this.props.scenario} options={common.options[prop]} opts={opts[prop]}/></td>
          );
        }, this);
        
        return (
            <tr className={className}>
                <td className="label-cell">
                    <span className="label-text">{label}</span>
                    <Tooltip text={common.inputTooltips[prop]}/>
                </td>
                {loanCells}
            </tr>
        );
    }
});

module.exports = LoanInputRow;
