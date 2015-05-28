var React = require('react');
var debounce = require('debounce');

var DebouncedTextInput = React.createClass({
    getInitialState: function () {
        return {val: this.props.val};
    },
    handleChange: function (e) {
        this.setState({val: e.target.value});
        this.handleChangeDebounced();
    },
    componentWillMount: function () {
        var self = this;
        this.handleChangeDebounced = debounce(function () {
            self.props.handleChange(self.state.val);
        }, 500);
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({val: nextProps.val});
    },
    render: function() {
        // TODO: label
        return (
            <div className={this.props.className}>
                <span className="unit"></span>
                <input type="text" 
                    placeholder={this.props.placeholder}
                    name="input-price" 
                    className="recalc"
                    maxLength={this.props.maxLength}
                    value={this.state.val}
                    onChange={this.handleChange}/>
            </div>
        );
    }
});

module.exports = DebouncedTextInput;