// ex: amortize({amount: 180000, rate: 4.25, totalTerm: 360, amortizeTerm: 60})

// amortization table calculations
// calculate the monthly payment using loan-calc
// calculate the interest paid per payment
// calculate remaining loan balance
// calculate sum of interest payments
var amortizationCalc = function(amount, rate, totalTerm, amortizeTerm) {
  var periodInt,
      monthlyPayment,
      summedInterest = 0,
      summedPrincipal = 0,
      monthlyIntPaid,
      monthlyPrincPaid,
      summedAmortize = {};

  periodInt = (rate / 12) / 100;
  monthlyPayment = amount * (periodInt / (1 - Math.pow(1 + periodInt, -(totalTerm))));

  var i = 0;
  while( i < amortizeTerm) {
    monthlyIntPaid = amount * periodInt;
    monthlyPrincPaid = monthlyPayment - monthlyIntPaid;
    summedInterest = summedInterest + monthlyIntPaid;
    summedPrincipal = summedPrincipal + monthlyPrincPaid;
    amount = amount - monthlyPrincPaid;
    i += 1;
  }

  summedAmortize.interest = summedInterest;
  summedAmortize.principal = summedPrincipal;

  return summedAmortize;

};

// round numbers to two decimal places
var roundNum = function(numObj) {

  for (var property in numObj) {
    numObj[property] = (Math.round(numObj[property] * 100) / 100).toFixed(2);
  }
  return numObj;
};

var amortize = function(opts) {
  var amortized = amortizationCalc(opts.amount, opts.rate, opts.totalTerm, opts.amortizeTerm);
  return roundNum(amortized);
};

module.exports = amortize;