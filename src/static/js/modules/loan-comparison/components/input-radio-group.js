var React = require('react');
var common = require('../common');

var RadioGroup = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired
        // items
        // value
    },
    render: function() {
        var props = common.omit(this.props, 'value', 'className', 'onChange');
        // TODO: add children option; improve className handling
        var inputs = this.props.items.map(function (radio){
            var inputId = this.props.name + '-' + radio.val;
            return (
                <div className={this.props.childClassName}>
                    <input type="radio" 
                           id={inputId}
                           value={radio.val} 
                           checked={this.props.value == radio.val}
                           onClick={this.props.onChange}
                           {...props}/>
                    <label htmlFor={inputId}>{radio.label}</label>
                </div>
            );
        }, this);
        return (
            <fieldset className={this.props.className}>
                {inputs}
            </fieldset>
        );
    }
});

module.exports = RadioGroup;