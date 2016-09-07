'use strict';

var common = {};

common.loanCount = 2;

common.minDownpaymentPcts = {
  fha:         0.035,
  fhaPercent:  3.5,
  conf:        0.05,
  confPercent: 5
};

common.armDisallowedOptions = {
  'loan-term': [ 15 ],
  'loan-type': [ 'fha', 'va', 'va-hb', 'fha-hb' ]
};

common.calculatedPropertiesBasedOnIR = [
  'discount',
  'processing',
  'lender-fees',
  'third-party-services',
  'insurance',
  'third-party-fees',
  'taxes-gov-fees',
  'prepaid-expenses',
  'initial-escrow',
  'monthly-taxes-insurance',
  'monthly-hoa-dues',
  'monthly-principal-interest',
  'monthly-mortgage-insurance',
  'monthly-payment',
  'closing-costs',
  'principal-paid',
  'interest-fees-paid',
  'overall-costs'
];

common.numericLoanProps = [
  'downpayment',
  'downpayment-percent',
  'price',
  'interest-rate',
  'loan-term'
];

common.defaultLoanData = {
  'credit-score':   700,
  'downpayment':    20000,
  'price':          200000,
  'rate-structure': 'fixed',
  'points':         0,
  'loan-term':      30,
  'loan-type':      'conf',
  'arm-type':       '5-1',
  'state':          'AL'
};

var armMessage = 'While some lenders may offer FHA, VA, ' +
                 'or 15-year adjustable-rate mortgages, ' +
                 'they are rare. We don’t have enough data ' +
                 'to display results for these combinations. ' +
                 'Choose a fixed rate if you’d like to try these options.';

common.errorMessages = {
  'downpayment-too-high': 'Your down payment cannot be more than your house price.',
  'downpayment-too-low-fha': 'FHA loans typically require a down payment of at least ' + common.minDownpaymentPcts.fhaPercent + '%.',
  'downpayment-too-low-conf': 'Conventional loans typically require a down payment of at least ' + common.minDownpaymentPcts.confPercent + '%.',
  'loan-type': armMessage,
  'loan-term': armMessage,
  'need-county': 'Please enter your county so we can check what loan types are available at your loan amount and get you the most accurate rates.'
};

common.scenarios = [ {
  val: 'credit-score',
  title: 'Credit Score',
  label: 'Credit score',
  intro: 'Your credit score is a significant driver of your loan costs. Borrowers with lower credit scores receive higher interest rates and often pay more in other loan costs. This tool will help you get a sense of how much the difference in costs is likely to be, so you can decide whether now is the right time for you to buy.',
  loanProps: [
    // TODO: move dp percent to sharedProps
    { 'credit-score': 760, 'downpayment-percent': 10 },
    { 'credit-score': 660, 'downpayment-percent': 10 }
  ],
  sharedProps: {},
  inputNotes: {
    'credit-score': 'We’ve chosen two credit score ranges, one above average and one below average. Feel free to adjust these numbers.',
    'interest-rate': 'You’ll generally receive a higher interest rate with a lower credit score.'
  },
  independentInputs: [ 'credit-score', 'interest-rate' ],
  outputNotes: {
    'closing-costs': 'Generally, your credit score shouldn’t affect your closing costs too much with a conventional loan.',
    'monthly-principal-interest': 'With a higher interest rate, you’ll have a higher monthly payment and you’ll build equity more slowly.',
    'monthly-mortgage-insurance': 'Mortgage insurance costs usually increase with a lower credit score when you have a conventional loan.',
    'overall-costs': 'Overall, you’ll pay more in interest and fees with a lower credit score.'
  }
},
{
  val: 'downpayment',
  title: 'Down Payment',
  label: 'Down payment',
  intro: 'Your down payment amount affects all aspects of your costs. Putting down less up front can be a good option for home buyers without a lot of cash on hand, but you’ll have higher monthly payments and pay more in interest and fees. This tool will help you get a sense of how much the difference in costs is likely to be, so you can make tradeoffs.',
  loanProps: [
    { 'downpayment-percent': 20 },
    { 'downpayment-percent': 10 }
  ],
  sharedProps: {},
  inputNotes: {
    'downpayment': 'We’ve chosen two common down payment amounts. Feel free to adjust these numbers.',
    'loan-amount': 'The lower your down payment, the higher the amount you need to borrow.',
    'interest-rate': 'You’ll often pay a higher interest rate with a lower down payment, but how much higher depends on your credit score and the particular lender.'
  },
  independentInputs: [ 'downpayment', 'downpayment-percent', 'interest-rate' ],
  outputNotes: {
    'closing-costs': 'A lower down payment means you’ll need less cash at the closing table, but you may pay more in fees.',
    'insurance': 'With a conventional loan, mortgage insurance is typically paid as part of your monthly payment, not upfront.',
    'monthly-principal-interest': 'With a lower down payment, you have more to pay back each month, and you’re paying interest on a larger loan amount.',
    'monthly-mortgage-insurance': 'With a low down payment loan (less than 20%), you’ll need to pay for mortgage insurance. Learn more.',
    'overall-costs': 'Overall, you’ll pay more in interest and fees with a low down payment loan.'
  }
} ];

common.inputTooltips = {
  'state': 'The state where the home is located',
  'county': 'The county where the home is located',
  'credit-score': 'A number that is used to predict how likely you are to pay back a loan on time.',
  'price': 'The price of the home',
  'downpayment': 'The initial, upfront payment you make toward the total cost of the home. ',
  'loan-amount': 'The amount of money borrowed to pay for the home. Calculated by subtracting the down payment from the home price.',
  'rate-structure': 'Choose between a fixed rate, where your interest rate does not change over the term of your loan, or adjustable rate where it can change.',
  'arm-type': 'Adjustable Rate Mortgages have both fixed periods and adjustable periods. The top number is the fixed period. The bottom number is the adjustable period.',
  'loan-term': 'The amount of time the borrower has to repay the loan.',
  'loan-type': 'Loans are categorized based on the size of the loan and whether they are part of a government program.',
  'loan-summary': 'This field summarizes your loan type, term, and rate type.',
  'points': 'Points lower the interest rate by closing costs. Credits lower closing costs by increasing the interest rate.',
  'interest-rate': 'The cost paid each year to borrow the money, expressed as a percentage rate. It does not reflect fees or any other charges paid for the loan.'
};
common.outputTooltips = {
  'downpayment': 'The amount paid upfront for the home.',
  'lender-fees': 'Fees paid to the lender to process the mortgage. Paid as part of the closing costs.',
  'third-party-fees': 'Fees paid for services provided by a third party, not your lender. Includes title insurance fees, appraisal fees, and homeowner’s insurance. Paid as part of the closing costs.',
  'taxes-gov-fees': 'Includes fees paid to the government, transfer taxes, and property taxes. Paid as part of the closing costs.',
  'prepaid-expenses': 'Fees required to be paid at closing, before they are due, such as accrued interest.',
  'initial-escrow': 'The amount paid at closing to start your escrow account, if required by your lender.',
  'monthly-principal-interest': 'The amount paid each month toward the loan balance combined with the amount paid each month in interest costs.',
  'monthly-mortgage-insurance': 'A monthly fee paid to the lender if the down payment was less than 20 percent. Mortgage insurance protects the lender, not the borrower.'
};

// Options can be an array of objects with 'label' & 'val' properties,
// or a string representing a property on another object (prob. loan)
// that will return such an array.
common.options = {
  'state': [
    { label: 'Alabama', val: 'AL' },
    { label: 'Alaska', val: 'AK' },
    { label: 'Arizona', val: 'AZ' },
    { label: 'Arkansas', val: 'AR' },
    { label: 'California', val: 'CA' },
    { label: 'Colorado', val: 'CO' },
    { label: 'Connecticut', val: 'CT' },
    { label: 'Delaware', val: 'DE' },
    { label: 'District Of Columbia', val: 'DC' },
    { label: 'Florida', val: 'FL' },
    { label: 'Georgia', val: 'GA' },
    { label: 'Hawaii', val: 'HI' },
    { label: 'Idaho', val: 'ID' },
    { label: 'Illinois', val: 'IL' },
    { label: 'Indiana', val: 'IN' },
    { label: 'Iowa', val: 'IA' },
    { label: 'Kansas', val: 'KS' },
    { label: 'Kentucky', val: 'KY' },
    { label: 'Louisiana', val: 'LA' },
    { label: 'Maine', val: 'ME' },
    { label: 'Maryland', val: 'MD' },
    { label: 'Massachusetts', val: 'MA' },
    { label: 'Michigan', val: 'MI' },
    { label: 'Minnesota', val: 'MN' },
    { label: 'Mississippi', val: 'MS' },
    { label: 'Missouri', val: 'MO' },
    { label: 'Montana', val: 'MT' },
    { label: 'Nebraska', val: 'NE' },
    { label: 'Nevada', val: 'NV' },
    { label: 'New Hampshire', val: 'NH' },
    { label: 'New Jersey', val: 'NJ' },
    { label: 'New Mexico', val: 'NM' },
    { label: 'New York', val: 'NY' },
    { label: 'North Carolina', val: 'NC' },
    { label: 'North Dakota', val: 'ND' },
    { label: 'Ohio', val: 'OH' },
    { label: 'Oklahoma', val: 'OK' },
    { label: 'Oregon', val: 'OR' },
    { label: 'Pennsylvania', val: 'PA' },
    { label: 'Puerto Rico', val: 'PR' },
    { label: 'Rhode Island', val: 'RI' },
    { label: 'South Carolina', val: 'SC' },
    { label: 'South Dakota', val: 'SD' },
    { label: 'Tennessee', val: 'TN' },
    { label: 'Texas', val: 'TX' },
    { label: 'Utah', val: 'UT' },
    { label: 'Vermont', val: 'VT' },
    { label: 'Virginia', val: 'VA' },
    { label: 'Washington', val: 'WA' },
    { label: 'West Virginia', val: 'WV' },
    { label: 'Wisconsin', val: 'WI' },
    { label: 'Wyoming', val: 'WY' }
  ],
  'credit-score': [
    { label: '600 - 619', val: '600' },
    { label: '620 - 639', val: '620' },
    { label: '640 - 659', val: '640' },
    { label: '660 - 679', val: '660' },
    { label: '680 - 699', val: '680' },
    { label: '700 - 719', val: '700' },
    { label: '720 - 739', val: '720' },
    { label: '740 - 759', val: '740' },
    { label: '760 - 779', val: '760' },
    { label: '780 - 799', val: '780' },
    { label: '800 - 819', val: '800' },
    { label: '820 - 839', val: '820' },
    { label: '840+', val: '840' }
  ],
  'rate-structure': [
    { label: 'Fixed', val: 'fixed' },
    { label: 'Adjustable', val: 'arm' }
  ],
  'arm-type': [
    { label: '3/1', val: '3-1' },
    { label: '5/1', val: '5-1' },
    { label: '7/1', val: '7-1' },
    { label: '10/1', val: '10-1' }
  ],
  'loan-term': [
    { label: '30 years', val: 30 },
    { label: '15 years', val: 15 }
  ],
  'points': [
    { val: -2, label: '-2' },
    { val: -1, label: '-1' },
    { val: 0, label: '0' },
    { val: 1, label: '1' },
    { val: 2, label: '2' }
  ],
  'loan-type': [
    { val: 'conf', label: 'Conventional' },
    { val: 'fha', label: 'FHA' },
    { val: 'va', label: 'VA' }
  ],
  'interest-rate': 'rates',
  'county': 'counties'
};

common.jumboTypes = {
  'agency': { val: 'agency', label: 'Conforming jumbo' },
  'jumbo':  { val: 'jumbo', label: 'Jumbo (non-conforming)' },
  'fha-hb': { val: 'fha-hb', label: 'FHA high-balance' },
  'va-hb':  { val: 'va-hb', label: 'VA high-balance' }
};

common.norms = [ 'conf', 'fha', 'va' ];

common.omit = function( obj ) {
  var omitted = Array.prototype.slice.call( arguments, 1 );
  var out = {};
  var props = Object.getOwnPropertyNames( obj );
  for ( var i = 0; i < props.length; i++ ) {
    var prop = props[i];
    if ( omitted.indexOf( prop ) < 0 ) {
      out[prop] = obj[prop];
    }
  }
  return out;
};

common.median = function( arr ) {
  arr.sort( function( a, b ) { return a - b; } );
  var half = Math.floor( arr.length / 2 );
  return arr[half];
};

common.capitalizeFirst = function( str ) {
  return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
};

common.getPropLabel = function( prop ) {
  var label = common.propLabels[prop] ||
              common.capitalizeFirst( prop.split( '-' ).join( ' ' ) );
  return label;
};

common.propLabels = {
  'downpayment':                'Down payment',
  'points':                     "Discount points <span class='wrap-content'>and credits</span>",
  'arm-type':                   'ARM type',
  'rate-structure':             'Rate type',
  'price':                      'House price',
  'closing-costs':              'Cash to close',
  'discount':                   'Discount points or credits',
  'processing':                 'Origination and processing fees',
  'insurance':                  'Mortgage insurance',
  'taxes-gov-fees':             'Taxes and government fees',
  'initial-escrow':             'Initial escrow deposit',
  'monthly-taxes-insurance':    'Taxes and insurance',
  'monthly-hoa-dues':           'HOA dues',
  'monthly-principal-interest': 'Principal and interest',
  'monthly-mortgage-insurance': 'Mortgage insurance',
  'interest-fees-paid':         'Interest and fees paid'
};

module.exports = common;
