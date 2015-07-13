var $ = jQuery = require('jquery');
var assign = require('object-assign');

var jumbo = require('jumbo-mortgage');

var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var LoanConstants = require('../constants/loan-constants');
var ScenarioConstants = require('../constants/scenario-constants');
var ScenarioStore = require('./scenario-store');
var mortgageCalculations = require('../mortgage-calculations');
var common = require('../common');
var api = require('../api');

var CHANGE_EVENT = 'change';

var LoanStore = assign({}, EventEmitter.prototype, {
    
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
    resetAllLoans: function () {
        var len = this._loans.length || common.loanCount;
        var scenario = ScenarioStore.getScenario();
              
        if (this._loans.length == 0 || scenario) {
            this.updateDownpaymentConstant(scenario);
            for (i = 0; i < len; i++) {
                this.resetLoan(i, scenario);
            }
        }    
    },
    
    /**
     * Resets a loan's properties.
     * Also runs methods to update dependencies/validations/calculations,
     * and initiates api requests.
     *
     * @param  {number} id 
     * @param  {object} scenario optional
     */
    resetLoan: function (id, scenario) {
        var loan = LoanStore.setLoanData(id, scenario);
        LoanStore.updateDownpaymentDependencies(loan);
        LoanStore.updateCalculatedValues(loan, 'loan-summary');
        LoanStore.validateLoan(loan);
        LoanStore.fetchLoanData(loan);
        // TODO: add county request as option to fetchLoanData?
        // or do we not want to fail everything if we can't
        // complete the county request?
        LoanStore.fetchCounties(loan, true);
    },
    
    /**
     * Sets a loan's properties using a combination of default loan data,
     * existing loan data, and data specific to the current scenario.
     * If there's a scenario, loans will have the same values for 
     * all properties except scenario-specific ones, so we use the 
     * first loan's data as existingData for loan 2 (omitting id & api requests)
     *
     * @param  {number} id 
     * @param  {object} scenario optional
     */
    setLoanData: function (id, scenario) {
        var defaultData = common.defaultLoanData;
        var scenarioData = scenario ? scenario.loanProps[id] : {};        
        var existingData = scenario && id > 0 
                           ? common.omit(this._loans[0], 'id', 'rate-request', 'mtg-ins-request', 'county-request')
                           : this._loans[id];
        
        this._loans[id] = assign({id: id}, defaultData, existingData, scenarioData);
        return this._loans[id];
    },
    
    /**
     * Update all loans.
     * @param  {string} prop loan prop to update
     * @param  {string|number} val value
     */
    updateAllLoans: function (prop, val) {
        for (i = 0; i < this._loans.length; i++) {
            this.updateLoan(this._loans[i], prop, val);
        }
    },
    
    /**
     * Updates an (optional) property on the loan.
     * Also updates dependencies & calculated properties,
     * validates the loan, and updates any current api requests 
     * on the loan to include new data.
     * @param  {object} loan loan to update
     * @param  {string} prop loan prop to update
     * @param  {string|number} val new value
     */
    updateLoan: function (loan, prop, val) {    
        var rateChange = prop === 'interest-rate';
        
        loan[prop] = this.standardizeValue(prop, val);
        loan['edited'] = !rateChange;
        
        this.updateLoanDependencies(loan, prop);

        if (!rateChange) {
            this.validateLoan(loan);
            
            if (loan['rate-request']) {
                this.fetchLoanData(loan);
            }
        }
        
        this.updateLoanCalculations(loan, prop);        
    },
    
    /**
     * Standardizes input values: returns null in the absence
     * of a value, and ensures numeric values for appropriate props.
     *
     * @param  {string} prop name of loan prop
     * @param  {string|number} val value for loan prop
     * @return  {string|number|null} standardized value
     */
    standardizeValue: function (prop, val) {
        var numericVal;
        if ($.inArray(prop, common.numericLoanProps) > -1) {
            numericVal = Number(val);
            return !isNaN(numericVal) ? numericVal : 0;
        }
        return val || null;
    },
    
    /**
     * Downpayment scenario always needs to start with
     * downpayment-percent as constant.
     * (There may be need to change the constant for future
     * scenarios as well.)
     * @param  {string} prop loan prop to update
     * @param  {string|number} val value
     */
    updateDownpaymentConstant: function (scenario) {
        if ((scenario ||{}).val === 'downpayment') {
            this.downpaymentConstant = 'downpayment-percent';
        }
    },
    
    /**
     * Updates global downpaymentConstant to reflect last changed
     * downpayment property, and updates dependent downpayment property
     * to reflect any changes to price or constant downpayment value.
     * Also recalculates loan-amount to reflect changed price or downpayment.
     *
     * @param  {object} loan 
     * @param  {string} prop changed prop
     */
    updateDownpaymentDependencies: function (loan, prop) {
        if (prop === 'downpayment' || prop === 'downpayment-percent') {
           this.downpaymentConstant = prop;
        }
        
        if (this.downpaymentConstant === 'downpayment-percent' && typeof loan['downpayment-percent'] != 'undefined') {
            this.updateCalculatedValues(loan, 'downpayment');
        } else {
            this.updateCalculatedValues(loan, 'downpayment-percent');
        }
        this.updateCalculatedValues(loan, 'loan-amount');
    }, 
    
    /**
     * Targeted update of loan dependencies based on the prop that has changed: 
     * for downpayment/price props, calls updateDownpaymentDependencies,
     * and for state, calls resetCounty.
     *
     * @param  {object} loan 
     * @param  {string} prop changed prop
     */
    updateLoanDependencies: function (loan, prop) {
        if ($.inArray(prop, ['downpayment', 'downpayment-percent', 'price']) > -1) {
            this.updateDownpaymentDependencies(loan, prop);
        } else if (prop === 'state') {
            this.resetCounty(loan);
        }
    },
    
    /**
     * Targeted update of loan calculations based on the prop that has changed: 
     * for loan type/term/rate-structure, calls updateCalculatedValues with 'loan-summary',
     * and for interest-rate, calls updateCalculatedValues with calculatedPropertiesBasedOnIR.
     *
     * @param  {object} loan 
     * @param  {string} prop changed prop
     */
    updateLoanCalculations: function (loan, prop) {
        if ($.inArray(prop, ['loan-type', 'loan-term', 'rate-structure']) > -1) {
            this.updateCalculatedValues(loan, 'loan-summary');
        } else if (prop === 'interest-rate') {
            this.updateCalculatedValues(loan, common.calculatedPropertiesBasedOnIR);
        }
    },
     
    /**
    * Resets county data & calls fetchCounties.
    *
    * @param  {object} loan 
    */
    resetCounty: function (loan) {
        loan['county'] = null;
        loan['counties'] = null;
        loan['county-dict'] = null;
        LoanStore.fetchCounties(loan);
    },  
    
    /**
     * Cancels any existing requests on loan, then fetches
     * mortgage insurance & interest rate data from api and
     * handles success/failure when both requests have completed.
     *
     * @param  {object} loan loan to update 
     */
    fetchLoanData: function (loan) {        
        $.each(['rate-request', 'mtg-ins-request'], function (ind, req) {
            if (loan[req]) {
                api.stopRequest(loan[req]);
            }
        });
        
        loan['rate-request'] = LoanStore.fetchRates(loan);
        loan['mtg-ins-request'] = LoanStore.fetchInsurance(loan);
        $.when(loan['rate-request'], loan['mtg-ins-request'])
            .done(function() {
                LoanStore.updateLoanDependencies(loan, 'interest-rate');
            })
            .fail(function () {
                // can't update calculated properties
                // show error state
            })
            .always(function() {
                loan['rate-request'] = null;
                loan['mtg-ins-request'] = null;
                LoanStore.emitChange();
            });
    },
    
    /**
     * Fetches mortgage insurance data from api for a loan,
     * and updates loan with results data on success.
     * 
     * @param  {object} loan
     * @return {object} insurance request
     */
    fetchInsurance: function (loan) {
        return api.fetchMortgageInsuranceData(loan)
                   .done(function(results) {
                       LoanStore.updateLoanInsurance(loan, (results || {}).data);
                   });
    },
    
    /**
     * Sets insurance data on loan.
     * 
     * @param  {object} loan
     * @param  {object} data mortgage insurance data from api
     */
    updateLoanInsurance: function (loan, data) {
        loan['mtg-ins-data'] = data;
    },
    
    /**
     * Fetches interest rate data from api for a loan,
     * and updates loan with results data on success.
     * 
     * @param  {object} loan
     * @return {object} rates request
     */
    fetchRates: function (loan) {
        return api.fetchRateData(loan)
                   .done(function(results) {
                       LoanStore.updateLoanRates(loan, (results || {}).data);
                   })
                   .fail(function () {
                       loan['edited'] = false;
                   })
    },
    
    /**
     * Sets interest rate, array of rate options,
     * and edited state on loan.
     * 
     * @param  {object} loan
     * @param  {object} data interest rates array from api
     */
    updateLoanRates: function (loan, data) {
        var rates = this.processRatesData(data);
        loan['rates'] = rates.vals;
        this.updateLoan(loan, 'interest-rate', rates.median);
    },
    
    /**
     * Processes interest rate data from api.
     * Finds actual median value from api rates array
     * by using frequency data to construct a total rates array.
     * Generates an array of rate options objects for use in dropdown.
     * @param  {array} data
     * @return {object} obj containing median rate & rate options
     */
    processRatesData: function (data) {
        // data: [rate: frequency, rate: frequency,...]
        data || (data = {});
        var rates = [];
        var totalRates = [];
        var medianRate;
        var processedRates;
        
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                rates.push(key);
                var len = data[key];
                for (var i=0; i<len; i++){
                    totalRates.push(key)
                }
            }
        }
        medianRate = common.median(totalRates) || 0;
        
        rates = rates.sort();
        processedRates = $.map(rates, function( rate, i ) {
            return {val: Number(rate), label: rate + '%'};
        });
        
        return {vals: processedRates, median: Number(medianRate)};
    },
    
    
    /**
     * Checks the current value of a loan's property against the list
     * of disallowed values for that property in ARM loan scenarios.
     * Returns true if disallowed, false if allowed.
     *
     * @param  {string} prop loan property
     * @param  {obj} loan loan 
     * @return {bool} whether the current value for loan[prop] is disallowed in ARM scenarios
     */
    isDisallowedArmOption: function (prop, loan) {
        var val = prop === 'loan-term' ? +loan[prop] : loan[prop];
        return loan['rate-structure'] === 'arm' && $.inArray(val, common.armDisallowedOptions[prop]) >= 0;
    },
    
    /**
     * Sets the value of one or more loan properties to the value returned
     * by running the mortgageCalculations function for that property on the loan.
     *
     * @param  {object} loan loan 
     * @param  {array|string} props name of property or array of property names 
     * @return {object} updated loan object
     */
    updateCalculatedValues: function (loan, props) {
        props = $.isArray(props) ? props : [props];
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            loan[prop] = mortgageCalculations[prop](loan);
        }
        return loan;
    },
    
    /**
     * Validator functions for loan properties.
     */
    validators: {
        'loan-type': function (loan) {
            if (LoanStore.isDisallowedArmOption('loan-type', loan)) {
                loan['loan-type'] = 'conf';
                return common.errorMessages['loan-type'];
            }
        },
        'loan-term': function (loan) {
            if (LoanStore.isDisallowedArmOption('loan-term', loan)) {
                loan['loan-term'] = 30;
                return common.errorMessages['loan-term'];
            }
        },
        'downpayment': function (loan) {
            if (LoanStore.isDownpaymentTooHigh(loan)) {
                return common.errorMessages['downpayment-too-high'];
            } else if (LoanStore.isDownpaymentTooLow(loan)) {
                return common.errorMessages['downpayment-too-low' + '-' + loan['loan-type']];
            }
        }
    },

    /**
     * Runs series of validations on loan & updates
     * loan's errors object with any resulting error messages.
     * 
     * @param  {object} loan
     * @return {object} loan
     */
    validateLoan: function (loan) {        
        loan['errors'] = {};
        $.each(this.validators, function (prop, validator) {
            var err = validator(loan);
            if (err) {
                loan['errors'][prop] = err;
            }
        });
        
        this.jumboCheck(loan);
    },
    

    /**
     * Checks whether loan downpayment is higher than price.
     * 
     * @param  {object} loan
     * @return {bool} 
     */
    isDownpaymentTooHigh: function (loan) {
        return +loan['downpayment'] > +loan['price'];
    },
    
    /**
     * Checks whether loan downpayment is too low, using
     * different minimum value based on loan type.
     * 
     * @param  {object} loan
     * @return {bool} 
     */
    isDownpaymentTooLow: function (loan) {
        switch (loan['loan-type']) {
            case 'conf':                
                return +loan['downpayment'] < common.minDownpaymentPcts.conf * +loan['price'];
                break;
            case 'fha':
                return +loan['downpayment'] < common.minDownpaymentPcts.fha * +loan['price'];
                break;
            default:
                return false;
        }
    },
    
    /**
     * Checks whether loan is jumbo.
     * 
     * @param  {object} loan
     * @return {bool} 
     */
    jumboCheck: function (loan) {
        var newType, loanType = loan['loan-type']; 
        
        // run jumbo test
        var jumboTest = LoanStore.runJumboTest(loan);
        if (jumboTest.success) {
            // success means that we had the data we needed to assess whether
            // this is a jumbo loan
            if (jumboTest.isJumbo) {
                // if it is a jumbo loan, update the loan type based on the test results,
                // and show the county dropdown & any error message the test returned
                loan['previous-type'] = common.jumboTypes[loanType] ? loan['previous-type'] : loanType;
                loan['need-county'] = true;
                loan['errors']['loan-type'] = jumboTest.msg;
                newType = (jumboTest.type != loanType) ? jumboTest.type : null;
            } else if (common.jumboTypes[loanType]) {
                // if it's not a jumbo loan, reset if it used to be a jumbo
                // by hiding the county dropdown & changing the loan type --
                // to previous-type, if one was stored, otherwise to 'conf'
                loan['need-county'] = false;
                newType = loan['previous-type'] || 'conf';
                loan['previous-type'] = null;
            }
            // if the loan type was changed, call updateLoan to update dependencies &
            // run validations based on new loan type
            if (newType) {
                LoanStore.updateLoan(loan, 'loan-type', newType);
            }
        } else if (jumboTest.needCounty) {
            // if the test fails because we need county data we don't have,
            // update the error messaging & start fetching data if fetch not in progress
            loan['need-county'] = true;
            loan['errors']['county'] = common.jumboMessages[loanType];
            
            if (!loan['counties'] && !loan['county-request']) {
                LoanStore.fetchCounties(loan);
            }
        }  
    },
    
    /**
     * Generates params & then jumbo() function on this loan.
     * 
     * @param  {object} loan
     * @return {object} result of jumbo() function  
     */
    runJumboTest: function (loan) {
        var params = this.getJumboParams(loan);
        return jumbo(params) || {};
    },
    
    
    /**
     * Generates params for the jumbo test function for a given loan.
     * Base params = {loan-type:'...', loan-amount:'...'}
     * If there is a county value on the loan, runs the getCountyParams
     * function and adds its results to the base params object.
     * 
     * @param  {object} loan
     * @return {object} params object
     */
    getJumboParams: function (loan) {
        var params = {
            loanType: loan['loan-type'],
            loanAmount: loan['loan-amount']
        };
        var countyParams = this.getCountyParams(loan);

        assign(params, countyParams);

        return params;
    },

    getCountyParams: function (loan) {
        var params;
        var county = loan['county'];
        var dict = loan['county-dict'];
        if (county && dict) {
            var countyData = dict[county];
            if (countyData && typeof countyData == 'object') {
                params = {
                    gseCountyLimit: parseInt(countyData['gse_limit'], 10),
                    fhaCountyLimit: parseInt(countyData['fha_limit'], 10),
                    vaCountyLimit: parseInt(countyData['va_limit'], 10)
                }
            }
        }
        return params;
    },
    
    fetchCounties: function (loan, updateLoan) {
        if (loan['county-request']) {
            api.stopRequest(loan['county-request']);
        }
        loan['county-request'] =  
            api.fetchCountyData(loan)
                    .done(function(results) {
                       var counties = (results || {}).data;
                       LoanStore.updateLoanCounties(loan, counties);
                       if (updateLoan) {
                           LoanStore.fetchLoanData(loan);
                       }
                       LoanStore.emitChange();
                    });
    },
        
    updateLoanCounties: function (loan, data) {
        var dict = {};
        if ($.isArray(data)) {
            loan['counties'] = data;
            $.each(data, function (num, i) {
                dict[i['complete_fips']] = i;
            });
            loan['county-dict'] = dict;
            this.updateLoan(loan, 'county', data[0]['complete_fips'], true);
        }
        loan['county-request'] = null;
    },

    /**
     * Checks whether a loan property is linked in current scenario.
     * 
     * @param  {string} prop
     * @return {bool} 
     */
    isPropLinked: function (prop) {
        var scenario = ScenarioStore.getScenario();
        return (scenario && $.inArray(prop, scenario.independentInputs) === -1);
    },
    
    /**
    * Get the entire collection of loans.
    * @return {object}
    */
    getAll: function() {
        return this._loans;
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
LoanStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.actionType) {

        case LoanConstants.UPDATE_LOAN:
            // update both loans or single loan, dep. on whether the prop changed
            // is independent or linked in the current scenario
            if (LoanStore.isPropLinked(action.prop)) {
                LoanStore.updateAllLoans(action.prop, action.val);
            } else {
               LoanStore.updateLoan(LoanStore._loans[action.id], action.prop, action.val);
            }
            LoanStore.emitChange();
            break;
        
        case LoanConstants.UPDATE_ALL:
            LoanStore.updateAllLoans(action.prop, action.val);
            LoanStore.emitChange();
            break;
            
        case LoanConstants.UPDATE_RATES:
            var id = action.id;
            var loans = LoanStore._loans;
            // update rates on indicated loan, & the 
            // other loan as well if it has been edited
            for (var i = 0; i < loans.length; i ++) {
                var loan = loans[i];
                if (i === id || loan.edited)
                LoanStore.fetchLoanData(loan);
            }
            LoanStore.emitChange();
            break;
        
        case ScenarioConstants.UPDATE_SCENARIO:
            AppDispatcher.waitFor([ScenarioStore.dispatchToken]);
            LoanStore.resetAllLoans();
            LoanStore.emitChange();
            break;
        
        default:
        // no op
    }
});

module.exports = LoanStore;