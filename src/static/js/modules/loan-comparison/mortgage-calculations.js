'use strict';

var positive = require( 'stay-positive' );
var cost = require( 'overall-loan-cost' );
var amortize = require( 'amortize' );
var humanizeLoanType = require( '../humanize-loan-type' );
var common = require( './common' );

var TAX_RATE = 0.01;
var INSURANCE_RATE = 0.005;

var mortgage = {};

mortgage['loan-amount'] = function( loan ) {
  return +Number( loan.price ) - +Number( loan.downpayment ) || 0;
};

mortgage.discount = function( loan ) {
  return ( Number( loan.points ) / 100 ) * loan['loan-amount'];
};

mortgage['downpayment-percent'] = function( loan ) {
  var dp = +Number( loan.downpayment );
  var price = +Number( loan.price );
  return ( dp && price ) ? Math.round( dp / price * 100 ) : 0;
};

mortgage.downpayment = function( loan ) {
  return Math.round( ( +Number( loan['downpayment-percent'] ) / 100 ) * +Number( loan.price ) );
};

mortgage.processing = function( loan ) {
  return loan['loan-amount'] / 100;
};

mortgage['lender-fees'] = function( loan ) {
  return loan.processing + loan.discount || 0;
};

mortgage['third-party-services'] = function( loan ) {
  return 3000;
};

mortgage.insurance = function( loan ) {
  var upfront = ( loan['mtg-ins-data'] || {} ).upfront;
  if ( upfront ) {
    return Math.round( ( upfront / 100 ) * loan['loan-amount'] );
  }
  return 0;
};

mortgage['third-party-fees'] = function( loan ) {
  return loan['third-party-services'] + loan.insurance;
};

mortgage['taxes-gov-fees'] = function( loan ) {
  return 1000;
};

mortgage['prepaid-expenses'] = function( loan ) {
  var prepaidInterest = loan['loan-amount'] * ( loan['interest-rate'] / 100 ) / 365 * 15,
      prepaidInsurance = INSURANCE_RATE * loan.price / 12 * 6;
  return Math.round( prepaidInterest + prepaidInsurance );
};


mortgage['initial-escrow'] = function( loan ) {
  var initialTaxes = TAX_RATE * loan.price / 12 * 2,
      initialInsurance = INSURANCE_RATE * loan.price / 12 * 2;
  return Math.round( initialTaxes + initialInsurance );
};

mortgage['monthly-taxes-insurance'] = function( loan ) {
  var propertyTaxes = ( loan.price / 100 ) / 12,
      homeInsurance = ( INSURANCE_RATE * loan.price ) / 12;
  return propertyTaxes + homeInsurance;
};

mortgage['monthly-hoa-dues'] = function( loan ) {
  return 0;
};

mortgage['monthly-principal-interest'] = function( loan ) {
  return Math.round( amortize( {
    amount: positive( loan['loan-amount'] ),
    rate: loan['interest-rate'],
    totalTerm: loan['loan-term'] * 12,
    // since we are starting a new loan,
    // amortizeTerm is 0, since we haven't make
    // any payment yet
    amortizeTerm: 0
  } ).payment );
};

mortgage['monthly-mortgage-insurance'] = function( loan ) {
  var monthly = ( loan['mtg-ins-data'] || {} ).monthly;
  if ( monthly ) {
    return Math.round( ( monthly / 100 ) * loan['loan-amount'] / 12 );
  }
  return 0;
};

mortgage['monthly-payment'] = function( loan ) {
  return loan['monthly-taxes-insurance'] +
         loan['monthly-mortgage-insurance'] +
         loan['monthly-hoa-dues'] +
         loan['monthly-principal-interest'];
};

mortgage['closing-costs'] = function( loan ) {
  return +loan.downpayment +
          loan.discount +
          loan.processing +
          loan['third-party-services'] +
          loan.insurance +
          loan['taxes-gov-fees'] +
          loan['prepaid-expenses'] +
          loan['initial-escrow'];
};

mortgage['get-cost'] = function( loan ) {
  return cost( {
    amountBorrowed: positive( loan['loan-amount'] ),
    rate: loan['interest-rate'],
    totalTerm: loan['loan-term'] * 12,
    downPayment: +Number( loan.downpayment ),
    closingCosts: +Number( loan['closing-costs'] ) - +Number( loan.downpayment )
  } );
};

mortgage['principal-paid'] = function( loan ) {
  return mortgage['get-cost']( loan ).totalEquity;
};

mortgage['interest-fees-paid'] = function( loan ) {
  return mortgage['get-cost']( loan ).totalCost;
};

mortgage['overall-costs'] = function( loan ) {
  return mortgage['get-cost']( loan ).overallCost;
};

mortgage['loan-summary'] = function( loan ) {
  if ( loan['rate-structure'] === 'arm' ) {
    return ( loan['arm-type'] || '' ).split( '-' ).join( '/' ) + ' ARM';
  }

  var loanType = loan['loan-type'];
  switch ( loanType ) {
    case 'conf':
    case 'fha':
    case 'va':
      loanType = humanizeLoanType( loan['loan-type'] );
      break;
    default:
      loanType = ( common.jumboTypes[loanType] || {} ).label;
  }

  return loan['loan-term'] + '-year ' + loan['rate-structure'] + ' ' + loanType;
};

module.exports = mortgage;
