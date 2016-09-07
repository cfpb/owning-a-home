'use strict';

var $ = require( 'jquery' );
var assign = require( 'object-assign' );

var jumbo = require( 'jumbo-mortgage' );

var AppDispatcher = require( '../dispatcher/app-dispatcher' );
var EventEmitter = require( 'events' ).EventEmitter;
var LoanConstants = require( '../constants/loan-constants' );
var ScenarioConstants = require( '../constants/scenario-constants' );
var ScenarioStore = require( './scenario-store' );
var mortgageCalculations = require( '../mortgage-calculations' );
var common = require( '../common' );
var api = require( '../api' );

var CHANGE_EVENT = 'change';

var LoanStore = assign( {}, EventEmitter.prototype, {

  _loans: [],

  downpaymentConstant: 'downpayment-percent',

  init: function() {
    this.resetAllLoans();
  },

  /**
   * Reset all loans.
   * On app start or when a new scenario has been entered,
   * create/update loans & update downpayment mode.
   *
   */
  resetAllLoans: function() {
    var len = this._loans.length || common.loanCount;
    var scenario = ScenarioStore.getScenario();

    if ( this._loans.length === 0 || scenario ) {
      this.updateDownpaymentConstant( scenario );
      for ( var i = 0; i < len; i++ ) {
        this._loans[i] = this.resetLoan( i, this._loans[i], scenario );
      }
    }
  },

  /**
   * Resets a loan's properties.
   * Also runs methods to update dependencies/validations/calculations,
   * and initiates api requests.
   *
   * @param  {number} id - TODO: Enter description.
   * @param  {Object} loan - TODO: Enter description.
   * @param  {Object} [scenario] - TODO: Enter description.
   * @returns {Object} loan
   */
  resetLoan: function( id, loan, scenario ) {
    loan = LoanStore.setupLoanData( id, loan || {}, scenario );
    LoanStore.setLoanName( loan );

    // ensure downpayment percent because default data only has downpayment
    if ( !loan['downpayment-percent'] ) {
      LoanStore.updateCalculatedValues( loan, 'downpayment-percent' );
    }
    LoanStore.updateCalculatedValues( loan, [ 'loan-amount', 'loan-summary' ] );
    LoanStore.validateLoan( loan );
    LoanStore.fetchLoanData( loan );
    // TODO: add county request as option to fetchLoanData?
    LoanStore.fetchCounties( loan, true );

    return loan;
  },

  /**
   * Gets letter of alphabet that corresponds with loan index
   * and sets it as name of loan.
   * @param  {Object} loan - TODO: Enter description.
   */
  setLoanName: function( loan ) {
    loan.name = String.fromCharCode( 97 + loan.id );
  },

  /**
   * Sets up a loan object using a combination of default loan data,
   * existing loan data, and data specific to the current scenario.
   * If there's a scenario, loans will have the same values for
   * all properties except scenario-specific ones, so we use the
   * first loan's data as existingData for loan 2+ (omitting id & api requests)
   *
   * @param  {number} id - TODO: Enter description.
   * @param  {Object} loan - TODO: Enter description.
   * @param  {Object} [scenario] - TODO: Enter description.
   * @returns  {Object} loan
   */
  setupLoanData: function( id, loan, scenario ) {
    var defaultData = common.defaultLoanData;
    var scenarioData = scenario ? scenario.loanProps[id] : {};
    var existingData = scenario && id > 0 ?
                       common.omit( this._loans[0], 'id', 'name', 'rate-request', 'mtg-ins-request', 'county-request' ) :
                       loan;

    return assign( { id: id }, defaultData, existingData, scenarioData );
  },

  /**
   * Update all loans.
   * @param  {string} prop Loan prop to update.
   * @param  {string|number} val value.
   */
  updateAllLoans: function( prop, val ) {
    for ( var i = 0; i < this._loans.length; i++ ) {
      this.updateLoan( this._loans[i], prop, val );
    }
  },

  /**
   * Updates a property on the loan with value that has been standardized.
   * Also updates dependencies & calculated properties.
   * If the changed property is not 'interest-rate', validates the loan.
   * If the changed prop is not 'interest-rate' or 'county', fetches loan data.
   *
   * @param  {object} loan loan to update.
   * @param  {string} prop loan prop to update.
   * @param  {string|number} val new value.
   */
  updateLoan: function( loan, prop, val ) {
    loan[prop] = val;
    loan.edited = prop !== 'interest-rate' && prop !== 'county';

    this.updateLoanDependencies( loan, prop );

    if ( prop !== 'interest-rate' ) {
      // validation needs to come before calculations, because some of the
      // validations change properties needed to calculate loan summary
      this.validateLoan( loan );

      if ( prop !== 'county' ) {
        // TODO: consider debouncing
        this.fetchLoanData( loan );
      }
    }

    this.updateLoanCalculations( loan, prop );
  },

  /**
   * Downpayment scenario always needs to start with
   * downpayment-percent as constant.
   * (There may be need to change the constant for future
   * scenarios as well.)
   * @param  {string} scenario - TODO: Enter description.
   */
  updateDownpaymentConstant: function( scenario ) {
    if ( ( scenario || {} ).val === 'downpayment' ) {
      this.downpaymentConstant = 'downpayment-percent';
    }
  },

  /**
   * Called when price or one of the downpayment values changes.
   * Updates global downpaymentConstant to reflect last changed
   * downpayment property, and updates dependent downpayment property
   * to reflect any changes to price or constant downpayment value.
   * Also recalculates loan-amount to reflect changed price or downpayment.
   *
   * @param  {Object} loan - TODO: Enter description.
   * @param  {string} prop - Changed property.
   */
  updateDownpaymentDependencies: function( loan, prop ) {
    // update downpaymentConstant when one of the downpayment values is changed
    if ( prop === 'downpayment' || prop === 'downpayment-percent' ) {
      this.downpaymentConstant = prop;
    }

    // update downpayment or downpayment-percent, dep. on downpaymentConstant
    if ( this.downpaymentConstant === 'downpayment-percent' ) {
      this.updateCalculatedValues( loan, 'downpayment' );
    } else {
      this.updateCalculatedValues( loan, 'downpayment-percent' );
    }

    // update loan amount
    this.updateCalculatedValues( loan, 'loan-amount' );
  },

  /**
   * Targeted update of loan dependencies based on the prop that has changed:
   * for downpayment/price props, calls updateDownpaymentDependencies;
   * for state, calls resetCounty.
   *
   * @param  {Object} loan - TODO: Enter description.
   * @param  {string} prop - Changed property.
   */
  updateLoanDependencies: function( loan, prop ) {
    if ( $.inArray( prop, [ 'downpayment', 'downpayment-percent', 'price' ] ) > -1 ) {
      this.updateDownpaymentDependencies( loan, prop );
    } else if ( prop === 'state' ) {
      this.resetCounty( loan );
    }
  },

  /**
   * Targeted update of loan calculations based on the prop that has changed:
   * for loan type/term/rate-structure, calls updateCalculatedValues for 'loan-summary';
   * for interest-rate, calls updateCalculatedValues for calculatedPropertiesBasedOnIR.
   *
   * @param  {Object} loan - TODO: Enter description.
   * @param  {string} prop - Changed property.
   */
  updateLoanCalculations: function( loan, prop ) {
    if ( $.inArray( prop, [ 'loan-type', 'loan-term', 'rate-structure', 'arm-type' ] ) > -1 ) {
      this.updateCalculatedValues( loan, 'loan-summary' );
    } else if ( prop === 'interest-rate' ) {
      this.updateCalculatedValues( loan, common.calculatedPropertiesBasedOnIR );
    }
  },

  /**
   * Resets county data & calls fetchCounties.
   *
   * @param {Object} loan - TODO: Enter description.
   */
  resetCounty: function( loan ) {
    loan.county = null;
    loan.counties = null;
    loan['county-dict'] = null;
    LoanStore.fetchCounties( loan );
  },

  /**
   * Checks loan object for an existing request stored under requestName.
   * If request is found, cancels request and sets requestName property to null.
   *
   * @param  {object} loan - TODO: Enter description.
   * @param  {string} requestName - TODO: Enter description.
   */
  cancelExistingRequest: function( loan, requestName ) {
    if ( loan[requestName] ) {
      api.stopRequest( loan[requestName] );
      loan[requestName] = null;
    }
  },

  /**
   * Cancels any existing requests on loan, then fetches
   * mortgage insurance & interest rate data from api and
   * handles success/failure when both requests have completed.
   *
   * @param {Object} loan - Loan to update.
   */
  fetchLoanData: function( loan ) {
    // Check to see if request is happening at this point, if so, abort them
    // before starting this new request
    LoanStore.cancelExistingRequest( 'rate-request' );
    LoanStore.cancelExistingRequest( 'mtg-ins-request' );

    loan['rate-request'] = LoanStore.fetchRates( loan );
    loan['mtg-ins-request'] = LoanStore.fetchInsurance( loan );

    $.when( loan['rate-request'], loan['mtg-ins-request'] )
      .done( function() {
        LoanStore.updateLoanCalculations( loan, 'interest-rate' );
      } )
      .fail( function() {
        // can't update calculated properties
        // show error state
      } )
      .always( function() {
        loan['rate-request'] = null;
        loan['mtg-ins-request'] = null;
        LoanStore.emitChange();
      } );
  },

  /**
   * Fetches mortgage insurance data from api for a loan,
   * and updates loan with results data on success.
   *
   * @param  {Object} loan - TODO: Enter description.
   * @returns {Object} Insurance request.
   */
  fetchInsurance: function( loan ) {
    return api.fetchMortgageInsuranceData( loan )
              .done( function( results ) {
                LoanStore.updateLoanInsurance( loan, ( results || {} ).data );
              } );
  },

  /**
   * Sets insurance data on loan.
   *
   * @param  {Object} loan - TODO: Enter description.
   * @param  {Object} data - Mortgage insurance data from api.
   */
  updateLoanInsurance: function( loan, data ) {
    loan['mtg-ins-data'] = data;
  },

  /**
   * Fetches interest rate data from api for a loan,
   * and updates loan with results data on success.
   *
   * @param   {Object} loan - TODO: Enter description.
   * @returns {Object} Rates request.
   */
  fetchRates: function( loan ) {
    return api.fetchRateData( loan )
              .done( function( results ) {
                LoanStore.updateLoanRates( loan, ( results || {} ).data );
              } );
  },

  /**
   * Sets interest rate & array of rate options.
   *
   * @param  {Object} loan - TODO: Enter description.
   * @param  {Object} data - Interest rates array from api.
   */
  updateLoanRates: function( loan, data ) {
    var rates = this.processRatesData( data );
    loan.rates = rates.vals;
    this.updateLoan( loan, 'interest-rate', rates.median );
  },

  /**
   * Processes interest rate data from api.
   * Finds actual median value from api rates array
   * by using frequency data to construct a total rates array.
   * Generates an array of rate options objects for use in dropdown.
   * @param   {Array} data - TODO: Enter description.
   * @returns {Object} obj containing median rate & rate options
   */
  processRatesData: function( data ) {
    // data: [rate: frequency, rate: frequency,...]
    data = data || {};
    var rates = [];
    var totalRates = [];
    var medianRate;
    var processedRates;

    for ( var key in data ) {
      if ( data.hasOwnProperty( key ) ) {
        rates.push( key );
        var len = data[key];
        for ( var i = 0; i < len; i++ ) {
          totalRates.push( key );
        }
      }
    }
    medianRate = common.median( totalRates ) || 0;

    rates = rates.sort();
    processedRates = $.map( rates, function( rate, i ) {
      return { val: Number( rate ), label: rate + '%' };
    } );

    return { vals: processedRates, median: Number( medianRate ) };
  },

  /**
   * Checks the current value of a loan's property against the list
   * of disallowed values for that property in ARM loan scenarios.
   * Returns true if disallowed, false if allowed.
   *
   * @param   {string} prop - Loan property.
   * @param   {Object} loan - TODO: Enter description.
   * @returns {boolean} Whether the current value for loan[prop] is disallowed in ARM scenarios.
   */
  isDisallowedArmOption: function( prop, loan ) {
    var isArm = loan['rate-structure'] === 'arm';
    var val = prop === 'loan-term' ? +Number( loan[prop] ) : loan[prop];
    var disallowedOpts = common.armDisallowedOptions[prop];
    return isArm && $.inArray( val, disallowedOpts ) >= 0;
  },

  /**
   * Sets the value of one or more loan properties to the value returned
   * by running the mortgageCalculations function for that property on the loan.
   *
   * @param   {Object} loan - TODO: Enter description.
   * @param   {Array|string} props
   *   Name of property or array of property names.
   * @returns {Object} Updated loan object.
   */
  updateCalculatedValues: function( loan, props ) {
    props = $.isArray( props ) ? props : [ props ];
    for ( var i = 0; i < props.length; i++ ) {
      var prop = props[i];
      loan[prop] = mortgageCalculations[prop]( loan );
    }
    return loan;
  },

  /**
   * Validator functions for loan properties.
   */
  validators: {
    'loan-type': function( loan ) {
      if ( LoanStore.isDisallowedArmOption( 'loan-type', loan ) ) {
        loan['loan-type'] = 'conf';
        return common.errorMessages['loan-type'];
      }
    },
    'loan-term': function( loan ) {
      if ( LoanStore.isDisallowedArmOption( 'loan-term', loan ) ) {
        loan['loan-term'] = 30;
        return common.errorMessages['loan-term'];
      }
    },
    'downpayment': function( loan ) {
      if ( LoanStore.isDownpaymentTooHigh( loan ) ) {
        return common.errorMessages['downpayment-too-high'];
      } else if ( LoanStore.isDownpaymentTooLow( loan ) ) {
        return common.errorMessages['downpayment-too-low-' + loan['loan-type']];
      }
    }
  },

  /**
   * Runs series of validations on loan & updates
   * loan's errors object with any resulting error messages.
   *
   * @param  {Object} loan - TODO: Enter description.
   */
  validateLoan: function( loan ) {
    loan.errors = {};
    $.each( this.validators, function( prop, validator ) {
      var err = validator( loan );
      if ( err ) {
        loan.errors[prop] = err;
      }
    } );

    this.jumboCheck( loan );
  },

  /**
   * Checks whether loan downpayment is higher than price.
   *
   * @param  {Object} loan - TODO: Enter description.
   * @returns {boolean}  - TODO: Enter description.
   */
  isDownpaymentTooHigh: function( loan ) {
    return +loan.downpayment > +Number( loan.price );
  },

  /**
   * Checks whether loan downpayment is too low, using
   * different minimum value based on loan type.
   *
   * @param  {Object} loan - TODO: Enter description.
   * @returns {boolean} - TODO: Enter description.
   */
  isDownpaymentTooLow: function( loan ) {
    switch ( loan['loan-type'] ) {
      case 'conf':
        return +Number( loan.downpayment ) < common.minDownpaymentPcts.conf * +Number( loan.price );
      case 'fha':
        return +Number( loan.downpayment ) < common.minDownpaymentPcts.fha * +Number( loan.price );
      default:
        return false;
    }
  },

  /**
   * Checks whether loan is jumbo.
   *
   * @param   {Object} loan - TODO: Enter description.
   */
  jumboCheck: function( loan ) {
    var newType;
    var loanType = loan['loan-type'];

    // make sure we have a previous type
    loan['previous-type'] = common.jumboTypes[loanType] ? loan['previous-type'] : loanType;

    loan['disallowed-types'] = [];
    // run jumbo test
    var jumboTest = LoanStore.runJumboTest( loan );
    if ( jumboTest.success ) {
      // success means that we had the data we needed to assess whether
      // this is a jumbo loan
      if ( jumboTest.isJumbo ) {
        // if it is a jumbo loan, update the loan type based on the test results,
        // and show the county dropdown & any error message the test returned
        loan['need-county'] = true;
        loan.errors['loan-type'] = jumboTest.msg;
        newType = ( jumboTest.type !== loanType ) ? jumboTest.type : null;
        loan['disallowed-types'] = [ loan['previous-type'] ];
      } else if ( common.jumboTypes[loanType] ) {
        // if it's not a jumbo loan, reset if it used to be a jumbo
        // by hiding the county dropdown & changing the loan type --
        // to previous-type, if one was stored, otherwise to 'conf'
        loan['need-county'] = false;
        newType = loan['previous-type'] || 'conf';
        loan['previous-type'] = null;
      }
      // if the loan type was changed, call updateLoan to update dependencies &
      // run validations based on new loan type
      if ( newType ) {
        LoanStore.updateLoan( loan, 'loan-type', newType );
      }
    } else if ( jumboTest.needCounty ) {
      // If the test fails because we need county data we don't have,
      // update the error messaging & start fetching data if fetch not in progress.
      loan['need-county'] = true;
      loan.errors.county = common.errorMessages['need-county'];
      // We probably want to handle county request failure in this scenario.
      if ( !loan.counties && !loan['county-request'] ) {
        LoanStore.fetchCounties( loan );
      }
    }
  },

  /**
   * Generates params & then jumbo() function on this loan.
   *
   * @param  {object} loan - TODO: Enter description.
   * @returns {Object} Result of jumbo() function.
   */
  runJumboTest: function( loan ) {
    var params = this.getJumboParams( loan );
    return jumbo( params ) || {};
  },

  /**
   * Generates params for the jumbo test function for a given loan.
   * Base params = {loan-type:'...', loan-amount:'...'}
   * If there is a county value on the loan, runs the getCountyParams
   * function and adds its results to the base params object.
   *
   * @param  {Object} loan - TODO: Enter description.
   * @returns {Object} Params object.
   */
  getJumboParams: function( loan ) {
    var loanType = loan['loan-type'];

    if ( common.jumboTypes[loanType] ) {
      loanType = loan['previous-type'] || 'conf';
    }

    var params = {
      loanType: loanType,
      loanAmount: loan['loan-amount']
    };
    var countyParams = this.getCountyParams( loan );

    assign( params, countyParams );

    return params;
  },

  /**
   * Locates loan.county in loan['county-dict'], and
   * generates a county params object using the county's data.
   *
   * @param {Object} loan - TODO: Enter description.
   * @returns {Object} TODO: Enter description.
   */
  getCountyParams: function( loan ) {
    var params;
    var county = loan.county;
    var dict = loan['county-dict'];
    if ( county && dict ) {
      var countyData = dict[county];
      if ( countyData && typeof countyData == 'object' ) {
        params = {
          gseCountyLimit: parseInt( countyData.gse_limit, 10 ),
          fhaCountyLimit: parseInt( countyData.fha_limit, 10 ),
          vaCountyLimit: parseInt( countyData.va_limit, 10 )
        };
      }
    }

    return params;
  },

  /**
   * Fetches county data & on success calls updateLoanCounties.
   *
   * @param  {Object} loan - TODO: Enter description.
   * @param  {Object} initialRequest - TODO: Enter description.
   */
  fetchCounties: function( loan, initialRequest ) {
    LoanStore.cancelExistingRequest( loan, 'county-request' );
    loan['county-request'] =
      api.fetchCountyData( loan )
        .done( function( results ) {
          var counties = ( results || {} ).data;
          LoanStore.updateLoanCounties( loan, counties, initialRequest );
        } )
        .always( function() {
          loan['county-request'] = null;
          LoanStore.emitChange();
        } );
  },

  /**
   * Updates loan county data.
   *
   * Stores county array as loan.counties.
   *
   * Generates a county dict object using 'complete_fips' as key and
   * stores this as loan['county-dict'] (Enables quick lookup of county
   * data for jumbo loan check).
   *
   * Also sets first county in counties array as loan[county]
   * (via updateLoan so that validations will be run).
   *
   * @param {Object} loan - TODO: Enter description.
   * @param {Array} data - TODO: Enter description.
   * @param {Object} initialRequest - TODO: Enter description.
   */
  updateLoanCounties: function( loan, data, initialRequest ) {
    var dict = {};

    if ( $.isArray( data ) ) {
      $.each( data, function( num, i ) {
        dict[i.complete_fips] = i;
      } );
      loan['county-dict'] = dict;
      loan.counties = data;
      // TODO: Determine if this commented out code block can be removed.
      // if (initialRequest) {
      //     this.updateLoan(loan, 'county', data[0]['complete_fips']);
      // }
    }
  },

  /**
   * Checks whether a loan property is linked in current scenario.
   *
   * @param  {string} prop - TODO: Enter description.
   * @returns {boolean} TODO: Enter description.
   */
  isPropLinked: function( prop ) {
    var scenario = ScenarioStore.getScenario();
    return scenario && $.inArray( prop, scenario.independentInputs ) === -1;
  },

  /**
   * Get the entire collection of loans.
   * @returns {Object} TODO: Enter description.
   */
  getAll: function() {
    return this._loans;
  },

  emitChange: function() {
    this.emit( CHANGE_EVENT );
  },

  /**
  * @param {Function} callback - TODO: Enter description.
  */
  addChangeListener: function( callback ) {
    this.on( CHANGE_EVENT, callback );
  },

  /**
  * @param {Function} callback - TODO: Enter description.
  */
  removeChangeListener: function( callback ) {
    this.removeListener( CHANGE_EVENT, callback );
  }
} );

// Register callback to handle all updates
LoanStore.dispatchToken = AppDispatcher.register( function( action ) {
  switch( action.actionType ) {

    case LoanConstants.UPDATE_LOAN:
      // update both loans or single loan, dep. on whether the prop changed
      // is independent or linked in the current scenario
      if ( LoanStore.isPropLinked( action.prop ) ) {
        LoanStore.updateAllLoans( action.prop, action.val );
      } else {
        LoanStore.updateLoan( LoanStore._loans[action.id], action.prop, action.val );
      }
      LoanStore.emitChange();
      break;

    case LoanConstants.UPDATE_ALL:
      LoanStore.updateAllLoans( action.prop, action.val );
      LoanStore.emitChange();
      break;

    case LoanConstants.UPDATE_RATES:
      var id = action.id;
      var loans = LoanStore._loans;
      // Update rates on indicated loan,
      // and the other loan as well if it has been edited.
      for ( var i = 0, len = loans.length; i < len; i++ ) {
        var loan = loans[i];
        if ( i === id || loan.edited ) {
          LoanStore.fetchLoanData( loan );
        }
      }
      LoanStore.emitChange();
      break;

    case ScenarioConstants.UPDATE_SCENARIO:
      AppDispatcher.waitFor( [ ScenarioStore.dispatchToken ] );
      LoanStore.resetAllLoans();
      LoanStore.emitChange();
      break;

    default:
    // no op
  }
} );

module.exports = LoanStore;
