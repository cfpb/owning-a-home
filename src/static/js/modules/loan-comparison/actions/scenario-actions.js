'use strict';

var AppDispatcher = require( '../dispatcher/app-dispatcher' );
var ScenarioConstants = require( '../constants/scenario-constants' );

/**
 * @param {string} id - The ID of the scenario.
 */
function update( id ) {
  AppDispatcher.dispatch( {
    actionType: ScenarioConstants.UPDATE_SCENARIO,
    id:         id
  } );
}

module.exports = { update: update };
