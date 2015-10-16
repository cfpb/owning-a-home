var monthly = {};

monthly.preTaxIncomeTotal = function (data) {
  return parseFloat(data.preTaxIncome) + parseFloat(data.preTaxIncomeCB);
}

monthly.takeHomeIncomeTotal = function (data) {
  return parseFloat(data.takeHomeIncome) + parseFloat(data.takeHomeIncomeCB);
}

monthly.spendingAndSavings = function (data) {
  var sum = parseFloat(data.rent) 
          + parseFloat(data.utilities)
          + parseFloat(data.debtPayments)
          + parseFloat(data.livingExpenses)
          + parseFloat(data.savings);
          
  return sum;
}

monthly.homeMaintenanceAndImprovement = function (data) {
  return parseFloat(data.homeImprovement) + parseFloat(data.homeMaintenance);
}

monthly.newHomeownershipExpenses = function (data) {
  return parseFloat(data.condoHOA) + monthly.homeMaintenanceAndImprovement(data);
}

monthly.futureSavings = function (data) {
  return parseFloat(data.emergencySavings) + parseFloat(data.longTermSavings);
}

monthly.availableHousingFunds = function (data) {
  var income = monthly.takeHomeIncomeTotal(data);
  var expenses = parseFloat(data.debtPayments)
               + parseFloat(data.livingExpenses)
               + parseFloat(data.futureUtilities)
               + monthly.futureSavings(data)
               + monthly.homeMaintenanceAndImprovement(data);
               
  return income - expenses;
}

monthly.estimatedTotalPayment = function (data) {
  return monthly.availableHousingFunds(data) - parseFloat(data.condoHOA);
}

monthly.taxesAndInsurance = function (data) {
  var annualTaxesAndInsurance = (parseFloat(data.homePrice) * parseFloat(data.propertyTax / 100))
                              + parseFloat(data.homeownersInsurance);
  return annualTaxesAndInsurance / 12;
}

monthly.principalAndInterest = function (data) {
  var total = monthly.estimatedTotalPayment(data) - monthly.taxesAndInsurance(data);
  return total;
}

monthly.percentageIncomeAvailable = function (data) {
  var percentage = monthly.availableHousingFunds(data) / monthly.preTaxIncomeTotal(data);
  return Math.round(percentage * 100);
}

module.exports = monthly;