var React = require('react');

var Tooltip = React.createClass({
    render: function () {
        return (
          <span>
            <span className="lc-tooltip" data-toggle="tooltip" role="tooltip" data-original-title="" title="">
                  <span className="cf-icon cf-icon-help-round"></span>
            </span>
            <span className="help-text">
                {this.props.text}
            </span>
          </span>
        );
    }
});

module.exports = Tooltip;