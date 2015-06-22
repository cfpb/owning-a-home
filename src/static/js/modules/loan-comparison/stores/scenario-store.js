var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var ScenarioConstants = require('../constants/scenario-constants');
var assign = require('object-assign');
var common = require('../common');

var CHANGE_EVENT = 'change';

var _activeScenario = findScenario('downpayment');

function findScenario (id) {
    var scenario;
    for (var i = 0; i < common.scenarios.length; i++) {
        if (common.scenarios[i].val === id) {
            scenario = common.scenarios[i];
        }
    }
    return scenario;
}

function update(scenario) {
    _activeScenario = scenario ? findScenario(scenario) : null;
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

        default:
        // no op
    }
});

module.exports = ScenarioStore;