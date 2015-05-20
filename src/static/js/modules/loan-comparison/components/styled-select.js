var React = require('react');
var SelectInput = require('./input-select');

var StyledSelectInput = React.createClass({
    render: function() {
        var className = 'select-content ';
        if (this.props.className) {
            className += this.props.className;
        }
        return (
            <div className={className}>
                <SelectInput {...this.props}/>
            </div>
        );
    }
});

module.exports = StyledSelectInput;