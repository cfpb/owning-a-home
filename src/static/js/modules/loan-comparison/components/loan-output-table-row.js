var React = require('react');
var LoanOutputCell = require('./loan-output-table-cell');

var LoanOutputRow = React.createClass({
    render: function () {
        var loans = this.props.loans.map(function (loan) {
            return (
                <LoanOutputCell loan={loan} prop={this.props.prop} resultType={this.props.resultType} />
            )
        }, this);
        return (
          <tr>
            <th>{this.props.label}</th>
            {loans}
          </tr>
        );
    }
});

var LoanOutputRowPrimaryHeading = React.createClass({
    headingIcon: function(result) {
        var icon = 'cf-icon cf-icon-';
        if (result === 'closing-costs') {
            icon += 'mortgage';
        } else if (result === 'monthly-payment') {
            icon += 'date';
        } else if (result === 'overall-costs') {
            icon += 'owning-home';
        }
        return icon;
    },
    outputType: function(label, type) {
        var th,
            expandable = false;
        if (type === 'primary') {
            th = ''
        } else {
            th ='<th>' + label + '</th>'
        }
        // } else if (type === 'main') {
        //     classes = 'result__main',
        //     heading = 'h5',
        //     expandable = false;
        // } else if (type === 'sub') {
        //     classes = 'result__sub',
        //     heading = 'h5',
        //     expandable = false;
        // }

        // classes + heading + expandable;

        return th;
    },
    render: function() {
        return (
            <th scope="row" className="lc-primary-result-heading">
                <h4 className="results-section-heading">
                    <span className={this.headingIcon(this.props.prop)}></span>&nbsp;
                    {this.props.label}
                </h4>
                <span className="expandable_header-right expandable_link">
                    <span className="expandable_cue-open">
                        <span className="u-visually-hidden">Show</span>
                        <span className="cf-icon cf-icon-plus-round"></span>
                    </span>
                    <span className="expandable_cue-close">
                        <span className="u-visually-hidden">Hide</span>
                        <span className="cf-icon cf-icon-minus-round"></span>
                    </span>
                </span>
            </th>
        )
    }
});

module.exports = LoanOutputRow;