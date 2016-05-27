var assign = require('object-assign');
var utils = require('./utils.js');
var housePriceCalculations = require('./house-price.js');

var loanDataDefaults = {loanAmount: 0, housePrice: 0, downpayment: 0, monthlyTaxes: 0, monthlyInsurance: 0, principalAndInterest: 0, taxesAndInsurance: 0, estimatedMonthlyPayment: 0}

var monthly = {};

monthly.preTaxIncomeTotal = function (data) {
  return utils.sum([data.preTaxIncome, data.preTaxIncomeCB]);
}

monthly.preTaxIncomeMonthly = function (data) {
  var totalIncome = monthly.preTaxIncomeTotal(data);
  if (totalIncome) {
    return totalIncome / 12;
  }
}

monthly.takeHomeIncomeTotal = function (data) {
  return utils.sum([data.takeHomeIncome, data.takeHomeIncomeCB]);
}

monthly.spendingAndSavings = function (data) {
  return utils.sum([data.rent, data.utilities, data.debtPayments, data.livingExpenses, data.savings]);
}

monthly.newHomeownershipExpenses = function (data) {
  return utils.sum([data.condoHOA, data.homeMaintenance]);
}

monthly.nonHousingExpenses = function (data) {
  return utils.sum([data.debtPayments, data.livingExpenses, data.futureUtilities, data.homeMaintenance, data.futureSavings]);
}

monthly.availableHousingFunds = function (data) {
  var funds = data.takeHomeIncomeTotal - data.nonHousingExpenses;
  return funds > 0 ? funds : 0;
}

monthly.percentageIncomeAvailable = function (data) {
  if (data.preTaxIncomeTotal  && data.preTaxIncomeTotal > data.availableHousingFunds) {
    return Math.round((data.availableHousingFunds/data.preTaxIncomeTotal) * 100);
  }
}

monthly.defaultPreferredPayment = function (data) {
  if (data.availableHousingFunds) {
    return .8 * data.availableHousingFunds;
  }
}

monthly.preferredPayment = function (data) {
  if (data.availableHousingFunds && data.availableHousingFunds > data.otherExpenses) {
    return data.availableHousingFunds - data.otherExpenses;
  }
}

monthly.otherExpenses = function (data) {
  if (data.availableHousingFunds && data.availableHousingFunds > data.preferredPayment) {
    return data.availableHousingFunds - data.preferredPayment;
  }
}

monthly.preferredPaymentPercentage = function (data) {
  var preferredPayment = monthly.preferredPayment(data);
  var preTaxIncomeMonthly = monthly.preTaxIncomeMonthly(data);
  if (preTaxIncomeMonthly) {
    if (preferredPayment) {
      return Math.round((preferredPayment / preTaxIncomeMonthly) * 100);
    } else {
      return 0;
    }
  }
}

monthly.estimatedMonthlyPayment = function (data) {
  if (data.preferredPayment && data.preferredPayment > data.condoHOA) {
    return data.preferredPayment - data.condoHOA;
  }
}

monthly.loanCalculations = function (data) {
  if (data.estimatedMonthlyPayment > 0 && data.takeHomeIncomeTotal && data.availableHousingFunds && data.preferredPayment && data.interestRate) {
   var results;
    try { 
      results = housePriceCalculations({
        monthlyPayment: data.estimatedMonthlyPayment, 
        term: 30, 
        rate: data.interestRate, 
        tax: data.propertyTax, 
        downpayment: 20, 
        insurance: data.homeownersInsurance
      });
    } catch(e) {}  
    return results; 
  } 
  return assign({}, loanDataDefaults);
}

monthly.taxesAndInsurance = function (data) {
  return utils.sum([data.monthlyInsurance, data.monthlyTaxes]);
}

monthly.principalAndInterest = function (data) {
  if (data.estimatedMonthlyPayment && data.estimatedMonthlyPayment > data.taxesAndInsurance ) {
    return data.estimatedMonthlyPayment - data.taxesAndInsurance;
  }
}

module.exports = monthly;

