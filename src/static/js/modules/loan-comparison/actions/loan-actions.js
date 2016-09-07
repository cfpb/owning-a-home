'use strict';

var AppDispatcher = require( '../dispatcher/app-dispatcher' );
var LoanConstants = require( '../constants/loan-constants' );

var LoanActions = {

  /**
   * @param {string} id - The ID of the Loan.
   * @param {string} prop - TODO: Add description.
   * @param {string} val - TODO: Add description.
   */
  update: function( id, prop, val ) {
    AppDispatcher.dispatch( {
      actionType: LoanConstants.UPDATE_LOAN,
      id:         id,
      prop:       prop,
      val:        val
    } );
  },

  /**
   * @param {string} id - TODO: Add description.
   */
  fetchRates: function( id ) {
    AppDispatcher.dispatch( {
      actionType: LoanConstants.UPDATE_RATES,
      id:         id
    } );
  }
};

module.exports = LoanActions;
