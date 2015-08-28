var React = require('react');

var EducationalNote = React.createClass({
    render: function() {
        return (
            <div className={this.props.type}>
                <h5>
                    {this.props.label}
                </h5>
                <p className="u-mb0">
                    {this.props.note}
                </p>
            </div>
        );
    }
});

module.exports = EducationalNote;