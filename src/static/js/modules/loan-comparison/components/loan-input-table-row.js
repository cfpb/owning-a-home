var $ = jQuery = require('jquery');
var React = require('react');
var common = require('../common');
var LoanInputCell = require('./loan-input-table-cell');
var Tooltip = require('./tooltip');
var EducationalNote = require('./educational-note');

var outputs = ['loan-amount', 'loan-summary'];


var LoanInputRow = React.createClass({
    propTypes: {
        prop: React.PropTypes.string.isRequired,
        loans: React.PropTypes.array.isRequired,
        scenario: React.PropTypes.object // or null
    },
    
    generateClassName: function (rowType, outputRow) {
        // shows 'linked' or 'independent' state of row's prop in UI
        var className = rowType + ' ' +  this.props.prop + '-row';
        
        // adds extra top padding to labels on rows with inputs
        if ($.inArray(this.props.prop, outputs.concat(['points'])) < 0) {
            className += ' padded-row';
        }
        
        // styles label text on output rows
        if (outputRow) {
            className += ' output-row';
        }
                
        // hides the ARM input row if neither of the loans is adjustable
        if (this.props.prop === 'arm-type') {
            var armLoan = this.props.loans[0]['rate-structure'] === 'arm' || this.props.loans[1]['rate-structure'] === 'arm';
            className += armLoan ? '' : ' hidden';
        }
        
        return className;
    },
    
    generateCells: function (rowType, outputRow) {
        var loans = this.props.loans;
        var cells = [];
        
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
            noteHtml,
            rowType,
            prop = this.props.prop,
            scenario = this.props.scenario,
            label = common.getPropLabel(prop),
            outputRow = $.inArray(prop, outputs) >= 0;
        
        if (scenario) {
            // If there's a scenario, an educational note will be associated with all the
            // independent inputs. Get the note for this row's prop, if one exists, & use
            // the note's existence to determine a type, linked or independent, for the row.
            note = (scenario.inputNotes || {})[prop];
            noteHtml = note ? (<EducationalNote label={label} note={note} type='input'/>) : null;
            rowType = note ? 'highlight' : 'linked';
        }
        
        return (
            <tr className={this.generateClassName(rowType, outputRow)}>
                <td className="label-cell">
                    <div className="label-text" dangerouslySetInnerHTML={{__html: label}}></div>
                    <Tooltip text={common.inputTooltips[prop]}/>
                </td>
                {this.generateCells(rowType, outputRow)}
                <td className="educational-note">{noteHtml}</td>
            </tr>
        );
    }
});

module.exports = LoanInputRow;
