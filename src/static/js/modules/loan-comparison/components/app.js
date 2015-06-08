var React = require('react');
var debounce = require('debounce');

var LoanStore = require('../stores/loan-store');
var ScenarioStore = require('../stores/scenario-store');
var LoanInputTable = require('./loan-input-table');
var ScenarioSection = require('./scenario-section');
var LoanOutputTableGroup = require('./loan-output-table');
var LoanOutputTableMobileGroup = require('./loan-output-table-mobile');
var ScenarioHeader = require('./scenario-header');
var NextSteps = require('./next-steps');
var positionNotes = require('../position-notes');

var $ = jQuery = require('jquery');
require('tooltips');

var App = React.createClass({

    getInitialState: function() {
        return this.getAppState();
    },
  
    getAppState: function () {
        return {
            loans: LoanStore.getAll(),
            scenario: ScenarioStore.getScenario()
        }
    },
    
    componentDidMount: function() {
        LoanStore.addChangeListener(this._onChange);
        // tooltips
        $(this.getDOMNode()).tooltip({
            selector: '[data-toggle="tooltip"]',
            'placement': 'bottom', 
            container: 'body',
            title: function getTooltipTitle(){
                return $(this).attr('title') || $(this).next('.help-text').html() || 'Tooltip information.';
            }
        });
        $('.expandable').expandable();
        
        var animating, scenario = this.state.scenario;

        // initial positioning of educational notes
        if (scenario) {
            positionNotes();
        }
        
        $(window).resize(debounce(function () {
            if (scenario) {
                positionNotes(animating);
            }
        }, 100));
        
        // reposition notes on start of expand event
        // and (approximate) completion of expandable animation
        // (could also update cf-expandable to allow callbacks)
        $('.expandable_target').click(function () {
            if (scenario) {
                var $parent = $(this).closest('.expandable');
                animating = true;
                positionNotes(animating, $parent);

                setTimeout(function () {
                    animating = false;
                    positionNotes(animating, $parent);
                }, 1000);
            }
        });
    },
  
    componentWillUnmount: function() {
        LoanStore.removeChangeListener(this._onChange);
    },
    
    componentDidUpdate: function () {
        if (this.state.scenario) {
            positionNotes();
        }
    },

    render: function() {
        return (
          <div>
            
            <div>
                <ScenarioSection scenario={this.state.scenario}/>
                <div className="block block__border-top block__padded-top" id="loans-container">
                    <ScenarioHeader scenario={this.state.scenario}/>
                    <div className="content-l">
                        <div className="content-l_col content-l_col-3-4">
                            <LoanOutputTableMobileGroup loans={this.state.loans} scenario={this.state.scenario} />
                            <div className="lc-inputs" id="loan-input-container">
                                <a href="#lc-input-0" className="lc-save-link lc-toggle first-save">
                                    <span className="cf-icon cf-icon-save"></span> 
                                    Save inputs
                                </a>
                                <LoanInputTable loans={this.state.loans} scenario={this.state.scenario}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="content-l content-l__large-gutters">
                    <h3 className="content-l_col content-l_col-1-2 outputs-heading">Based on the information above, here are the projected costs.</h3>
                </div>
                <LoanOutputTableGroup loans={this.state.loans} scenario={this.state.scenario} />
            </div>
            <NextSteps scenario={this.state.scenario}/>
          </div>
        );
    },
 
  /**
   * Event handler for 'change' events coming from the Stores
   */
    _onChange: function() {
        this.setState(this.getAppState());
  }

});

module.exports = App;