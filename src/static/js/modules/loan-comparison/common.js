var loanCount = 2;

var minDownpaymentPcts = {
    fha: .035,
    fhaPercent: 3.5,
    conf: .05,
    confPercent: 5
};

var scenarios = {
    'downpayment': {
        id: 'downpayment',
        title: 'Down Payment',
        intro: "Your down payment affects all aspects of your costs. Putting down less up front can be a good option for home buyers without a lot of cash on hand, but you'll have a larger loan to pay off over time. In general, that means that you'll have higher monthly payments and pay more in interest and fees. This tool will help you get a sense of how much the difference in cost is likely to be, so you can make tradeoffs.",
        loanProps: [{downpayment: 40000}, {downpayment: 20000}],
        inputNotes: {
            'downpayment': "We've chosen two common down payment amounts. Feel free to adjust these numbers.", 
            'loan-amount': "The lower your down payment, the higher the amount you need to borrow.", 
            'interest-rate': "You'll often pay a higher interest rate with a lower down payment, but how much higher depends on your credit score and the particular lender."
        },
        independentInputs: ['downpayment', 'downpayment-percent'],
        outputNotes: {
            'cash-to-close': "A lower down payment means you'll need less cash at the closing table, but you may pay more in fees.", 
            'insurance': "With a conventional loan, mortgage insurcance is typically paid as part of your monthly payment, not upfront.", 
            'monthly-principal-interest': "With a lower down payment, you have more to pay back each month, and you're paying interest on a larger loan amount.", 
            'monthly-mortgage-insurance': "With a low down payment loan (typically less than 20%), you'll need to pay for mortgage insurance.", 
            'overall-cost': "Overall, you'll pay more in interest and fees with a low down payment loan."
        }
    },
    'other': {
        'title': 'Other'
    }
}


var stateOptions = [
    {
        "label": "Alabama",
        "val": "AL"
    },
    {
        "label": "Alaska",
        "val": "AK"
    },
    {
        "label": "Arizona",
        "val": "AZ"
    },
    {
        "label": "Arkansas",
        "val": "AR"
    },
    {
        "label": "California",
        "val": "CA"
    },
    {
        "label": "Colorado",
        "val": "CO"
    },
    {
        "label": "Connecticut",
        "val": "CT"
    },
    {
        "label": "Delaware",
        "val": "DE"
    },
    {
        "label": "District Of Columbia",
        "val": "DC"
    },
    {
        "label": "Florida",
        "val": "FL"
    },
    {
        "label": "Georgia",
        "val": "GA"
    },
    {
        "label": "Hawaii",
        "val": "HI"
    },
    {
        "label": "Idaho",
        "val": "ID"
    },
    {
        "label": "Illinois",
        "val": "IL"
    },
    {
        "label": "Indiana",
        "val": "IN"
    },
    {
        "label": "Iowa",
        "val": "IA"
    },
    {
        "label": "Kansas",
        "val": "KS"
    },
    {
        "label": "Kentucky",
        "val": "KY"
    },
    {
        "label": "Louisiana",
        "val": "LA"
    },
    {
        "label": "Maine",
        "val": "ME"
    },
    {
        "label": "Maryland",
        "val": "MD"
    },
    {
        "label": "Massachusetts",
        "val": "MA"
    },
    {
        "label": "Michigan",
        "val": "MI"
    },
    {
        "label": "Minnesota",
        "val": "MN"
    },
    {
        "label": "Mississippi",
        "val": "MS"
    },
    {
        "label": "Missouri",
        "val": "MO"
    },
    {
        "label": "Montana",
        "val": "MT"
    },
    {
        "label": "Nebraska",
        "val": "NE"
    },
    {
        "label": "Nevada",
        "val": "NV"
    },
    {
        "label": "New Hampshire",
        "val": "NH"
    },
    {
        "label": "New Jersey",
        "val": "NJ"
    },
    {
        "label": "New Mexico",
        "val": "NM"
    },
    {
        "label": "New York",
        "val": "NY"
    },
    {
        "label": "North Carolina",
        "val": "NC"
    },
    {
        "label": "North Dakota",
        "val": "ND"
    },
    {
        "label": "Ohio",
        "val": "OH"
    },
    {
        "label": "Oklahoma",
        "val": "OK"
    },
    {
        "label": "Oregon",
        "val": "OR"
    },
    {
        "label": "Pennsylvania",
        "val": "PA"
    },
    {
        "label": "Puerto Rico",
        "val": "PR"
    },
    {
        "label": "Rhode Island",
        "val": "RI"
    },
    {
        "label": "South Carolina",
        "val": "SC"
    },
    {
        "label": "South Dakota",
        "val": "SD"
    },
    {
        "label": "Tennessee",
        "val": "TN"
    },
    {
        "label": "Texas",
        "val": "TX"
    },
    {
        "label": "Utah",
        "val": "UT"
    },
    {
        "label": "Vermont",
        "val": "VT"
    },
    {
        "label": "Virginia",
        "val": "VA"
    },
    {
        "label": "Washington",
        "val": "WA"
    },
    {
        "label": "West Virginia",
        "val": "WV"
    },
    {
        "label": "Wisconsin",
        "val": "WI"
    },
    {
        "label": "Wyoming",
        "val": "WY"
    }
];

var creditScoreOptions = [
    {label: '600 - 619', val: '600'}, 
    {label: '620 - 639', val: '620'},
    {label: '640 - 659', val: '640'},
    {label: '660 - 679', val: '660'},
    {label: '680 - 699', val: '680'},
    {label: '700 - 719', val: '700'},
    {label: '720 - 739', val: '720'},
    {label: '740 - 759', val: '740'},
    {label: '760 - 779', val: '760'},
    {label: '780 - 799', val: '780'},
    {label: '800 - 819', val: '800'},
    {label: '820 - 839', val: '820'},
    {label: '840+', val: '840'}
];

var rateStructureOptions = [
    {label: 'Fixed', val: 'fixed'}, 
    {label: 'Adjustable', val: 'arm'}
];

var errorMessages = {
    'downpayment-too-high': 'Your down payment cannot be more than your house price.',
    'downpayment-too-low-fha': 'FHA loans typically require a down payment of at least ' + minDownpaymentPcts.fhaPercent + '%.',
    'downpayment-too-low-conf': 'Conventional loans typically require a down payment of at least ' + minDownpaymentPcts.confPercent + '%.',
    'is-arm': 'While some lenders may offer FHA, VA, or 15-year adjustable-rate mortgages, they are rare. We don’t have enough data to display results for these combinations. Choose a fixed rate if you’d like to try these options.'
}


var defaultScenario = scenarios['downpayment'];

module.exports = {
    scenarios: scenarios,
    loanCount: loanCount,
    defaultScenario: defaultScenario,
    minDownpaymentPcts: minDownpaymentPcts,
    stateOptions: stateOptions,
    errorMessages: errorMessages,
    creditScoreOptions: creditScoreOptions,
    rateStructureOptions: rateStructureOptions
};