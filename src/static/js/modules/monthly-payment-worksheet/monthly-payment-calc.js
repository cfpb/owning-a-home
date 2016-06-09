var assign = require('object-assign');
var utils = require('./utils.js');
var housePriceCalculations = require('./house-price.js');

var loanDataDefaults = {loanAmount: 0, housePrice: 0, downpayment: 0, monthlyTaxes: 0, monthlyInsurance: 0, principalAndInterest: 0, taxesAndInsurance: 0, estimatedMonthlyPayment: 0}

var monthly = {};

monthly.preTaxIncomeTotal = function (data) {
  return utils.sum(data.preTaxIncome, data.preTaxIncomeCB);
}

monthly.preTaxIncomeMonthly = function (data) {
  return Math.round(utils.divide(data.preTaxIncomeTotal, 12));
}

monthly.takeHomeIncomeTotal = function (data) {
  return utils.sum(data.takeHomeIncome, data.takeHomeIncomeCB);
}

monthly.spendingAndSavings = function (data) {
  return utils.sum(data.rent, data.utilities, data.debtPayments, data.livingExpenses, data.savings);
}

monthly.newHomeownershipExpenses = function (data) {
  return utils.sum(data.condoHOA, data.homeMaintenance);
}

monthly.nonHousingExpenses = function (data) {
  return utils.sum(data.debtPayments, data.livingExpenses, data.futureUtilities, data.homeMaintenance, data.futureSavings);
}

monthly.availableHousingFunds = function (data) {
  return utils.subtract(data.takeHomeIncomeTotal, data.nonHousingExpenses);
}

monthly.percentageIncomeAvailable = function (data) {
  if (data.preTaxIncomeTotal  && data.preTaxIncomeTotal > data.availableHousingFunds) {
    return Math.round(utils.divide(data.availableHousingFunds, data.preTaxIncomeTotal) * 100);
  }
}

monthly.defaultPreferredPayment = function (data) {
  return Math.round(utils.multiply(0.8, data.availableHousingFunds));
}

monthly.preferredPayment = function (data) {
  if (data.availableHousingFunds && data.availableHousingFunds > data.otherExpenses) {
    return utils.subtract(data.availableHousingFunds, data.otherExpenses);
  }
}

monthly.otherExpenses = function (data) {
  if (data.availableHousingFunds && data.availableHousingFunds > data.preferredPayment) {
    return utils.subtract(data.availableHousingFunds, data.preferredPayment);
  }
}

monthly.preferredPaymentPercentage = function (data) {
  return Math.round(utils.divide(data.preferredPayment, data.preTaxIncomeMonthly) * 100);
}

monthly.estimatedMonthlyPayment = function (data) {
  var payment = utils.subtract(data.preferredPayment, data.condoHOA);
  return payment > 0 ? payment : 0;
}

monthly.loanCalculations = function (data) {
  var results;
  if (data.estimatedMonthlyPayment > 0 && data.takeHomeIncomeTotal && data.availableHousingFunds && data.preferredPayment && data.interestRate) {
    try { 
      results = housePriceCalculations({
        monthlyPayment: utils.cleanNumber(data.estimatedMonthlyPayment), 
        term: 30, 
        rate: utils.cleanNumber(data.interestRate), 
        tax: utils.cleanNumber(data.propertyTax), 
        downpayment: 20, 
        insurance: utils.cleanNumber(data.homeownersInsurance)
      });
    } catch(e) {
    }  
  } 
  return results ? results : assign({}, loanDataDefaults);
}

monthly.taxesAndInsurance = function (data) {
  return utils.sum(data.monthlyInsurance, data.monthlyTaxes);
}

monthly.principalAndInterest = function (data) {
  if (data.estimatedMonthlyPayment && data.estimatedMonthlyPayment > data.taxesAndInsurance ) {
    return utils.subtract(data.estimatedMonthlyPayment, data.taxesAndInsurance);
  }
}

module.exports = monthly;

