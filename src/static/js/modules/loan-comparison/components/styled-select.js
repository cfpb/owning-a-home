var React = require('react');
var SelectInput = require('./input-select');
var common = require('../common');

// adds background image of a down arrow to select
var StyledSelectInput = React.createClass({
    render: function() {
        var className = 'select-content ';
        if (this.props.className) {
            className += this.props.className;
        }
        
        // pass everything through but className
        var props = common.omit(this.props, 'className');
        return (
            <div className={className}>
                <SelectInput {...props}/>
            </div>
        );
    }
});

module.exports = StyledSelectInput;