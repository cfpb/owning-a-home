'use strict';

var $ = require( 'jquery' );
var fetchRates = require( '../rates' );
var fetchMortgageInsurance = require( '../mortgage-insurance' );
var config = require( '../../../../../config/config.json' );

var api = {};

api.fetchCountyData = function( appState ) {
  return $.get( config.countyAPI, {
    state: appState.state
  } );
};

api.fetchRateData = function( loan ) {
  return fetchRates( prepLoanData( loan ) );
};

api.fetchMortgageInsuranceData = function( loan ) {
  return fetchMortgageInsurance( prepLoanDataForMtgIns( loan ) );
};

api.stopRequest = function( dfd ) {
  if ( dfd && typeof dfd === 'object' ) {
    dfd.abort();
  }
};

function prepBaseLoanData( loan ) {
  var minfico = parseInt( loan['credit-score'], 10 ) || 0;
  return {
    price:          loan.price,
    loan_amount:    loan['loan-amount'],
    minfico:        minfico,
    maxfico:        minfico + ( minfico === 840 ? 10 : 19 ),
    rate_structure: loan['rate-structure'],
    loan_term:      loan['loan-term'],
    loan_type:      loan['loan-type'],
    arm_type:       loan['arm-type']
  };
}
function prepLoanData( loan ) {
  var loandata = prepBaseLoanData( loan );
  loandata.state = loan.state;
  loandata.points = loan.points;

  return loandata;
}

function prepLoanDataForMtgIns( loan ) {
  var loandata = prepBaseLoanData( loan );
  // @TODO: These are placeholders for the VA parameters, need to revisit.
  loandata.va_status = 'REGULAR';
  loandata.va_first_use = 1;

  return loandata;
}

module.exports = api;
