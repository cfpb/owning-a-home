var React = require('react');
var common = require('../common');
var LoanOutputRow = require('./loan-output-table-row');

var LoanOutputTableMobileGroup = React.createClass({
    render: function() {
        var loans = this.props.loans.map(function (loan) {
            return (
              <LoanOutputTableMobile loan={loan} prop={this.props.prop}/>
            )
        }, this);
        return (
            <div className="mobile-comparison-overviews u-show-on-mobile content_wrapper content_wrapper__narrow">
                {loans}
            </div>
        );
    }
});

var LoanOutputTableMobile = React.createClass({
    render: function() {
        return (
            <div className="mobile-overview">
                <h3 className="comparison-header">Loan A</h3>
                <h4>Loan Amount</h4>
                <p className="loan-amount-display-a">$180,000</p>

                <h4>Loan Type</h4>
                <p><span className="lc-summary-year-a">30</span> year <span className="lc-summary-structure-a">fixed</span> <span className="lc-summary-type-a">conventional</span></p>

                <h4>Points or Credits</h4>
                <p className="discount-a">0</p>

                <h4>Interest Rate</h4>
                <p> <span className="interest-rate-display-a">4.05</span>%</p>
            </div>
        );
    }
});

module.exports = LoanOutputTableMobileGroup;
