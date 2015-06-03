var React = require('react');
var debounce = require('debounce');
var common = require('../common');

var DebouncedTextInput = React.createClass({
    // TODO: make debounce optional
    propTypes: {
        value: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number,
            React.PropTypes.bool
        ])
    },
    getInitialState: function () {
        return {value: this.props.value};
    },
    handleChange: function (e) {
        this.setState({value: e.target.value});
        this.handleChangeDebounced();
    },
    componentWillMount: function () {
        var self = this;
        this.handleChangeDebounced = debounce(function () {
            self.props.onChange(self.state.value);
        }, 500);
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({value: nextProps.value});
    },
    render: function() {
        var props = common.omit(this.props, 'value', 'onChange');
        return (
            <input type="text" value={this.state.value} onChange={this.handleChange} {...props}/>
        );
    }
});

module.exports = DebouncedTextInput;