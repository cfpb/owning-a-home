var AppDispatcher = require('../dispatcher/app-dispatcher');
var ScenarioConstants = require('../constants/scenario-constants');

var ScenarioActions = {
  /**
   * @param  {string} id The ID of the scenario
   */
  update: function(id) {
    AppDispatcher.dispatch({
      actionType: ScenarioConstants.UPDATE_SCENARIO,
      id: id
    });
  }
};

module.exports = ScenarioActions;