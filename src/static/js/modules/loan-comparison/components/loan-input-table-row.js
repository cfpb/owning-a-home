var $ = jQuery = require('jquery');
var React = require('react');
var common = require('../common');
var LoanInputCell = require('./loan-input-table-cell');
var Tooltip = require('./tooltip');
var outputs = ['loan-amount', 'loan-summary'];


var LoanInputRow = React.createClass({
    propTypes: {
        prop: React.PropTypes.string.isRequired,
        loans: React.PropTypes.array.isRequired,
        scenario: React.PropTypes.object // or null
    },
    
    generateClassName: function (rowType) {
        // shows 'linked' or 'independent' state of row's prop in UI
        var className = rowType;
        
        // adds extra top padding to labels on rows with inputs
        if ($.inArray(this.props.prop, outputs.concat(['points'])) < 0) {
            className += ' padded-row';
        }
        
        // hides the ARM input row if neither of the loans is adjustable
        if (this.props.prop === 'arm-type') {
            var armLoan = this.props.loans[0]['is-arm'] || this.props.loans[1]['is-arm'];
            className += armLoan ? '' : ' hidden';
        }
        
        return className;
    },
    
    generateCells: function (rowType) {
        var loans = this.props.loans;
        var cells = [];
        var outputRow = $.inArray(this.props.prop, outputs) >= 0;
        
        for (var i=0; i< loans.length; i++) {
            
            // add a component cell for each loan
            var componentCell = (
                <LoanInputCell prop={this.props.prop} loan={loans[i]} scenario={this.props.scenario} rowType={rowType}/>
            );
            cells.push(componentCell);
            
            // add a link cell after 1st loan cell
            // output rows don't need to display the icon
            if (i === 0) {
                cells.push(
                    <td className="link">
                        <span className={outputRow ? "" : "cf-icon cf-icon-link"}></span>
                    </td>
                );
            }
        }
        
        return cells;
    },
    
    render: function () {
        var note,
            rowType,
            prop = this.props.prop,
            scenario = this.props.scenario;
        
        if (scenario) {
            // If there's a scenario, an educational note will be associated with all the
            // independent inputs. Get the note for this row's prop, if one exists, & use
            // the note's existence to determine a type, linked or independent, for the row.
            note = (scenario.inputNotes || {})[prop];
            rowType = note ? 'highlight' : 'linked';
        }
        
        return (
            <tr className={this.generateClassName(rowType)}>
                <td className="label-cell">
                    <span className="label-text">{common.getPropLabel(prop)}</span>
                    <Tooltip text={common.inputTooltips[prop]}/>
                </td>
                {this.generateCells(rowType)}
            </tr>
        );
    }
});

module.exports = LoanInputRow;
