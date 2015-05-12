var React = require('react');
var messages = require('../common').errorMessages;

var ErrorMessage = React.createClass({
  render: function() {
    var message;
    var classStr = 'alert-alt';
    var messageKey = this.props.opts.showMessage(this.props.loan);
    if (messageKey) {
        message = messages[messageKey];
    } else {
        classStr += ' hidden';
    }
    return (
        <div className={classStr} role="alert" >
            <span className="msg-text">
                {message}
            </span>
        </div>
    );
  }
});

module.exports = ErrorMessage;
