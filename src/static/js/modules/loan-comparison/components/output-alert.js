var React = require('react');

var OutputAlert = React.createClass({
    render: function() {

        return (
            <div className="output-alert" role="alert">
              <p>We are loading your costs.</p>
              <img src="http://www.consumerfinance.gov/hmda/static/img/icon_spinner.gif"/>
            </div>
        );
    }
});

module.exports = OutputAlert;