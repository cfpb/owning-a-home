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
     * Resets a loan's properties using a combination of default loan data,
     * existing loan data, and data specific to the current scenario.
     * If there's a scenario, loans will have the same values for 
     * all properties except scenario-specific ones, so we use the 
     * first loan's data as existingData for all loans (but omit id & api requests).
     * Also runs updateLoan to update dependencies/validations/calculations,
     * and initiates api requests.
     *
     * @param  {number} id 
     * @param  {object} scenario optional
     */
    resetLoan: function (id, scenario) {
        var scenarioData = scenario ? scenario.loanProps[id] : {};        
        var existingData = this._loans[id];
        
        if (scenario && id > 0) {
            existingData = common.omit(this._loans[0], 'id', 'rate-request', 'mtg-ins-request');
        }
        
        this._loans[id] = assign({id: id}, common.defaultLoanData, existingData, scenarioData);
        this.updateLoan(id);
        this.fetchLoanData(id);
    },
    
    /**
     * Update all loans.
     * @param  {string} prop loan prop to update
     * @param  {string|number} val value
     */
    updateAllLoans: function (prop, val) {
        for (i = 0; i < this._loans.length; i++) {
            this.updateLoan(i, prop, val);
        }
    },
    
    /**
     * Updates an (optional) property on the loan.
     * Also updates dependencies & calculated properties,
     * validates the loan, and updates any current api requests 
     * on the loan to include new data.
     * @param  {number} id id of loan to update
     * @param  {string} prop optional loan prop to update
     * @param  {string|number} val optional value
     */
    updateLoan: function (id, prop, val) {    
        var loan = this._loans[id];
        var rateChange = prop === 'interest-rate';
        
        if (prop) {
            loan[prop] = val || null;
            loan['edited'] = !rateChange;
        }
        
        this.updateLoanDependencies(loan, prop);
        this.validateLoan(loan);
        this.updateLoanCalculatedProperties(loan, rateChange);

        if (loan['rate-request']) {
            this.fetchLoanData(id);
        }
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
     *
     * @param  {object} loan 
     * @param  {string} prop changed prop
     */
    updateLoanDependencies: function (loan, prop) {
        if (prop && $.inArray(prop, ['downpayment', 'downpayment-percent', 'price']) === -1) {
            return;
        }
        
        if (prop === 'downpayment' || prop === 'downpayment-percent') {
           this.downpaymentConstant = prop;
        }
        
        if (this.downpaymentConstant === 'downpayment-percent' && 
            typeof loan['downpayment-percent'] != 'undefined') {
            loan['downpayment'] = mortgageCalculations['downpayment'](loan);
        } else {
            loan['downpayment-percent'] = mortgageCalculations['downpayment-percent'](loan);
        }
    },    
    
    /**
     * Cancels any existing requests on loan, then fetches
     * mortgage insurance & interest rate data from api and
     * handles success/failure when both requests have completed.
     *
     * @param  {number} id id of loan to update 
     */
    fetchLoanData: function (id) {
        var loan = this._loans[id];
        
        $.each(['rate-request', 'mtg-ins-request'], function (ind, req) {
            if (loan[req]) {
                api.stopRequest(loan[req]);
            }
        });
        
        loan['rate-request'] = LoanStore.fetchRates(loan);
        loan['mtg-ins-request'] = LoanStore.fetchInsurance(loan);
        $.when(loan['rate-request'], loan['mtg-ins-request'])
            .done(function() {
                LoanStore.updateLoanCalculatedProperties(loan, true);
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
                   });
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
        loan['interest-rate'] = rates.median;
        loan['edited'] = false;
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
     * Updates calculated loan properties. Runs different series
     * of calculations based on whether loan's interest rate property
     * was just updated.
     * 
     * @param  {object} loan
     * @return {bool} rateChange true if insurance rate has just changed
     */
    updateLoanCalculatedProperties: function (loan, rateChange) {
        var props = rateChange 
                    ? common.calculatedPropertiesBasedOnIR 
                    : common.calculatedProperties;
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
            if (loan['rate-structure'] === 'arm' && $.inArray(loan['loan-type'], common.armDisallowedOptions['loan-type']) >= 0) {
                loan['loan-type'] = 'conf';
                return common.errorMessages['loan-type'];
            }
        },
        'loan-term': function (loan) {
            if (loan['rate-structure'] === 'arm' && $.inArray(+loan['loan-term'], common.armDisallowedOptions['loan-term']) >= 0) {
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
        //loan['is-jumbo'] = isJumbo(loan);    
        return loan;
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
    isJumbo: function (loan) {
        // TODO: finish this
        var jumbos = ['jumbo', 'agency', 'fha-hb', 'va-hb'],
            bounces = { 'fha-hb' : 'fha', 'va-hb': 'va' };

        var jumboTest = jumbo({
            loanType: loan['loan-type'],
            loanAmount: loan['loan-amount']
        });

        return false;
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
               LoanStore.updateLoan(action.id, action.prop, action.val);
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
                if (i === id || loans[i].edited)
                LoanStore.fetchLoanData(i);
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