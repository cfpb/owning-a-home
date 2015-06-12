var $ = require('jquery');
var config = require('oah-config');


/**
 * Get data from the API.
 * @param  {object} params Hash of request params.
 * Should include: price, loan_amount, minfico, maxfico,
 * state, rate_structure, loan_term, loan_type, arm_type
 * @return {object} jQuery promise.
 */
function fetch(params) {
  var today = new Date();
  var decache = "" + today.getDate() + today.getMonth();

  return $.ajax({
      type: 'GET',
      url: config.rateCheckerAPI,
      data: $.extend({decache: decache}, params),
      dataType: 'json',
      contentType: "application/json"
  });

};

module.exports = fetch;
