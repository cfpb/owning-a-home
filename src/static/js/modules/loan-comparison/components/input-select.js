var React = require('react');
var assign = require('object-assign');

var SelectInput = React.createClass({
    propTypes: {
        val: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number,
            React.PropTypes.bool
        ]),
        handleChange: React.PropTypes.func.isRequired,
        title: React.PropTypes.string,
        componentId: React.PropTypes.string,
        disabledOptionCheck: React.PropTypes.func
    },
    generateOptions: function () {
        if (this.props.options) {
            var isDisabled = typeof this.props.disabledOptionCheck === "function" 
                           ? this.props.disabledOptionCheck
                           : function () {};

            var opts = this.props.options.map(function (opt) {
                return (
                    <option value={opt.val} disabled={isDisabled(opt)}>{opt.label}</option>
                );
            }, this);

            if (this.props.title) {
                opts.unshift(<option disabled value='selectTitle'>{this.props.title}</option>);
            }

            return opts;
        }
    },
    render: function() {
        return (
            <select id={this.props.componentId}
                    value={this.props.val || 'selectTitle'}
                    onChange={this.props.handleChange}>
                {this.generateOptions()}
            </select>
        );
    }
});

module.exports = SelectInput;