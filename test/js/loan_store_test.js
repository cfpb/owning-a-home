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

        it('should reset loan but include existing data with id = 0', function() {
            var updateLoanStub = sinon.stub(loanStore, 'updateLoan');
            var fetchLDStub = sinon.stub(loanStore, 'fetchLoanData');

            var scenario = {'loanProps': [{'scenario0': 0}, {'scenario0': 1}, {'scenario0': 2}, {'scenario0': 3}]};
            var origLoans = loanStore._loans;

            loanStore._loans = [
                {'id': 0, 'rate-request': true, 'mtg-ins-request': false},
                {'id': 1, 'rate-request': false, 'mtg-ins-request': true}];
            loanStore.resetLoan(0, scenario);

            console.log(loanStore._loans);
            expect(loanStore._loans).to.deep.equal([
                    {'id': 0, 'rate-request': true, 'mtg-ins-request': false,
                    'credit-score': 700,
                    'downpayment': 20000,
                    'price': 200000,
                    'rate-structure': 'fixed',
                    'points': 0,
                    'loan-term': 30,
                    'loan-type': 'conf',
                    'arm-type': '5-1',
                    'state': 'AL',
                    'scenario0': 0}, 
                    {'id': 1, 'rate-request': false, 'mtg-ins-request': true}]);
            sinon.assert.calledOnce(loanStore.updateLoan);
            sinon.assert.calledOnce(loanStore.fetchLoanData);

            loanStore.updateLoan.restore();
            loanStore.fetchLoanData.restore();
            loanStore._loans = origLoans;
        });


        it('should reset loan including existing data with id != 0', function() {
            var updateLoanStub = sinon.stub(loanStore, 'updateLoan');
            var fetchLDStub = sinon.stub(loanStore, 'fetchLoanData');

            var scenario = {'loanProps': [{'scenario0': 0}, {'scenario0': 1}, {'scenario0': 2}, {'scenario0': 3}]};
            var origLoans = loanStore._loans;

            loanStore._loans = [
                {'id': 0, 'rate-request': true, 'mtg-ins-request': false},
                {'id': 1, 'rate-request': false, 'mtg-ins-request': true}];
            loanStore.resetLoan(1, scenario);

            console.log(loanStore._loans);
            expect(loanStore._loans).to.deep.equal([
                    {'id': 0, 'rate-request': true, 'mtg-ins-request': false},
                    {'id': 1,
                    'credit-score': 700,
                    'downpayment': 20000,
                    'price': 200000,
                    'rate-structure': 'fixed',
                    'points': 0,
                    'loan-term': 30,
                    'loan-type': 'conf',
                    'arm-type': '5-1',
                    'state': 'AL',
                    'scenario0': 1}, 
                    ]);
            sinon.assert.calledOnce(loanStore.updateLoan);
            sinon.assert.calledOnce(loanStore.fetchLoanData);

            loanStore.updateLoan.restore();
            loanStore.fetchLoanData.restore();
            loanStore._loans = origLoans;
        });
    });

    describe('update all loans', function() {
        it('should update all loans', function() {

            var updateLoanStub = sinon.stub(loanStore, 'updateLoan');

            var origLoans = loanStore._loans;
            loanStore._loans = [{}, {}, {}];

            loanStore.updateAllLoans("test", 4);

            sinon.assert.calledThrice(loanStore.updateLoan);
            loanStore.updateLoan.restore();
            loanStore._loans = origLoans;

        });
    });

    describe('update loan', function() {

        it('should update loan if rate has changed', function() {

            var updateLDStub = sinon.stub(loanStore, 'updateLoanDependencies');
            var validateLoanStub = sinon.stub(loanStore, 'validateLoan');
            var updateLCPropStub = sinon.stub(loanStore, 'updateLoanCalculatedProperties');
            var fetchLDStub = sinon.stub(loanStore, 'fetchLoanData');

            var origLoan0 = loanStore._loans[0];
            loanStore._loans[0] = { 'rate-request': true };


            loanStore.updateLoan(0, 'interest-rate', 4);

            sinon.assert.calledOnce(loanStore.updateLoanDependencies);
            sinon.assert.calledOnce(loanStore.validateLoan);
            sinon.assert.calledOnce(loanStore.updateLoanCalculatedProperties);
            sinon.assert.calledOnce(loanStore.fetchLoanData);
            expect(loanStore._loans[0]).to.deep.equal({'interest-rate': 4, 'edited': false, 'rate-request': true});

            loanStore.updateLoanDependencies.restore();
            loanStore.validateLoan.restore();
            loanStore.updateLoanCalculatedProperties.restore();
            loanStore.fetchLoanData.restore();
            loanStore._loans[0] = origLoan0;

        });      

        it('should update loan if rate has not changed', function() {

            var updateLDStub = sinon.stub(loanStore, 'updateLoanDependencies');
            var validateLoanStub = sinon.stub(loanStore, 'validateLoan');
            var updateLCPropStub = sinon.stub(loanStore, 'updateLoanCalculatedProperties');
            var fetchLDStub = sinon.stub(loanStore, 'fetchLoanData');

            var origLoan0 = loanStore._loans[0];
            loanStore._loans[0] = { 'rate-request': false };


            loanStore.updateLoan(0, 'other', 5);

            sinon.assert.calledOnce(loanStore.updateLoanDependencies);
            sinon.assert.calledOnce(loanStore.validateLoan);
            sinon.assert.calledOnce(loanStore.updateLoanCalculatedProperties);
            sinon.assert.notCalled(loanStore.fetchLoanData);
            expect(loanStore._loans[0]).to.deep.equal({'other': 5, 'edited': true, 'rate-request': false});

            loanStore.updateLoanDependencies.restore();
            loanStore.validateLoan.restore();
            loanStore.updateLoanCalculatedProperties.restore();
            loanStore.fetchLoanData.restore();
            loanStore._loans[0] = origLoan0;

        });

        it('should update loan if rate has not changed with no val', function() {

            var updateLDStub = sinon.stub(loanStore, 'updateLoanDependencies');
            var validateLoanStub = sinon.stub(loanStore, 'validateLoan');
            var updateLCPropStub = sinon.stub(loanStore, 'updateLoanCalculatedProperties');
            var fetchLDStub = sinon.stub(loanStore, 'fetchLoanData');

            var origLoan0 = loanStore._loans[0];
            loanStore._loans[0] = { 'rate-request': false };


            loanStore.updateLoan(0, 'other');

            sinon.assert.calledOnce(loanStore.updateLoanDependencies);
            sinon.assert.calledOnce(loanStore.validateLoan);
            sinon.assert.calledOnce(loanStore.updateLoanCalculatedProperties);
            sinon.assert.notCalled(loanStore.fetchLoanData);
            expect(loanStore._loans[0]).to.deep.equal({'other': null, 'edited': true, 'rate-request': false});

            loanStore.updateLoanDependencies.restore();
            loanStore.validateLoan.restore();
            loanStore.updateLoanCalculatedProperties.restore();
            loanStore.fetchLoanData.restore();
            loanStore._loans[0] = origLoan0;

        });     

    // @TODO: Will there ever be a case when prop is null/false?

    });

    describe('update downpayment constant', function() {
        it('should set downpayment constant to downpayment-percent when scenario is downpayment', function() {
            var scenario = {val: 'downpayment'};
            var origDPConstant = loanStore.downpaymentConstant;
            loanStore.downpaymentConstant = null;

            loanStore.updateDownpaymentConstant(scenario);

            expect(loanStore.downpaymentConstant).to.equal('downpayment-percent');

            loanStore.downpaymentConstant = origDPConstant;
        });

        it('should not set downpayment constant when scenario is not downpayment', function() {
            var scenario = {val: 'other'};
            var origDPConstant = loanStore.downpaymentConstant;
            loanStore.downpaymentConstant = "test";

            loanStore.updateDownpaymentConstant(scenario);

            expect(loanStore.downpaymentConstant).to.not.equal('downpayment-percent');
            expect(loanStore.downpaymentConstant).to.equal("test");

            loanStore.downpaymentConstant = origDPConstant;
        });
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
            loanStore._loans[0] = {};

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

    describe('process rate data', function() {
        it ('should process rates data and returns a dictionary with processed rates and median rates', function() {
            var data = { "4.5": 3, "4.25": 2,"4.75": 1};

            var result = loanStore.processRatesData(data);
            expect(result.median).to.equal(4.5);
            expect(result.vals).to.deep.equal([ { val: 4.25, label: '4.25%' }, { val: 4.5, label: '4.5%' }, { val: 4.75, label: '4.75%' } ]);
        });

        // May need a case to show that if key in data but not in data.hasOwnProperty
    });

    describe('update loan rates', function() {
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

