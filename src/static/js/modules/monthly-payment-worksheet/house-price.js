var assign = require('object-assign');

var defaults = {
  monthlyPayment: 0,
  term: 0,
  rate: 0,
  tax: 0,
  downpayment: 0, 
  insurance: 0
}

function checkParams (opts) {
  // converts opts values which are numeric strings to numbers.
  // Throws errors if required fields are absent,
  // or values are negative/NaN.
  var val;
  if (!opts.monthlyPayment || !opts.term) {
    throw new Error( 'Monthly payment and loan term are required.' );
  }
  for (var key in opts) {
    if (opts.hasOwnProperty(key)) {
      val = Number(opts[key]);
      if (isNaN(val)) {
        throw new TypeError(key + ' must be numeric');
      } else if (val < 0) {
        throw new Error(key + ' must be positive');
      } else {
        opts[key] = val;
      }
    }
  }
  return opts;
}

// monthly payment value (ie 1750)
// term of loan in years (ie 30)
// interest rate (ie 3.5)
// property tax rate (ie 1.25)
// downpayment (percentage, ie 20, or value, ie 20000)
// annual insurance value (ie 2000)
// monthlyPayment, term, rate, downpayment, tax, insurance

function housePriceCalc (opts) {
  var params = checkParams(assign({}, defaults, opts));
  
  var loanAmount, housePrice, downpayment;
  var dpAsPercent = params.downpayment > 100 ? false : true;
  var monthlyInsurance = params.insurance / 12;
  var m =  params.monthlyPayment - monthlyInsurance; // monthly payment 
  var h = 100 / (100 - params.downpayment) || 1; // house price coefficient 
  var t = (params.tax / 100) / 12; // monthly prop tax rate
  var i = (params.rate / 12) / 100; // monthly interest rate
  var n = params.term * 12;//number of months
  
  // TODO: if dp is percent & dp percent is less than 20, add pmi to calc?
  if (params.rate) {
    if (dpAsPercent) {
      loanAmount = m / ((h * t) + ( i / ( 1 - Math.pow(1 + i, -n) )));
    } else {
      loanAmount = p = (m - (t * params.downpayment)) / (t + ( i / ( 1 - Math.pow(1 + i, -n) )));
    }
  } else {
    if (dpAsPercent) {
      loanAmount = (m * n) / (1 + (h * t * n));
    } else {
      loanAmount = ( n * ( m - (t * params.downpayment) ) ) / ( 1 + (t * n) );
    }
  }
  
  if (dpAsPercent) {
    housePrice = h * loanAmount;
    downpayment = housePrice * (params.downpayment / 100)
  } else {
    // if downpayment is less than 20% of loan amount, recalc with pmi?
    housePrice = loanAmount + params.downpayment,
    downpayment = params.downpayment
  }
  
  // TODO: hqndle errors here?
  if (loanAmount < 0 || housePrice < 0) {
    return assign({}, defaults);
  }
  return {
    loanAmount: Math.round(loanAmount), 
    housePrice: Math.round(housePrice), 
    downpayment: Math.round(downpayment),
    monthlyInsurance: Math.round(monthlyInsurance), 
    monthlyTaxes: Math.round(housePrice * t)
  }
}

module.exports = housePriceCalc;