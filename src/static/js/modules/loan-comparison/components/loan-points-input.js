var React = require('react');
var LoanActions = require('../actions/loan-actions');

var LoanPointsInput = React.createClass({
    handleChange: function (e) {
        LoanActions.update(this.props.loan.id, this.props.prop, e.target.value);
    },
    render: function() {
        var opts = [
            {
                val: -2,
                name: 'negative-two'
            },
            {
                val: -1,
                name: 'negative-one'
            },
            {
                val: 0,
                name: 'zero'
            },
            {
                val: 1,
                name: 'one'
            },
            {
                val: 2,
                name: 'two'
            }
        ];
        var buttons = opts.map(function(radio){
            return (
                <div className="inline-radio lc-radio">
                    <input 
                        type="radio" 
                        name={'discount-' + this.props.loan.id} 
                        id={'discount-' + radio.name} 
                        value={radio.val} 
                        checked={this.props.loan.points == radio.val}
                        onClick={this.handleChange}/>
                    <label for="discount-negative-two">{radio.val}</label>
                </div>
             );
        }, this);
    return (
        <fieldset id="input-points" className="radio-fieldset input-content">
            {buttons}
        </fieldset>
    );
  }
});

module.exports = LoanPointsInput;