var React = require('react');
var assign = require('object-assign');
var common = require('../common');

var SelectInput = React.createClass({
    propTypes: {
        value: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number,
            React.PropTypes.bool
        ]),
        title: React.PropTypes.string,
        disabledItemCheck: React.PropTypes.func
    },
    getDefaultProps: function() {
        return {
            disabledItemCheck: function () {}
        };
    },
    generateOptions: function () {
        if (this.props.items) {
            var opts = this.props.items.map(function (opt) {
                return (
                    <option value={opt.val} disabled={this.props.disabledItemCheck(opt)}>{opt.label}</option>
                );
            }, this);

            if (this.props.title) {
                opts.unshift(<option disabled value='selectTitle'>{this.props.title}</option>);
            }

            return opts;
        }
    },
    render: function() {
        // TODO: add 'children' option
        var props = common.omit(this.props, 'value', 'disabledItemCheck', 'title', 'children');
        return (
            <select value={this.props.value || 'selectTitle'} {...props}>
                {this.generateOptions()}
            </select>
        );
    }
});

module.exports = SelectInput;