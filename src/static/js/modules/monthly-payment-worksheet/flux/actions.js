var MPWDispatcher = require('./dispatcher.js');
var MPWConstants = require('./constants.js');

var MPWActions = {
  /**
   * @param  {string} prop changed prop
   * @param  {string} val new val
   */
  update: function(prop, val) {
    MPWDispatcher.dispatch({
      actionType: MPWConstants.UPDATE,
      prop: prop, 
      val: val
    });
  }
};

module.exports = MPWActions;