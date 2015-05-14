var React = require('react');
var LoanActions = require('../actions/loan-actions');

var SelectInput = React.createClass({
    handleChange: function (e) {
        LoanActions.update(this.props.loan.id, this.props.prop, e.target.value);
    },
    setClass: function () {
        var opts = this.props.opts || {};
        var className = "select-content ";
        if (opts.classCheck && typeof(opts.classCheck) === "function") {
            className += opts.classCheck(this.props.loan);
        }
        return className;
    },
    optionIsDisabled: function (option) {
        var opts = this.props.opts || {};
        var disabled;
        if (opts.disabledOptionCheck && typeof(opts.disabledOptionCheck) === "function") {
            disabled = opts.disabledOptionCheck(this.props.loan, option);
        }
        return disabled;
    },
    generateOptions: function () {
        var options = (this.props.opts || {}).options;
        if (typeof options == 'string') {
            options = this.props.loan[options];
        }
        if (options) {
            return options.map(function (opt) {
                return (
                    <option value={opt.val} disabled={this.optionIsDisabled(opt)}>{opt.label}</option>
                );
            }, this);
        }
    },
    render: function() {
        return (
            <div className={this.setClass()}>
                <select name={this.props.prop}
                        value={this.props.loan[this.props.prop]}
                        onChange={this.handleChange}>
                    {this.generateOptions()}
                </select>
            </div>
        );
    }
});

module.exports = SelectInput;