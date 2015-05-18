var React = require('react');
var LoanStore = require('../stores/loan-store');
var ScenarioStore = require('../stores/scenario-store');
var LoanInputTable = require('./loan-input-table');
var ScenarioPicker = require('./scenario-picker');
var ScenarioHeader = require('./scenario-header');

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
        title: function getTooltipTitle(){
            return $(this).attr('title') || $(this).next('.help-text').html() || 'Tooltip information.';
        }
    });
  },
  
  componentWillUnmount: function() {
    LoanStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
        <div>
            <ScenarioPicker scenario={this.state.scenario}/>
            <div className="block block__border-top block__padded-top">
                <ScenarioHeader scenario={this.state.scenario}/>
                <div className="content-l">
                    <div className="content-l_col content-l_col-3-4">
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