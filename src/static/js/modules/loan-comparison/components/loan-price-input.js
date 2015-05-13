var React = require('react');
var LoanActions = require('../actions/loan-actions');
var debounce = require('debounce');

var LoanPriceInput = React.createClass({
    getInitialState: function () {
        return {val: this.props.loan[this.props.prop]};
    },
    handleChange: function (e) {
        this.setState({val: e.target.value});
        this.handleChangeDebounced();
    },
    componentWillMount: function () {
        var self = this;
        this.handleChangeDebounced = debounce(function () {
            LoanActions.update(self.props.loan.id, self.props.prop, self.state.val);
        }, 500);
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            val: nextProps.loan[this.props.prop]
        });
    },
    render: function() {
        return (
            <div className="dollar-input">
                <span className="unit">$</span>
                <input type="text" 
                placeholder="$200,000" 
                name="input-price-0" 
                className="recalc"
                value={this.state.val}
                onChange={this.handleChange}/>
            </div>
        );
    }
});

module.exports = LoanPriceInput;