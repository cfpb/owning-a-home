var React = require('react');
var common = require('../common');
var LoanInputRow = require('./loan-input-table-row');

var LoanInputTable = React.createClass({
    inputRows: function (rows) {
        return (rows.map(function(prop){
            return <LoanInputRow prop={prop} loans={this.props.loans} scenario={this.props.scenario}/>;
        }, this))
    },
    
    render: function() { 
        var className = "lc-inputs", headerText;

        // if editing a loan, add classes so the inputs will show on mobile
        if (this.props.editing) {
            className += ' mobile-editing mobile-editing-' + this.props.editing;
            headerText = 'You are editing Scenario '  + this.props.editing.toUpperCase();
        }
        
        var saveButton = (
            <a href="#" className="lc-save-link lc-toggle first-save" onClick={this.props.stopEditing}>
                <span className="cf-icon cf-icon-save"></span> 
                Save and close
            </a>
        )
        
        return (
            <div className={className} id="loan-input-container">
                <div className="lc-inputs_header u-show-on-mobile">
                    {headerText}
                </div>
                <div className="lc-inputs_container">
                <table className="unstyled loan-input-table">
                    <tr className="header-row"><th colSpan="5"><h3>1. About you</h3></th></tr>
                    <tr className="subhead-row">
                        <th></th>
                        <th className="input-0"><h4>Scenario A</h4></th>
                        <th className="link"></th>
                        <th className="input-1"><h4>Scenario B</h4></th>
                        <th></th>
                    </tr>
                    {this.inputRows(['state', 'county', 'credit-score'])}
                
                    <tr className="header-row"><th colSpan="5"><h3>2. About the home</h3></th></tr>
                    {this.inputRows(['price', 'downpayment', 'loan-amount'])}

                    <tr className="save-button-row"><td colSpan='5'>{saveButton}</td></tr>

                    <tr className="header-row"><th colSpan="5"><h3>3. About the loan</h3></th></tr>
                    {this.inputRows(['rate-structure', 'arm-type', 'loan-term', 'loan-type', 'loan-summary', 'points'])}                         
                </table>
                </div>
                {saveButton}
            </div>

        );
    }
});

module.exports = LoanInputTable;
