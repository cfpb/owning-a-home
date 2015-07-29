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
    init: function () {
        LoanStore.init();
    },

    getInitialState: function() {
        this.init();
        return this.getAppState();
    },
  
    getAppState: function () {
        return {
            loans: LoanStore.getAll(),
            scenario: ScenarioStore.getScenario()
        }
    },
    
    componentDidMount: function() {
        var scenario = this.state.scenario;
        var animating; 
        
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
    
    startMobileEditing: function (loanName) {
        // We use the alphabetical loan name instead of loan id to keep track
        // of loan being edited for a couple of reasons: 
        // 1. Testing for existence of 0 as a value is complicated, &
        // 2. We need to show the name of the loan being edited in the input table section
        this.setState({
            editing: loanName
        });
    },
    
    stopMobileEditing: function (e) {
        e.preventDefault();
        this.setState({
            editing: null
        });
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
                            <LoanOutputTableMobileGroup loans={this.state.loans} editing={this.state.editing} scenario={this.state.scenario} startEditing={this.startMobileEditing}/>
                            <LoanInputTable loans={this.state.loans} scenario={this.state.scenario} editing={this.state.editing} stopEditing={this.stopMobileEditing}/>
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