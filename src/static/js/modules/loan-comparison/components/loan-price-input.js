var React = require('react');
var LoanActions = require('../actions/loan-actions');
var debounce = require('debounce');

var LoanPriceInput = React.createClass({
    getInitialState: function () {
        return {price: this.props.loan.price};
    },
    handleChange: function (e) {
        this.setState({price: e.target.value});
        this.handleChangeDebounced();
    },
    componentWillMount: function () {
        var self = this;
        this.handleChangeDebounced = debounce(function () {
            LoanActions.update(self.props.loan.id, 'price', self.state.price);
        }, 500);
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            price: nextProps.loan.price
        });
    } ,
    render: function() {
        return (
            <input type="text" 
            placeholder="$200,000" 
            name="input-price-0" 
            id="input-price-0" 
            className="recalc"
            value={this.state.price}
            onChange={this.handleChange}/>
        );
    }
});


module.exports = LoanPriceInput;