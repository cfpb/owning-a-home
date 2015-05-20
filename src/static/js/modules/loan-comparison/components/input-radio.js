var React = require('react');
var common = require('../common');

var RadioInput = React.createClass({
    render: function() {
        var buttons = this.props.options.map(function(radio){
            return (
                <div className="inline-radio lc-radio">
                    <input 
                        type="radio" 
                        name={this.props.componentID} 
                        id={this.props.componentID + radio.label} 
                        value={radio.val} 
                        checked={this.props.val == radio.val}
                        onClick={this.props.handleChange}/>
                    <label htmlFor={this.props.componentID + radio.label}>{radio.label}</label>
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

module.exports = RadioInput;