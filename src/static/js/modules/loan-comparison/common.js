var common = {};

common.loanCount = 2;

common.minDownpaymentPcts = {
    fha: .035,
    fhaPercent: 3.5,
    conf: .05,
    confPercent: 5
};

common.scenarios = {
    'downpayment': {
        'title': 'Down Payment',
        'intro': "Your down payment affects all aspects of your costs. Putting down less up front can be a good option for home buyers without a lot of cash on hand, but you'll have a larger loan to pay off over time. In general, that means that you'll have higher monthly payments and pay more in interest and fees. This tool will help you get a sense of how much the difference in cost is likely to be, so you can make tradeoffs.",
        'rows': {
            input: {
                'downpayment': "We've chosen two common down payment amounts. Feel free to adjust these numbers.", 
                'loan-amount': "The lower your down payment, the higher the amount you need to borrow.", 
                'interest-rate': "You'll often pay a higher interest rate with a lower down payment, but how much higher depends on your credit score and the particular lender."
            },
            active: ['downpayment'],
            output: {
                'cash-to-close': "A lower down payment means you'll need less cash at the closing table, but you may pay more in fees.", 
                'insurance': "With a conventional loan, mortgage insurcance is typically paid as part of your monthly payment, not upfront.", 
                'monthly-principal-interest': "With a lower down payment, you have more to pay back each month, and you're paying interest on a larger loan amount.", 
                'monthly-mortgage-insurance': "With a low down payment loan (typically less than 20%), you'll need to pay for mortgage insurance.", 
                'overall-cost': "Overall, you'll pay more in interest and fees with a low down payment loan."
            }
        }
        
    }
}


module.exports = common;