var React = require('react');

var Message = React.createClass({
    render: function() {
        var className = this.props.className || '';
        if (this.props.type === 'error') {
            className += " alert-alt";
            role = 'alert';
        }
        return (
            <div role={role} className={className}>
                <span className="msg-text">
                    {this.props.message}
                </span>
            </div>
        );
    }
});

module.exports = Message;
