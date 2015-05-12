var AppDispatcher = require('../dispatcher/app-dispatcher');
var LoanConstants = require('../constants/loan-constants');

var LoanActions = {

  /**
   * @param  {string} id The ID of the Loan
   * @param  {string} val
   */
  update: function(id, prop, val) {
    AppDispatcher.dispatch({
      actionType: LoanConstants.UPDATE_LOAN,
      id: id,
      prop: prop, 
      val: val
    });
  },

 

};

module.exports = LoanActions;