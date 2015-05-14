var React = require('react');
var LoanActions = require('../actions/loan-actions');
var common = require('../common');

var LoanRadioInput = React.createClass({
    handleChange: function (e) {
        LoanActions.update(this.props.loan.id, this.props.prop, e.target.value);
    },
    render: function() {
        var buttons = this.props.opts.options.map(function(radio){
            var radioID = 'radio-group-' + this.props.prop + '-' + this.props.loan.id;
            return (
                <div className="inline-radio lc-radio">
                    <input 
                        type="radio" 
                        name={radioID} 
                        id={radioID + radio.label} 
                        value={radio.val} 
                        checked={this.props.loan[this.props.prop] == radio.val}
                        onClick={this.handleChange}/>
                    <label htmlFor={radioID + radio.label}>{radio.label}</label>
                </div>
             );
        }, this);
        return (
            <fieldset className="radio-fieldset input-content">
                {buttons}
            </fieldset>
        );
    }
});

module.exports = LoanRadioInput;