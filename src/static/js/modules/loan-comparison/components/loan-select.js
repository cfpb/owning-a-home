var React = require('react');
var LoanActions = require('../actions/loan-actions');

var LoanSelect = React.createClass({
    handleChange: function (e) {
        LoanActions.update(this.props.loan.id, this.props.prop, e.target.value);
    },
    render: function() {
        var prop = this.props.prop;
        var val = this.props.loan[prop];
        var options = this.props.opts.options.map(function (opt) {
            return (
                <option value={opt.val}>{opt.label}</option>
            );
        });

        return (
            <div className="select-content">
                <select 
                    ref="select"
                    name={prop}
                    value={val}
                    onChange={this.handleChange}>
                        {options}
                </select>
            </div>
        );
    }
});

module.exports = LoanSelect;