var React = require('react');
var common = require('../common');
var TextInput = require('./input-text');

// adds a unit (dollar or percent sign) to input
var StyledTextInput = React.createClass({
    render: function() {
        // pass through everything but className
        var props = common.omit(this.props, 'className');
        return (
            <div className={this.props.className}>
                <span className="unit"></span>
                <TextInput {...props}/>
            </div>
        );
    }
});

module.exports = StyledTextInput;