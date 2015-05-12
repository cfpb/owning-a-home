var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var ScenarioConstants = require('../constants/scenario-constants');
var assign = require('object-assign');
var common = require('../common');


var CHANGE_EVENT = 'change';

var _activeScenario = common.defaultScenario;

function update(scenario) {
    _activeScenario = scenario ? common.scenarios[scenario] : null;
}

var ScenarioStore = assign({}, EventEmitter.prototype, {
    /**
    * Get active scenario data.
    * @return {object}
    */
    getScenario: function() {
        return _activeScenario;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
    * @param {function} callback
    */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
    * @param {function} callback
    */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// Register callback to handle all updates
ScenarioStore.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.actionType) {

        case ScenarioConstants.UPDATE_SCENARIO:
            update(action.id);
            ScenarioStore.emitChange();
            break;
        
        case ScenarioConstants.CUSTOM_SCENARIO:
            update();
            ScenarioStore.emitChange();
            break;

        default:
        // no op
    }
});

module.exports = ScenarioStore;