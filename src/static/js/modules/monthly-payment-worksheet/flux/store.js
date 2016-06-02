var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var MPWDispatcher = require('./dispatcher.js');
var MPWConstants = require('./constants.js');
var calc = require('../monthly-payment-calc.js');
var utils = require('../utils.js');

var CHANGE_EVENT = 'change';

var MPWStore = assign({}, EventEmitter.prototype, {
    
    
    init: function() {
      var data = localStorage.getItem('monthlyPaymentWorksheet');
      if (typeof data !== "undefined" && data !== "undefined") {
        this.worksheet = JSON.parse(data);
      } else {
        this.worksheet = {};
      }
      setInterval(function () {
        localStorage.setItem('monthlyPaymentWorksheet', JSON.stringify(MPWStore.worksheet));
      }, 5000)

      window.onbeforeunload = function() {
        localStorage.setItem('monthlyPaymentWorksheet', JSON.stringify(MPWStore.worksheet));
      };
      
    },
    
    getWorksheet: function () {
        return this.worksheet;
    },
    
    update: function (prop, val) {
        val = utils.cleanNumber(val);
        this.worksheet[prop] = val;
        this.calculations(prop);
        // TODO: debounce
        // update local storage
        
    },
    
    runCalcs: function (arr) {
      for (var i = 0; i < arr.length; i++) {
        var prop = arr[i]; 
        this.worksheet[prop] = calc[prop](this.worksheet);
      }
    },
    
    calculations: function (prop) {
      // NOTE: order of calculations is important
      
      // initial calcs
      this.runCalcs(['preTaxIncomeTotal', 'preTaxIncomeMonthly', 'takeHomeIncomeTotal', 'spendingAndSavings', 'newHomeownershipExpenses', 'nonHousingExpenses', 'availableHousingFunds', 'percentageIncomeAvailable']);
      
      // preferredPayment & otherExpenses
      if (prop === 'takeHomeIncome' || prop === 'takeHomeIncomeCB' || prop ===  'debtPayments' || prop === 'livingExpenses' || prop === 'futureUtilities' || prop === 'homeMaintenance' || prop ===  'futureSavings') {
        this.worksheet.preferredPayment = calc.defaultPreferredPayment(this.worksheet);
        this.worksheet.otherExpenses = calc.otherExpenses(this.worksheet);
      } else if (prop === 'preferredPayment') {
        this.worksheet.otherExpenses = calc.otherExpenses(this.worksheet);
      } else if (prop === 'otherExpenses') {
        this.worksheet.preferredPayment = calc.preferredPayment(this.worksheet);
      }      
      
      // preferredPayment derived calcs
      this.runCalcs(['preferredPaymentPercentage', 'estimatedMonthlyPayment']);
      
      // loan amount calcs
      this.worksheet = assign(this.worksheet, calc.loanCalculations(this.worksheet));
      this.worksheet.housePrice = utils.roundBy(this.worksheet.housePrice, 1000);  
      this.worksheet.downpayment = utils.roundBy(this.worksheet.downpayment, 1000);  
      this.worksheet.loanAmount = utils.roundBy(this.worksheet.loanAmount, 1000);
      
      this.runCalcs(['taxesAndInsurance', 'principalAndInterest']);
    },
    
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// Register callback to handle updates
MPWDispatcher.register(function(action) {
    switch(action.actionType) {
        case MPWConstants.UPDATE: 
            MPWStore.update(action.prop, action.val);
            MPWStore.emitChange();
            break;
        default:
        // no op
    }
});

module.exports = MPWStore;