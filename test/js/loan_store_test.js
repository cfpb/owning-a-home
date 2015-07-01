var chai = require('chai');
var expect = chai.expect;
var loanStore;
var $;
var sinon = require('sinon');
var mortgageCalculations = require('../../src/static/js/modules/loan-comparison/mortgage-calculations.js');

var api;


describe('Loan store tests', function() {
    before(function () {
        $ = require('jquery');
        loanStore = require('../../src/static/js/modules/loan-comparison/stores/loan-store.js');
        api = require('../../src/static/js/modules/loan-comparison/api.js');
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

        it ('should not needed to stop request when no current request, and will update calculated properties when new request finishes successfully',
            function() {

            var stopRequestStub = sinon.stub(api, 'stopRequest');
            var fetchRatesStub = sinon.stub(loanStore, 'fetchRates');
            var fetchInsuranceStub = sinon.stub(loanStore, 'fetchInsurance');
            var updateLoanCalcPropStub = sinon.stub(loanStore, 'updateLoanCalculatedProperties');
            var emitChangeStub = sinon.stub(loanStore, 'emitChange');

            function okResponse() {
              var d = $.Deferred();
              d.resolve( {} );
              return d.promise();
            };

            fetchRatesStub.returns(okResponse());
            fetchInsuranceStub.returns(okResponse());

            var origLoan0 = loanStore._loans[0];
            loanStore._loans[0] = origLoan0 || {};

            loanStore._loans[0]['rate-request'] = null;
            loanStore._loans[0]['mtg-ins-request'] = null;

            loanStore.fetchLoanData(0);

            sinon.assert.notCalled(api.stopRequest);
            sinon.assert.calledOnce(loanStore.fetchRates);
            sinon.assert.calledOnce(loanStore.fetchInsurance);
            sinon.assert.calledOnce(loanStore.updateLoanCalculatedProperties);
            expect(loanStore._loans[0]['rate-request']).to.equal(null);
            expect(loanStore._loans[0]['mtg-ins-request']).to.equal(null);

            sinon.assert.calledOnce(loanStore.emitChange);

            api.stopRequest.restore();
            loanStore.fetchRates.restore();
            loanStore.fetchInsurance.restore();
            loanStore.updateLoanCalculatedProperties.restore();
            loanStore.emitChange.restore();

            loanStore._loans[0] = origLoan0;
        });

        it ('should stop request when no current request is pending, and will update calculated properties when new request finishes successfully',
            function() {

            var stopRequestStub = sinon.stub(api, 'stopRequest');
            var fetchRatesStub = sinon.stub(loanStore, 'fetchRates');
            var fetchInsuranceStub = sinon.stub(loanStore, 'fetchInsurance');
            var updateLoanCalcPropStub = sinon.stub(loanStore, 'updateLoanCalculatedProperties');
            var emitChangeStub = sinon.stub(loanStore, 'emitChange');

            function okResponse() {
              var d = $.Deferred();
              d.resolve( {} );
              return d.promise();
            };

            fetchRatesStub.returns(okResponse());
            fetchInsuranceStub.returns(okResponse());

            var origLoan0 = loanStore._loans[0];
            loanStore._loans[0] = origLoan0 || {};

            loanStore._loans[0]['rate-request'] = okResponse();
            loanStore._loans[0]['mtg-ins-request'] = okResponse();

            loanStore.fetchLoanData(0);

            sinon.assert.calledTwice(api.stopRequest);
            sinon.assert.calledOnce(loanStore.fetchRates);
            sinon.assert.calledOnce(loanStore.fetchInsurance);
            sinon.assert.calledOnce(loanStore.updateLoanCalculatedProperties);
            expect(loanStore._loans[0]['rate-request']).to.equal(null);
            expect(loanStore._loans[0]['mtg-ins-request']).to.equal(null);

            sinon.assert.calledOnce(loanStore.emitChange);

            api.stopRequest.restore();
            loanStore.fetchRates.restore();
            loanStore.fetchInsurance.restore();
            loanStore.updateLoanCalculatedProperties.restore();
            loanStore.emitChange.restore();

            loanStore._loans[0] = origLoan0;
        });
    });
 
    describe('fetch rates', function() {

        it('should call to update loan rates if fetch rate data was returned', function() {
            var fetchRateDataStub = sinon.stub(api, 'fetchRateData');

            function okResponse() {
              var d = $.Deferred();
              d.resolve( { "data": {"4.25": 3, "4.5": 2} } );
              return d.promise();
            };

            fetchRateDataStub.returns(okResponse());

            var updateLoanRatesStub = sinon.stub(loanStore, 'updateLoanRates');

            // Just return true so it doesn't call to update loan
            // TODO: May want to check what's in parameter lists
            updateLoanRatesStub.returns(true);

            loanStore.fetchRates({});

            sinon.assert.calledOnce(loanStore.updateLoanRates);
            //expect(loanStore.updateLoanRates).to.have.been.calledWith({}, {"4.25": 3, "4.5": 2});

            api.fetchRateData.restore();
            loanStore.updateLoanRates.restore();
        });

        it('should not call to update loan rates if fetch rate data was not returned', function() {
            var fetchRateDataStub = sinon.stub(api, 'fetchRateData');

            function errorResponse() {
             var d = $.Deferred();
             d.reject({},{},"could not complete");
             return d.promise();
            };

            fetchRateDataStub.returns(errorResponse());

            var updateLoanRatesStub = sinon.stub(loanStore, 'updateLoanRates');

            // Just return true so it doesn't call to update loan
            // TODO: May want to check what's in parameter lists
            updateLoanRatesStub.returns(true);

            loanStore.fetchRates({});

            sinon.assert.notCalled(loanStore.updateLoanRates);

            api.fetchRateData.restore();
            loanStore.updateLoanRates.restore();
        });

    });

    describe('fetch Insurance', function() {
        it('should call to update loan insurance if fetch mortgage insurance data was returned', function() {
            var fetchMIDataStub = sinon.stub(api, 'fetchMortgageInsuranceData');

            function okResponse() {
              var d = $.Deferred();
              d.resolve( { "data": {} } );
              return d.promise();
            };

            fetchMIDataStub.returns(okResponse());

            var updateLoanInsStub = sinon.stub(loanStore, 'updateLoanInsurance');

            // Just return true so it doesn't call to update loan
            // TODO: May want to check what's in parameter lists
            updateLoanInsStub.returns(true);

            loanStore.fetchInsurance({});

            sinon.assert.calledOnce(loanStore.updateLoanInsurance);

            api.fetchMortgageInsuranceData.restore();
            loanStore.updateLoanInsurance.restore();
        });

        it('should not call to update loan insurance if fetch mortgage insurance data was not returned', function() {
            var fetchMIDataStub = sinon.stub(api, 'fetchMortgageInsuranceData');

            function errorResponse() {
             var d = $.Deferred();
             d.reject({},{},"could not complete");
             return d.promise();
            };

            fetchMIDataStub.returns(errorResponse());

            var updateLoanInsStub = sinon.stub(loanStore, 'updateLoanInsurance');

            // Just return true so it doesn't call to update loan
            // TODO: May want to check what's in parameter lists
            updateLoanInsStub.returns(true);

            loanStore.fetchInsurance({});

            sinon.assert.notCalled(loanStore.updateLoanInsurance);

            api.fetchMortgageInsuranceData.restore();
            loanStore.updateLoanInsurance.restore();
        });
    });

    describe('update loan insurance', function() {
        it('should update loan property mtg-ins-data given data', function() {
            var loan = {};
            loanStore.updateLoanInsurance(loan, "data");
            expect(loan['mtg-ins-data']).to.equal("data");
        });
    });

    describe('update loan rates', function() {
        // it('should update loan rate property given data', function() {
        //     var loan = {};
        //     loanStore.updateLoanRates(loan, )
        // });
    });

    describe('process rate data', function() {
        it('should fill out rate related properties in loan', function() {
            var loan = {};
            var procRatesDataStub = sinon.stub(loanStore, 'processRatesData');

            procRatesDataStub.returns({'vals': 1, 'median': 2});

            loanStore.updateLoanRates(loan, 'data');

            sinon.assert.calledOnce(loanStore.processRatesData);
            expect(loan['rates']).to.equal(1);
            expect(loan['interest-rate']).to.equal(2);
            expect(loan['edited']).to.equal(false);
            
            loanStore.processRatesData.restore();
        });
    });

    describe('update loan calculated properties', function() {

        it('should call to recalculate all output properties when rate changed', function() {
            var sandbox = sinon.sandbox.create();
            sandbox.stub(mortgageCalculations);

            loanStore.updateLoanCalculatedProperties({}, true);

            sinon.assert.calledOnce(mortgageCalculations['discount']);
            sinon.assert.calledOnce(mortgageCalculations['processing']);
            sinon.assert.calledOnce(mortgageCalculations['lender-fees']);
            sinon.assert.calledOnce(mortgageCalculations['third-party-fees']);
            sinon.assert.calledOnce(mortgageCalculations['third-party-services']);
            sinon.assert.calledOnce(mortgageCalculations['insurance']);
            sinon.assert.calledOnce(mortgageCalculations['taxes-gov-fees']);
            sinon.assert.calledOnce(mortgageCalculations['prepaid-expenses']);
            sinon.assert.calledOnce(mortgageCalculations['initial-escrow']);
            sinon.assert.calledOnce(mortgageCalculations['monthly-taxes-insurance']);
            sinon.assert.calledOnce(mortgageCalculations['monthly-hoa-dues']);
            sinon.assert.calledOnce(mortgageCalculations['monthly-principal-interest']);
            sinon.assert.calledOnce(mortgageCalculations['monthly-mortgage-insurance']);
            sinon.assert.calledOnce(mortgageCalculations['monthly-payment']);
            sinon.assert.calledOnce(mortgageCalculations['closing-costs']);
            sinon.assert.calledOnce(mortgageCalculations['principal-paid']);
            sinon.assert.calledOnce(mortgageCalculations['interest-fees-paid']);
            sinon.assert.calledOnce(mortgageCalculations['overall-costs']);

            sandbox.restore();

        });

        it('should call to recalculate all output properties when rate is not changed', function() {
            var sandbox = sinon.sandbox.create();
            sandbox.stub(mortgageCalculations);

            var result = loanStore.updateLoanCalculatedProperties({}, false);

            sinon.assert.calledOnce(mortgageCalculations['loan-summary']);
            sinon.assert.calledOnce(mortgageCalculations['loan-amount']);

            sandbox.restore();

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

