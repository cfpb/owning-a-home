var React = require('react');
var assign = require('object-assign');
var common = require('../common');

var SelectInput = React.createClass({
    propTypes: {
        value: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number,
            React.PropTypes.bool
        ])
        // TODO: document optional props, including: 
        //title: React.PropTypes.string,
        //disabledItemCheck: React.PropTypes.func
    },
    getDefaultProps: function() {
        return {
            disabledItemCheck: function () {},
            config: {
                valProp: 'val',
                labelProp: 'label'
            }
        };
    },
    generateOptions: function () {
        var config = this.props.config;
        var val = config.valProp;
        var label = config.labelProp;
        var items = this.props.items;
    
        if (items) {
            var opts = items.map(function (opt) {
                return (
                    <option value={opt[val]} disabled={this.props.disabledItemCheck(opt)}>{opt[label]}</option>
                );
            }, this);

            if (config.hasOwnProperty('title')) {
                opts.unshift(<option disabled value='selectTitle'>{config.title}</option>);
            }

            return opts;
        }
    },
    render: function() {
        // TODO: add 'children' option
        var props = common.omit(this.props, 'value', 'disabledItemCheck', 'config', 'children');
        return (
            <select value={this.props.value || 'selectTitle'} {...props}>
                {this.generateOptions()}
            </select>
        );
    }
});

module.exports = SelectInput;