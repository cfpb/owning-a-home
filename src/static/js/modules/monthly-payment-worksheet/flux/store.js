var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var MPWDispatcher = require('./dispatcher.js');
var MPWConstants = require('./constants.js');
var calc = require('../monthly-payment-calc.js');
var utils = require('../utils.js');

var CHANGE_EVENT = 'change';

var MPWStore = assign({}, EventEmitter.prototype, {
    
    worksheet: {},
    
    init: function() {
      var data = localStorage.getItem('monthlyPaymentWorksheet');
      if (typeof data !== "undefined" && data !== "undefined") {
        MPWStore.worksheet = JSON.parse(data);
      }
      setInterval(function () {
        localStorage.setItem('monthlyPaymentWorksheet', JSON.stringify(MPWStore.worksheet));
      }, 5000)

      window.onbeforeunload = function() {
        localStorage.setItem('monthlyPaymentWorksheet', JSON.stringify(MPWStore.worksheet));
      };
    },
    
    getWorksheet: function () {
        return MPWStore.worksheet;
    },
    
    update: function (prop, val) {
        val = utils.cleanNumber(val);
        MPWStore.worksheet[prop] = val;
        MPWStore.calculations(prop);
        // TODO: debounce
        // update local storage
        
    },
    
    runCalcs: function (arr) {
      for (var i = 0; i < arr.length; i++) {
        var prop = arr[i]; 
        MPWStore.worksheet[prop] = calc[prop](MPWStore.worksheet);
      }
    },
    
    calculations: function (prop) {
      // NOTE: order of calculations is important
      
      // initial calcs
      MPWStore.runCalcs(['preTaxIncomeTotal', 'preTaxIncomeMonthly', 'takeHomeIncomeTotal', 'spendingAndSavings', 'newHomeownershipExpenses', 'nonHousingExpenses', 'availableHousingFunds', 'percentageIncomeAvailable']);
      
      // preferredPayment & otherExpenses
      if (prop === 'takeHomeIncome' || prop === 'takeHomeIncomeCB') {
        MPWStore.worksheet.preferredPayment = calc.defaultPreferredPayment(MPWStore.worksheet);
        MPWStore.worksheet.otherExpenses = calc.otherExpenses(MPWStore.worksheet);
      } else if (prop === 'preferredPayment') {
        MPWStore.worksheet.otherExpenses = calc.otherExpenses(MPWStore.worksheet);
      } else if (prop === 'otherExpenses') {
        MPWStore.worksheet.preferredPayment = calc.preferredPayment(MPWStore.worksheet);
      }      
      
      // preferredPayment derived calcs
      MPWStore.runCalcs(['preferredPaymentPercentage', 'estimatedMonthlyPayment']);
      
      // loan amount calcs
      MPWStore.worksheet = assign(MPWStore.worksheet, calc.loanCalculations(MPWStore.worksheet));
      MPWStore.worksheet.housePrice = utils.roundBy(MPWStore.worksheet.housePrice, 1000);  
      MPWStore.worksheet.downpayment = utils.roundBy(MPWStore.worksheet.downpayment, 1000);  
      MPWStore.worksheet.loanAmount = utils.roundBy(MPWStore.worksheet.loanAmount, 1000);
      
      // loan amount derived calcs
      MPWStore.runCalcs(['taxesAndInsurance', 'principalAndInterest']);
      
      // TODO: round stuff
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