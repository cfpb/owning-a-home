var React = require('react');
var common = require('../common');
var LoanOutputRow = require('./loan-output-table-row');
var LoanOutput = require('./loan-output');
var InterestRateInput = require('./loan-input-interest-rate');


var LoanOutputTableMobileGroup = React.createClass({
    render: function() {
        var loans = this.props.loans.map(function (loan) {
            return (
              <LoanOutputTableMobile loan={loan} prop={this.props.prop} startEditing={this.props.startEditing} editing={this.props.editing}/>
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
    handleClick: function (e) {
        e.preventDefault();
        this.props.startEditing(this.props.loan.name);
    },
    render: function() {
        var loan = this.props.loan;
        var loanName = loan.name;
        return (
            <div className="mobile-overview">
                <h3 className="comparison-header">Scenario {loanName.toUpperCase()}</h3>
                
                <h4>Loan Amount</h4>
                <p className={"loan-amount-display-" + loanName}>
                    <LoanOutput prop='loan-amount' loan={loan}/>
                </p>

                <h4>Loan Type</h4>
                <p>
                    <LoanOutput prop='loan-summary' loan={loan}/>
                </p>

                <h4>Points or Credits</h4>
                <p className={"discount-" + loanName}>
                    <LoanOutput prop='points' loan={loan}/>
                </p>
                
                {!this.props.editing &&
                    <a href='#' 
                       className="lc-edit-link lc-toggle"
                       onClick={this.handleClick}>
                        Customize <span className="cf-icon cf-icon-edit"></span>
                    </a>
                }
                
            </div>
        );
    }
});

module.exports = LoanOutputTableMobileGroup;
