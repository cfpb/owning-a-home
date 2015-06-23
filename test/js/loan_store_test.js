var chai = require('chai');
var expect = chai.expect;
var loanStore;
var $;
var sinon = require('sinon');
var mortgageCalculations = require('../../src/static/js/modules/loan-comparison/mortgage-calculations.js');


describe('Loan store tests', function() {
    before(function () {
        $ = require('jquery');
        loanStore = require('../../src/static/js/modules/loan-comparison/stores/loan-store.js');
    });
    
    describe('reset all loans', function() {

    });

    describe('reset loan', function() {

    });

    describe('update all loans', function() {

    });

    describe('update loan', function() {

    });

    describe('update downpayment constant', function() {

    });

    describe('update loan dependencies', function() {
        it('should update downpayment-percent given updated downpayment property', function() {
            // given
            var prop = 'downpayment';
            var loan = {'price': 200000, 'downpayment-percent': 30, 'downpayment': 40000};
            loanStore.downpaymentConstant = '';
            // when
            loanStore.updateLoanDependencies(loan, prop);

            // then
            expect(loanStore.downpaymentConstant).to.equal('downpayment');
            expect(loan['price']).to.equal(200000);
            expect(loan['downpayment-percent']).to.equal(20);
            expect(loan['downpayment']).to.equal(40000);
        });

        it('should update downpayment given updated downpayment-percent property', function() {
            // given
            var prop = 'downpayment-percent';
            var loan = {'price': 200000, 'downpayment-percent': 5, 'downpayment': 40000};
            loanStore.downpaymentConstant = '';
            // when
            loanStore.updateLoanDependencies(loan, prop);

            // then
            expect(loanStore.downpaymentConstant).to.equal('downpayment-percent');
            expect(loan['price']).to.equal(200000);
            expect(loan['downpayment-percent']).to.equal(5);
            expect(loan['downpayment']).to.equal(10000);
        });

        it('should not update downpayment not given updated downpayment-percent property', function() {
            // given
            var prop = 'downpayment-percent';
            var loan = {'price': 200000, 'downpayment': 40000};
            loanStore.downpaymentConstant = '';
            // when
            loanStore.updateLoanDependencies(loan, prop);

            // then
            expect(loanStore.downpaymentConstant).to.equal('downpayment-percent');
            expect(loan['price']).to.equal(200000);
            expect(loan['downpayment-percent']).to.equal(20);
            expect(loan['downpayment']).to.equal(40000);
        });

        it('should update downpayment percent given price property', function() {
            // given
            var prop = 'price';
            var loan = {'price': 200000, 'downpayment-percent': 40, 'downpayment': 10000};
            loanStore.downpaymentConstant = '';
            // when
            loanStore.updateLoanDependencies(loan, prop);

            // then
            expect(loanStore.downpaymentConstant).to.equal('');
            expect(loan['price']).to.equal(200000);
            expect(loan['downpayment-percent']).to.equal(5);
            expect(loan['downpayment']).to.equal(10000);
        });


    });

 
    describe('fetch loan data', function() {

    });

    describe('fetch Insurance', function() {

    });

    describe('update loan insurance', function() {

    });

    describe('update loan rates', function() {

    });

    describe('process rate data', function() {

    });

    describe('update loan calculated properties', function() {

        it('should call to recalculate all output properties when rate changed', function() {
            // var mortgageCalculations = {
            //     'discount' : function (loan) { return 1; }, 
            //     'processing' : function (loan) { return 1; },
            //     'lender-fees' : function (loan) { return 1; }, 
            //     'third-party-fees' : function (loan) { return 1; },
            //     'third-party-services' : function (loan) { return 1; },
            //     'insurance' : function (loan) { return 1; }, 
            //     'taxes-gov-fees' : function (loan) { return 1; }, 
            //     'prepaid-expenses' : function (loan) { return 1; }, 
            //     'initial-escrow' : function (loan) { return 1; },
            //     'monthly-taxes-insurance' : function (loan) { return 1; }, 
            //     'monthly-hoa-dues' : function (loan) { return 1; }, 
            //     'monthly-principal-interest' : function (loan) { return 1; },
            //     'monthly-mortgage-insurance' : function (loan) { return 1; }, 
            //     'monthly-payment' : function (loan) { return 1; }, 
            //     'closing-costs' : function (loan) { return 1; }, 
            //     'principal-paid' : function (loan) { return 1; }, 
            //     'interest-fees-paid' : function (loan) { return 1; }, 
            //     'overall-costs' : function (loan) { return 1; }              
            // };

            // var mock = sinon.mock(mortgageCalculations);

            // mock.expects('discount').once();//.withExactArgs({'test': 1});

            // loanStore.updateLoanCalculatedProperties({'test': 1}, true);

            // mock.verify();

            // mock.restore();

            // var stub = sinon.stub(mortgageCalculations);

            // // var mcstub = function(loan) { return 1; }

            // loanStore.updateLoanCalculatedProperties({}, true);

            // sinon.assert.calledOnce(mortgageCalculations['discount']);
            // stub.restore();


            // manually create and restore the sandbox
            var sandbox;
            //beforeEach(function () {
            sandbox = sinon.sandbox.create();
            //});



        //it('should restore all mocks stubs and spies between tests', function() {
            sandbox.stub(mortgageCalculations); // note the use of "sandbox"
        //}
            loanStore.updateLoanCalculatedProperties({}, true);

            sinon.assert.calledOnce(mortgageCalculations['discount']);

        //afterEach(function () {
            sandbox.restore();
        //});

            // var common = { 
            //                 calculatedPropertiesBasedOnIR: ['test1', 'test2'],
            //                 calculatedProperties: ['test3', 'test4', 'test5']
            // };

            // var mortgageCalculations = {
            //     'test1': function (loan) { return 1; }
            //     'test2': function (loan) { return 2; }
            //     'test3': function (loan) { return 3; }
            //     'test4': function (loan) { return 4; }
            //     'test5': function (loan) { return 5; }

            // };

            // var mortgageCalculations = 
            // loanStore.updateLoanCalculatedProperties(loan, true);
        });
    });



    describe('loan type validation', function() {

        it('should return an error for a VA ARM loan', function() {
            var loan = {'rate-structure': 'arm', 'loan-type': 'va'};
            var result = loanStore.validators['loan-type'](loan);
            expect(result).to.exist();
            expect(loan['loan-type']).to.equal('conf');
            expect(result).to.equal('While some lenders may offer FHA, VA, or 15-year adjustable-rate mortgages, they are rare. We don’t have enough data to display results for these combinations. Choose a fixed rate if you’d like to try these options.');
        });

        it('should change FHA ARM loan to conventional', function() {
            var loan = {'rate-structure': 'arm', 'loan-type': 'fha'};
            var result = loanStore.validators['loan-type'](loan);
            expect(loan['loan-type']).to.equal('conf');
            expect(result).to.equal('While some lenders may offer FHA, VA, or 15-year adjustable-rate mortgages, they are rare. We don’t have enough data to display results for these combinations. Choose a fixed rate if you’d like to try these options.');
        });

        it('should not return an error for a conventional ARM loan', function() {
            expect(loanStore.validators['loan-type']({'rate-structure': 'arm', 'loan-type': 'conf'})).not.to.exist();
        });

    });

    describe('loan term validation', function() {

        it('should not return an error for 30-year ARM loan', function() {
            expect(loanStore.validators['loan-term']({'rate-structure': 'arm', 'loan-term': 30})).not.to.exist();
        });

        it('should return an error for 15-year ARM loan', function() {

            var loan = {'rate-structure': 'arm', 'loan-term': 15};
            var result = loanStore.validators['loan-term'](loan);
            expect(loan['loan-term']).to.equal(30);
            expect(result).to.equal('While some lenders may offer FHA, VA, or 15-year adjustable-rate mortgages, they are rare. We don’t have enough data to display results for these combinations. Choose a fixed rate if you’d like to try these options.');
        });

    });

    describe('downpayment validation', function() {
        it('should return an error if downpayment is higher than price', function() {
            var result = loanStore.validators['downpayment']({'downpayment': 300000, 'price': 200000});
            expect(result).to.equal('Your down payment cannot be more than your house price.');
        });

        it('should return an error if loan type is conventional, and downpayment is smaller than minimum percentage for conventional loan', function() {
            var result = loanStore.validators['downpayment']({'downpayment': 9999, 'price': 200000, 'loan-type': 'conf'});
            expect(result).to.equal('Conventional loans typically require a down payment of at least 5%.');
        });

        it('should return an error if loan type is FHA, and downpayment is smaller than minimum percentage for FHA loan', function() {
            var result = loanStore.validators['downpayment']({'downpayment': 6999, 'price': 200000, 'loan-type': 'fha'});
            expect(result).to.equal('FHA loans typically require a down payment of at least 3.5%.');
        });

        it('should not return an error if downpayment is not too high or too low for Conventional loan', function() {
            expect(loanStore.validators['downpayment']({'downpayment': 11000, 'price': 200000, 'loan-type': 'conf'})).not.to.exist();           
        });

        it('should not return an error if downpayment is not too high or too low for FHA loan', function() {
            expect(loanStore.validators['downpayment']({'downpayment': 8000, 'price': 200000, 'loan-type': 'fha'})).not.to.exist();           
        });

        it('should not return an error if downpayment is not too high or too low for non-FHA/Conventional loan', function() {
            expect(loanStore.validators['downpayment']({'downpayment': 7000, 'price': 200000, 'loan-type': 'va'})).not.to.exist();           
        });
    });

    describe('validate loan', function() {
        it('should have an empty loan error property if all valiators return no error', function() {
            var errors = {'downpayment': 'This will be removed.'};
            var loan = loanStore.validateLoan({ 'errors': errors,
                                                'downpayment': 7000,
                                                'price': 200000,
                                                'loan-type': 'va',
                                                'rate-structure': 'fixed' });

            expect(Object.keys(loan['errors']).length).to.equal(0);
        });

        it ('should have error for the property that does not validated', function() {
            var loan = loanStore.validateLoan({ 'downpayment': 6999,
                                                'price': 200000,
                                                'loan-type': 'fha',
                                                'rate-structure': 'fixed'});

            expect(Object.keys(loan['errors']).length).to.equal(1);
            expect(loan['errors']['downpayment']).to.equal('FHA loans typically require a down payment of at least 3.5%.');
        });

    });

});

