var chai = require('chai');
var expect = chai.expect;
var loanStore;
var common;
var scenarioStore;
var $;
var sinon = require('sinon');
var mortgageCalculations = require('../../src/static/js/modules/loan-comparison/mortgage-calculations.js');
var common = require('../../src/static/js/modules/loan-comparison/common.js');
var sandbox;
var assign = require('object-assign');
var jumbo = require('jumbo-mortgage');

var appDispatcher = require('../../src/static/js/modules/loan-comparison/dispatcher/app-dispatcher.js');
var LoanConstants = require('../../src/static/js/modules/loan-comparison/constants/loan-constants.js');

var api;

describe('Loan store tests', function() {
    before(function () {
        $ = require('jquery');
        loanStore = require('../../src/static/js/modules/loan-comparison/stores/loan-store.js');
        scenarioStore = require('../../src/static/js/modules/loan-comparison/stores/scenario-store.js');
        api = require('../../src/static/js/modules/loan-comparison/api.js');
    });

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('init', function() {
        it('should reset all loans to the default values when init', function() {
            var initStub = sinon.stub(loanStore, 'resetAllLoans');
            loanStore.init();
            sinon.assert.calledOnce(loanStore.resetAllLoans);
            loanStore.resetAllLoans.restore();
        });
    });

    describe('reset all loans', function() {
        var getScenarioStub, updateDPConstStub, resetLoanStub, origLoans, loan;

        beforeEach(function () {
            getScenarioStub = sandbox.stub(scenarioStore, 'getScenario');
            updateDPConstStub = sandbox.stub(loanStore, 'updateDownpaymentConstant');
            resetLoanStub = sandbox.stub(loanStore, 'resetLoan');
            origLoans = loanStore._loans;
            loan = {'loan': 'value'};
            resetLoanStub.returns(loan);
        });

        afterEach(function () {
            loanStore._loans = origLoans;
        });

        it('should initialize two loan scenarios to their default values when there are currently no loans in the store', function() {
            loanStore._loans = []; // So this will use common.loanCount = 2

            loanStore.resetAllLoans();

            sinon.assert.calledOnce(scenarioStore.getScenario);
            sinon.assert.calledOnce(loanStore.updateDownpaymentConstant);
            sinon.assert.calledTwice(loanStore.resetLoan);
            expect(loanStore._loans).to.deep.equal([loan, loan])
        });

        it('should reset loan to its default value when there is one loan in the store', function() {
            loanStore._loans = [{}]; // So this will not use common.loanCount = 2

            getScenarioStub.returns({'downpayment': 'test'});
            loanStore.resetAllLoans();

            sinon.assert.calledOnce(scenarioStore.getScenario);
            sinon.assert.calledOnce(loanStore.updateDownpaymentConstant);
            sinon.assert.calledOnce(loanStore.resetLoan);
            expect(loanStore._loans).to.deep.equal([loan])

        });

        it('should not reset all loans to their default values when scenario object is not available', function() {
            loanStore._loans = [{}]; // So this will not use common.loanCount = 2

            getScenarioStub.returns(null);
            loanStore.resetAllLoans();

            sinon.assert.calledOnce(scenarioStore.getScenario);
            sinon.assert.notCalled(loanStore.updateDownpaymentConstant);
            sinon.assert.notCalled(loanStore.resetLoan);
        });
    });

    describe('reset loan', function() {
        it('should reset loan without downpayment-percent value', function() {
            var id = 1;
            var loan = {'loan': 'value'};
            var scenario = {'scenario': 'value'}

            sandbox.stub(loanStore, 'setupLoanData', function () {return loan});
            sandbox.stub(loanStore, 'setLoanName');
            sandbox.stub(loanStore, 'updateCalculatedValues');
            sandbox.stub(loanStore, 'validateLoan');
            sandbox.stub(loanStore, 'fetchLoanData');
            sandbox.stub(loanStore, 'fetchCounties');

            loanStore.resetLoan(id, loan, scenario);

            sinon.assert.calledOnce(loanStore['setupLoanData']);
            sinon.assert.calledWith(loanStore['setupLoanData'], id, loan, scenario);
            sinon.assert.calledOnce(loanStore['setLoanName']);
            sinon.assert.calledWith(loanStore['setLoanName'], loan);
            sinon.assert.calledTwice(loanStore['updateCalculatedValues']);
            sinon.assert.calledWith(loanStore['updateCalculatedValues'], loan, 'downpayment-percent');
            sinon.assert.calledWith(loanStore['updateCalculatedValues'], loan, ['loan-amount', 'loan-summary']);
            sinon.assert.calledOnce(loanStore['validateLoan']);
            sinon.assert.calledWith(loanStore['validateLoan'], loan);
            sinon.assert.calledOnce(loanStore['fetchLoanData']);
            sinon.assert.calledWith(loanStore['fetchLoanData'], loan);
            sinon.assert.calledOnce(loanStore['fetchCounties']);
            sinon.assert.calledWith(loanStore['fetchCounties'], loan, true);
        });

        it('should reset loan with an empty loan', function() {
            var id = 1;
            var loan = {'loan': 'value'};
            var scenario = {'scenario': 'value'};

            sandbox.stub(loanStore, 'setupLoanData', function () {return loan});
            sandbox.stub(loanStore, 'updateCalculatedValues');
            sandbox.stub(loanStore, 'validateLoan');
            sandbox.stub(loanStore, 'fetchLoanData');
            sandbox.stub(loanStore, 'fetchCounties');

            loanStore.resetLoan(id, null, scenario);

            sinon.assert.calledOnce(loanStore['setupLoanData']);
            sinon.assert.calledWith(loanStore['setupLoanData'], id, {}, scenario);
            sinon.assert.calledTwice(loanStore['updateCalculatedValues']);
            sinon.assert.calledWith(loanStore['updateCalculatedValues'], loan, 'downpayment-percent');
            sinon.assert.calledWith(loanStore['updateCalculatedValues'], loan, ['loan-amount', 'loan-summary']);
            sinon.assert.calledOnce(loanStore['validateLoan']);
            sinon.assert.calledWith(loanStore['validateLoan'], loan);
            sinon.assert.calledOnce(loanStore['fetchLoanData']);
            sinon.assert.calledWith(loanStore['fetchLoanData'], loan);
            sinon.assert.calledOnce(loanStore['fetchCounties']);
            sinon.assert.calledWith(loanStore['fetchCounties'], loan, true);
        });

        it('should reset loan with downpayment-percent value', function() {
            var id = 1;
            var loan = {'loan': 'value', 'downpayment-percent': 'value'};
            var scenario = {'scenario': 'value'}

            sandbox.stub(loanStore, 'setupLoanData', function () {return loan});
            sandbox.stub(loanStore, 'setLoanName');
            sandbox.stub(loanStore, 'updateCalculatedValues');
            sandbox.stub(loanStore, 'validateLoan');
            sandbox.stub(loanStore, 'fetchLoanData');
            sandbox.stub(loanStore, 'fetchCounties');

            loanStore.resetLoan(id, loan, scenario);

            sinon.assert.calledOnce(loanStore['setupLoanData']);
            sinon.assert.calledWith(loanStore['setupLoanData'], id, loan, scenario);
            sinon.assert.calledOnce(loanStore['setLoanName']);
            sinon.assert.calledWith(loanStore['setLoanName'], loan);
            sinon.assert.calledOnce(loanStore['updateCalculatedValues']);
            sinon.assert.calledWith(loanStore['updateCalculatedValues'], loan, ['loan-amount', 'loan-summary']);
            sinon.assert.calledOnce(loanStore['validateLoan']);
            sinon.assert.calledWith(loanStore['validateLoan'], loan);
            sinon.assert.calledOnce(loanStore['fetchLoanData']);
            sinon.assert.calledWith(loanStore['fetchLoanData'], loan);
            sinon.assert.calledOnce(loanStore['fetchCounties']);
            sinon.assert.calledWith(loanStore['fetchCounties'], loan, true);
        });

    });
    describe('set loan name', function() {
        it('should set alphabetical names for loans', function () {
            var loanA = {id: 0};
            var loanB = {id: 1};
            
            loanStore.setLoanName(loanA);
            expect(loanA.name).to.equal('a');
            
            loanStore.setLoanName(loanB);
            expect(loanB.name).to.equal('b');
        });
    });
    
    // This suite is only needed if pre-pop scenarios are being used
    describe('setup loan data', function() {
        it('should setup loan data, including existing data with id = 0', function() {
            var scenario = {'loanProps': [{'scenario0': 0}, {'scenario0': 1}, {'scenario0': 2}, {'scenario0': 3}]};
            var origLoans = loanStore._loans;

            loanStore._loans = [
                {'id': 0, 'rate-request': true, 'mtg-ins-request': false, 'credit-score': 'score'},
                {'id': 1, 'rate-request': false, 'mtg-ins-request': true}
            ];

            var loan = loanStore.setupLoanData(0, loanStore._loans[0], scenario);

            expect(loan).to.deep.equal({
                    'id': 0,
                    'rate-request': true,
                    'mtg-ins-request': false,
                    'credit-score': 'score',
                    'downpayment': 20000,
                    'price': 200000,
                    'rate-structure': 'fixed',
                    'points': 0,
                    'loan-term': 30,
                    'loan-type': 'conf',
                    'arm-type': '5-1',
                    'state': 'AL',
                    'scenario0': 0
            });

            loanStore._loans = origLoans;

        });

        it('should setup loan data, including existing data from loan 0, for loan with id != 0', function() {

            var scenario = {'loanProps': [{'scenario0': 0}, {'scenario0': 1}, {'scenario0': 2}, {'scenario0': 3}]};
            var origLoans = loanStore._loans;

            loanStore._loans = [
                {'id': 0, 'rate-request': true, 'mtg-ins-request': false, 'credit-score': 'score'},
                {'id': 1, 'rate-request': false, 'mtg-ins-request': true}
            ];

            var loan = loanStore.setupLoanData(1, loanStore._loans[1], scenario);

            expect(loan).to.deep.equal({
                'id': 1,
                'credit-score': 'score',
                'downpayment': 20000,
                'price': 200000,
                'rate-structure': 'fixed',
                'points': 0,
                'loan-term': 30,
                'loan-type': 'conf',
                'arm-type': '5-1',
                'state': 'AL',
                'scenario0': 1
            });

            loanStore._loans = origLoans;
        });

        it('should setup loan data with empty scenario', function() {
          var loan = loanStore.setupLoanData(0, {'myId': 24, 'newField': 'value'}, null);
          expect(loan).to.deep.equal({
            'myId': 24,
            'newField': 'value',
            'downpayment': 20000,
            'price': 200000,
            'rate-structure': 'fixed',
            'points': 0,
            'loan-term': 30,
            'loan-type': 'conf',
            'arm-type': '5-1',
            'state': 'AL',
            'id': 0,
            'credit-score': 700
          });
        });
    });

    describe('update all loans', function() {
        it('should iterate through all loans and update them based on their inputs', function() {
            var updateLoanStub = sandbox.stub(loanStore, 'updateLoan');
            var origLoans = loanStore._loans;
            loanStore._loans = [{}, {}, {}];
            loanStore.updateAllLoans("test", 4);
            sinon.assert.calledThrice(loanStore.updateLoan);
            loanStore._loans = origLoans;
        });
    });

    describe('update loan', function() {
        // TODO: test update flow with all possible props in integration/flow tests file

        beforeEach(function () {
            sandbox.stub(loanStore, 'updateLoanDependencies');
            sandbox.stub(loanStore, 'validateLoan');
            sandbox.stub(loanStore, 'fetchLoanData');
            sandbox.stub(loanStore, 'updateLoanCalculations');
        });

        it('should update interest-rate value & dependencies & calculations, but not validate loan or fetch loan data', function () {
            var loan = {};
            var prop = 'interest-rate';

            loanStore.updateLoan(loan, prop, 42);

            expect(loan[prop]).to.equal(42);
            expect(loan['edited']).to.equal(false);
            sinon.assert.calledOnce(loanStore.updateLoanDependencies);
            sinon.assert.notCalled(loanStore.validateLoan);
            sinon.assert.notCalled(loanStore.fetchLoanData);
            sinon.assert.calledOnce(loanStore.updateLoanCalculations);
        });

        it('should update county value & dependencies & calculations & validations, but not fetch loan data', function () {
            var loan = {};
            var prop = 'county';

            loanStore.updateLoan(loan, prop, 42);

            expect(loan[prop]).to.equal(42);
            expect(loan['edited']).to.equal(false);
            sinon.assert.calledOnce(loanStore.updateLoanDependencies);
            sinon.assert.calledOnce(loanStore.validateLoan);
            sinon.assert.notCalled(loanStore.fetchLoanData);
            sinon.assert.calledOnce(loanStore.updateLoanCalculations);
        });

        it('should update other property value & dependencies & calculations & validations, and fetch loan data', function () {
            var loan = {'rate-request': 'request'};
            var prop = 'other';

            loanStore.updateLoan(loan, prop, 42);

            expect(loan[prop]).to.equal(42);
            expect(loan['edited']).to.equal(true);
            sinon.assert.calledOnce(loanStore.updateLoanDependencies);
            sinon.assert.calledOnce(loanStore.validateLoan);
            sinon.assert.calledOnce(loanStore.fetchLoanData);
            sinon.assert.calledOnce(loanStore.updateLoanCalculations);
        });
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

        it('should not set downpayment constant when scenario is null', function() {
          var origDPConstant = loanStore.downpaymentConstant;
          loanStore.downpaymentConstant = 'test';
          loanStore.updateDownpaymentConstant(null);
          expect(loanStore.downpaymentConstant).to.equal('test');
          loanStore.downpaymentConstant = origDPConstant;
        });

    });

    describe('update downpayment dependencies', function() {
        describe('changed downpayment value: ', function() {
            it('should update downpayment-percent, loan amount, and downpaymentConstant given updated downpayment argument', function() {

                // given
                var prop = 'downpayment';
                var loan = {'price': 200000, 'downpayment-percent': 30, 'downpayment': 40000};
                loanStore.downpaymentConstant = 'downpayment-percent';

                // when
                loanStore.updateDownpaymentDependencies(loan, prop);

                // then
                expect(loanStore.downpaymentConstant).to.equal('downpayment');
                expect(loan['price']).to.equal(200000);
                expect(loan['downpayment-percent']).to.equal(20);
                expect(loan['downpayment']).to.equal(40000);
                expect(loan['loan-amount']).to.equal(160000);
            });

            it('should update downpayment, downpaymentConstant, and loan amount given downpayment-percent argument', function() {
                // given
                var prop = 'downpayment-percent';
                var loan = {'price': 200000, 'downpayment-percent': 5, 'downpayment': 40000};
                loanStore.downpaymentConstant = 'downpayment';

                // when
                loanStore.updateDownpaymentDependencies(loan, prop);

                // then
                expect(loanStore.downpaymentConstant).to.equal('downpayment-percent');
                expect(loan['price']).to.equal(200000);
                expect(loan['downpayment-percent']).to.equal(5);
                expect(loan['downpayment']).to.equal(10000);
                expect(loan['loan-amount']).to.equal(190000);
            });

            it('should update downpayment, not downpaymentConstant, and loan amount given downpayment-percent argument', function() {
                // given
                var prop = 'test';
                var loan = {'price': 200000, 'downpayment-percent': 5, 'downpayment': 40000};
                loanStore.downpaymentConstant = 'downpayment-percent';

                // when
                loanStore.updateDownpaymentDependencies(loan, prop);

                // then
                expect(loanStore.downpaymentConstant).to.equal('downpayment-percent');
                expect(loan['price']).to.equal(200000);
                expect(loan['downpayment-percent']).to.equal(5);
                expect(loan['downpayment']).to.equal(10000);
                expect(loan['loan-amount']).to.equal(190000);
            });

        });

        describe('changed price value: ', function() {
            it('should not change downpaymentConstant, but it should update loan amount and downpayment-percent (since constant is downpayment)', function() {
                // given
                var prop = 'price';
                var loan = {'price': 200000, 'downpayment': 10000};
                loanStore.downpaymentConstant = 'downpayment';

                // when
                loanStore.updateDownpaymentDependencies(loan, prop);

                // then
                expect(loanStore.downpaymentConstant).to.equal('downpayment');
                expect(loan['price']).to.equal(200000);
                expect(loan['downpayment']).to.equal(10000);
                expect(loan['downpayment-percent']).to.equal(5);
                expect(loan['loan-amount']).to.equal(190000);
            });

            it('should not change downpaymentConstant, but it should update loan amount and downpayment (since constant is downpayment-percent)', function() {
                // given
                var prop = 'price';
                loanStore.downpaymentConstant = 'downpayment-percent';
                var loan = {
                    'price': 200000,
                    'downpayment-percent': 40
                };

                // when
                loanStore.updateDownpaymentDependencies(loan, prop);

                // then
                expect(loanStore.downpaymentConstant).to.equal('downpayment-percent');
                expect(loan['price']).to.equal(200000);
                expect(loan['downpayment-percent']).to.equal(40);
                expect(loan['downpayment']).to.equal(80000);
                expect(loan['loan-amount']).to.equal(120000);
            });
        });
    });

    describe('update loan dependencies', function() {

        beforeEach(function () {
            sandbox.stub(loanStore, 'updateDownpaymentDependencies');
            sandbox.stub(loanStore, 'resetCounty');
        });

        describe('downpayment props', function() {
            var downpaymentValues = ['downpayment', 'downpayment-percent', 'price'];

            function testDownpaymentDependencies(val) {
                it('should call downpayment dependencies update function for param ' + val, function () {
                    loanStore.updateLoanDependencies({}, val);
                    sinon.assert.calledOnce(loanStore['updateDownpaymentDependencies']);
                    sinon.assert.notCalled(loanStore['resetCounty']);
                });
            }

            for (var i = 0; i<downpaymentValues.length; i++) {
              testDownpaymentDependencies(downpaymentValues[i]);
            }
        });

        describe('other props', function() {
            it('should call reset county function for param state', function() {
                loanStore.updateLoanDependencies({}, 'state');

                sinon.assert.calledOnce(loanStore['resetCounty']);
                sinon.assert.notCalled(loanStore['updateDownpaymentDependencies']);
            });

            it('should not update dependencies when called without designated params', function() {
                loanStore.updateLoanDependencies({}, 'interest-rate');

                sinon.assert.notCalled(loanStore['resetCounty']);
                sinon.assert.notCalled(loanStore['updateDownpaymentDependencies']);
            });
        });
    });

    describe('update loan calculations', function() {

        describe('loan summary params: ', function() {
            var loanSummaryValues = ['loan-type', 'loan-term', 'rate-structure', 'arm-type'];

            var defaultLoan = {
                'loan-type': 'conf',
                'loan-term': 30,
                'rate-structure': 'fixed'
            };

            function testLoanSummaryCalculations(val) {
                it('should update loan summary calculation when called with param ' + val, function() {
                    var loan = assign({}, defaultLoan);
                    sandbox.spy(loanStore, 'updateCalculatedValues');

                    loanStore.updateLoanCalculations(loan, val);

                    sinon.assert.calledOnce(loanStore['updateCalculatedValues']);
                    sinon.assert.calledWith(loanStore['updateCalculatedValues'], loan, 'loan-summary');
                    expect(loan['loan-summary']).to.equal('30-year fixed conventional');
                });
            }

            for (var i = 0; i<loanSummaryValues.length; i++) {
              testLoanSummaryCalculations(loanSummaryValues[i]);
            }
        });

        describe('interest rate param: ', function() {
            it('should update interest rate calculations when called with param interest rate', function() {
                sandbox.stub(loanStore, 'updateCalculatedValues');
                var loan = {};
                loanStore.updateLoanCalculations(loan, 'interest-rate');

                sinon.assert.calledOnce(loanStore['updateCalculatedValues']);
                sinon.assert.calledWith(loanStore['updateCalculatedValues'], loan, common.calculatedPropertiesBasedOnIR);
            });

        });

        it('should not update calculated values when called without designated params', function() {
            var loan = {};
            sandbox.stub(loanStore, 'updateCalculatedValues');

            loanStore.updateLoanCalculations(loan, 'price');

            sinon.assert.notCalled(loanStore['updateCalculatedValues']);
        });

    });

    describe('reset county', function() {
        it('should reset county values on loan & call method to fetch new county data', function() {
            sandbox.stub(loanStore, 'fetchCounties', function () {});

            var loan = {county: 2, counties: [{'complete_fips': 1}, {'complete_fips': 2}], 'county-dict': {2: {}}};
            loanStore.resetCounty(loan);

            expect(loan['county']).not.to.exist();
            expect(loan['counties']).not.to.exist();
            expect(loan['county-dict']).not.to.exist();
            sinon.assert.calledOnce(loanStore['fetchCounties']);
            sinon.assert.calledWith(loanStore['fetchCounties'], loan);
        });
    });

    describe('cancel an existing request', function() {
        beforeEach(function () {
            sandbox.stub(api, 'stopRequest')
        });

        it('should cancel an existing request on a loan and set request prop to null', function () {
            var requestProp = 'test-req';
            var loan = {'test-req': 'test'};

            loanStore.cancelExistingRequest(loan, requestProp);

            sinon.assert.calledOnce(api['stopRequest']);
            expect(loan[requestProp]).to.equal(null);
        });

        it('should do nothing if there is no existing request on the loan', function () {
            var requestProp = 'test-req';
            var loan = {};

            loanStore.cancelExistingRequest(loan, requestProp);

            sinon.assert.notCalled(api['stopRequest']);
            expect(loan[requestProp]).to.equal(undefined);
        });

    });

    describe('fetch loan data', function() {
        var stopExistingRequest, fetchRatesStub, fetchInsuranceStub, updateLoanCalcPropStub, emitChangeStub;

        beforeEach(function () {
            stopExistingRequest = sandbox.stub(loanStore, 'cancelExistingRequest');
            fetchRatesStub = sandbox.stub(loanStore, 'fetchRates');
            fetchInsuranceStub = sandbox.stub(loanStore, 'fetchInsurance');
            updateLoanCalcPropStub = sandbox.stub(loanStore, 'updateLoanCalculations');
            emitChangeStub = sandbox.stub(loanStore, 'emitChange');
        });

        it ('should succeed at fetching data', function() {
            function okResponse() {
              var d = $.Deferred();
              d.resolve( {} );
              return d.promise();
            };

            fetchRatesStub.returns(okResponse());
            fetchInsuranceStub.returns(okResponse());

            var loan = {'rate-request': 'req', 'mtg-ins-request': 'req'};

            loanStore.fetchLoanData(loan);

            sinon.assert.calledTwice(loanStore.cancelExistingRequest);
            sinon.assert.calledOnce(loanStore.fetchRates);
            sinon.assert.calledOnce(loanStore.fetchInsurance);
            sinon.assert.calledOnce(loanStore.updateLoanCalculations);

            expect(loan['rate-request']).to.equal(null);
            expect(loan['mtg-ins-request']).to.equal(null);
            sinon.assert.calledOnce(loanStore.emitChange);
        });

        it ('should fail at fetching data', function() {
            function failedResponse() {
              var d = $.Deferred();
              d.reject( {} );
              return d.promise();
            };

            fetchRatesStub.returns(failedResponse());
            fetchInsuranceStub.returns(failedResponse());

            var loan = {'rate-request': 'req', 'mtg-ins-request': 'req'};

            loanStore.fetchLoanData(loan);

            sinon.assert.calledTwice(loanStore.cancelExistingRequest);
            sinon.assert.calledOnce(loanStore.fetchRates);
            sinon.assert.calledOnce(loanStore.fetchInsurance);
            sinon.assert.notCalled(loanStore.updateLoanCalculations);

            expect(loan['rate-request']).to.equal(null);
            expect(loan['mtg-ins-request']).to.equal(null);
            sinon.assert.calledOnce(loanStore.emitChange);
        });
    });

    describe('fetch rates', function() {
        var fetchRateDataStub, updateLoanRatesStub;

        beforeEach(function () {
            fetchRateDataStub = sandbox.stub(api, 'fetchRateData');
            updateLoanRatesStub = sandbox.stub(loanStore, 'updateLoanRates');
        });

        it('should call to update loan rates if fetch rate data was returned', function() {
            function okResponse() {
              var d = $.Deferred();
              d.resolve( { "data": {"4.25": 3, "4.5": 2} } );
              return d.promise();
            };

            fetchRateDataStub.returns(okResponse());

            // Just return true so it doesn't call to update loan
            // TODO: May want to check what's in parameter lists
            updateLoanRatesStub.returns(true);

            loanStore.fetchRates({});

            sinon.assert.calledOnce(loanStore.updateLoanRates);
            sinon.assert.calledWith(loanStore.updateLoanRates, {}, {"4.25": 3, "4.5": 2});
        });

        it('should call to update loan rates if fetch rate data was returned', function() {
            function okEmptyResponse() {
              var d = $.Deferred();
              // our API doesn't return such results
              d.resolve( null );
              return d.promise();
            };

            fetchRateDataStub.returns(okEmptyResponse());

            // Just return true so it doesn't call to update loan
            // TODO: May want to check what's in parameter lists
            updateLoanRatesStub.returns(true);

            loanStore.fetchRates({});

            sinon.assert.calledOnce(loanStore.updateLoanRates);
            sinon.assert.calledWith(loanStore.updateLoanRates, {}, undefined);
        });

        it('should not call to update loan rates if fetch rate data was not returned', function() {
            function errorResponse() {
             var d = $.Deferred();
             d.reject({},{},"could not complete");
             return d.promise();
            };

            fetchRateDataStub.returns(errorResponse());

            loanStore.fetchRates({});

            sinon.assert.notCalled(loanStore.updateLoanRates);
        });
    });

    describe('fetch insurance', function() {
        var fetchMIDataStub, updateLoanInsStub;

        beforeEach(function () {
            fetchMIDataStub = sandbox.stub(api, 'fetchMortgageInsuranceData');
            updateLoanInsStub = sandbox.stub(loanStore, 'updateLoanInsurance');
        });

        it('should call to update loan insurance if fetch mortgage insurance data was returned', function() {
            function okResponse() {
              var d = $.Deferred();
              d.resolve( { "data": {} } );
              return d.promise();
            };

            fetchMIDataStub.returns(okResponse());
            // Just return true so it doesn't call to update loan
            // TODO: May want to check what's in parameter lists
            updateLoanInsStub.returns(true);

            loanStore.fetchInsurance({});

            sinon.assert.calledOnce(loanStore.updateLoanInsurance);
        });

        it('should call to update loan insurance if fetch mortgage insurance data was returned', function() {
            function okEmptyResponse() {
              var d = $.Deferred();
              d.resolve( null );
              return d.promise();
            };

            fetchMIDataStub.returns(okEmptyResponse());
            // Just return true so it doesn't call to update loan
            // TODO: May want to check what's in parameter lists
            updateLoanInsStub.returns(true);

            loanStore.fetchInsurance({});

            sinon.assert.calledOnce(loanStore.updateLoanInsurance);
        });

        it('should not call to update loan insurance if fetch mortgage insurance data was not returned', function() {
            function errorResponse() {
             var d = $.Deferred();
             d.reject({},{},"could not complete");
             return d.promise();
            };

            fetchMIDataStub.returns(errorResponse());

            loanStore.fetchInsurance({});

            sinon.assert.notCalled(loanStore.updateLoanInsurance);
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
        it('should fill out rate related properties in loan', function() {
            var loan = {};
            var procRatesDataStub = sandbox.stub(loanStore, 'processRatesData');
            var loanUpdateStub = sandbox.stub(loanStore, 'updateLoan', function (loan, prop, val) {
                loan[prop] = val;
            });

            procRatesDataStub.returns({'vals': 1, 'median': 2});
            loanStore.updateLoanRates(loan, 'data');

            sinon.assert.calledOnce(loanStore.processRatesData);
            expect(loan['rates']).to.equal(1);
            sinon.assert.calledOnce(loanStore.updateLoan);
            expect(loan['interest-rate']).to.equal(2);
        });
    });

    describe('process rate data', function () {

        it ('should process rates data and return a dictionary with processed rates and median rates', function() {
            var data = { "4.5": 3, "4.25": 2,"4.75": 1};

            var result = loanStore.processRatesData(data);
            expect(result.median).to.equal(4.5);
            expect(result.vals).to.deep.equal([ { val: 4.25, label: '4.25%' }, { val: 4.5, label: '4.5%' }, { val: 4.75, label: '4.75%' } ]);
        });

        it('should still work when data is null', function() {
          var result = loanStore.processRatesData(null);
          expect(result.median).to.equal(0);
          expect(result.vals).to.deep.equal([]);
        });

        // May need a case to show that if key in data but not in data.hasOwnProperty
    });

    describe('is disallowed ARM property', function () {
        describe('term values', function () {
            var i = 0,
                disallowedTerms = common.armDisallowedOptions['loan-term'],
                len = disallowedTerms.length;

            function testDisallowedTerms(val) {
                it('should return true when loan is ARM for disallowed term ' + val, function () {
                    var loan = {'rate-structure': 'arm', 'loan-term': val};
                    expect(loanStore.isDisallowedArmOption('loan-term', loan)).to.be.true;
                });
                it('should return false when loan is not ARM for disallowed term ' + val, function () {
                    var loan = {'rate-structure': 'not-arm', 'loan-term': val};
                    expect(loanStore.isDisallowedArmOption('term', loan)).to.be.false;
                });
            }

            for (i; i < len; i++) {
                testDisallowedTerms(disallowedTerms[i]);
            }

            it('should return false when loan is ARM & term is not disallowed', function() {
                var loan = {'rate-structure': 'arm', 'loan-term': 'not-disallowed'};
                expect(loanStore.isDisallowedArmOption('loan-term', loan)).to.be.false;
            });

            it('should return false when loan is not ARM & term is not disallowed', function() {
                var loan = {'rate-structure': 'not-arm', 'loan-term': 'not-disallowed'};
                expect(loanStore.isDisallowedArmOption('loan-term', loan)).to.be.false;
            });
        });

        describe('type values', function () {
            var i = 0,
                disallowedTypes = common.armDisallowedOptions['loan-type'],
                len = disallowedTypes.length;

            function testDisallowedTypes(val) {
                it('should return true when loan is ARM for disallowed type ' + val, function () {
                    var loan = {'rate-structure': 'arm', 'loan-type': val};
                    expect(loanStore.isDisallowedArmOption('loan-type', loan)).to.be.true;
                });
                it('should return false when loan is not ARM for disallowed type ' + val, function () {
                    var loan = {'rate-structure': 'not-arm', 'loan-type': val};
                    expect(loanStore.isDisallowedArmOption('loan-type', loan)).to.be.false;
                });
            }

            for (i; i < len; i++) {
                testDisallowedTypes(disallowedTypes[i]);
            }

            it('should return false when loan is ARM & type is not disallowed', function() {
                var loan = {'rate-structure': 'arm', 'loan-type': 'not-disallowed'};
                expect(loanStore.isDisallowedArmOption('loan-type', loan)).to.be.false;
            });

            it('should return false when loan is not ARM & type is not disallowed', function() {
                var loan = {'rate-structure': 'not-arm', 'loan-type': 'not-disallowed'};
                expect(loanStore.isDisallowedArmOption('loan-type', loan)).to.be.false;
            });
        });

    });

    describe('update calculated values', function() {
        beforeEach(function () {
            sandbox.stub(mortgageCalculations);
        });

        it('should update a single calculated value', function() {
            loanStore.updateCalculatedValues({}, 'loan-amount');
            sinon.assert.calledOnce(mortgageCalculations['loan-amount']);
        });

        it('should update an array of calculated values', function() {
            loanStore.updateCalculatedValues({}, ['loan-summary', 'loan-amount']);
            sinon.assert.calledOnce(mortgageCalculations['loan-amount']);
            sinon.assert.calledOnce(mortgageCalculations['loan-summary']);
        });
    });

    describe('validators', function() {
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
    });

    describe('validate loan', function() {
        it('should have an empty loan error property if all validators return no error', function() {
            var errors = {'downpayment': 'This will be removed.'};
            var loan = { 'errors': errors,
                         'downpayment': 7000,
                         'price': 200000,
                         'loan-type': 'va',
                         'rate-structure': 'fixed'
                        };
            loanStore.validateLoan(loan);

            expect(Object.keys(loan['errors']).length).to.equal(0);
        });

        it ('should have error for the property that does not validated', function() {
            var loan = { 'downpayment': 6999,
                         'price': 200000,
                         'loan-type': 'fha',
                         'rate-structure': 'fixed'};
            loanStore.validateLoan(loan);

            expect(Object.keys(loan['errors']).length).to.equal(1);
            expect(loan['errors']['downpayment']).to.equal('FHA loans typically require a down payment of at least 3.5%.');
        });
    });

    describe('is downpayment too high', function() {

    });

    describe('is downpayment too low', function() {

    });

    describe('jumbo logic', function() {
        // TODO:
        // test previous type, disallowed type
        describe('jumbo check', function() {
            describe('jumbo test success', function() {
                it('should update loan to jumbo if isJumbo is true', function() {
                    var loan = {
                        errors: {}
                    };
                    var jumboResults = {success: true, isJumbo: true, msg: 'msg', type: 'type'};
                    sandbox.stub(loanStore, 'runJumboTest', function () {return jumboResults});
                    sandbox.stub(loanStore, 'updateLoan', function () {});

                    loanStore.jumboCheck(loan);
                    sinon.assert.calledOnce(loanStore['runJumboTest']);
                    expect(loan['need-county']).to.be.true();
                    expect(loan['errors']['loan-type']).to.equal(jumboResults.msg);
                    sinon.assert.calledOnce(loanStore['updateLoan']);
                    sinon.assert.calledWith(loanStore['updateLoan'], loan, 'loan-type', jumboResults.type);
                });

                it('should update loan to jumbo if isJumbo is true and type equals loan.loan-type', function() {
                    var loan = {
                        errors: {},
                        'loan-type': 'type'
                    };
                    var jumboResults = {success: true, isJumbo: true, msg: 'msg', type: 'type'};
                    sandbox.stub(loanStore, 'runJumboTest', function () {return jumboResults});
                    sandbox.stub(loanStore, 'updateLoan', function () {});

                    loanStore.jumboCheck(loan);
                    sinon.assert.calledOnce(loanStore['runJumboTest']);
                    expect(loan['need-county']).to.be.true();
                    expect(loan['errors']['loan-type']).to.equal(jumboResults.msg);
                });


                it('should change a jumbo loan back to conventional if isJumbo is false', function() {
                    var loan = {errors: {}, 'loan-type': 'jumbo'};
                    var jumboResults = {success: true, isJumbo: false};
                    sandbox.stub(loanStore, 'runJumboTest', function () {return jumboResults});
                    sandbox.stub(loanStore, 'updateLoan', function () {});

                    loanStore.jumboCheck(loan);
                    sinon.assert.calledOnce(loanStore['runJumboTest']);
                    expect(loan['need-county']).to.be.false();
                    expect(loan['errors']['loan-type']).not.to.exist();
                    sinon.assert.calledOnce(loanStore['updateLoan']);
                    sinon.assert.calledWith(loanStore['updateLoan'], loan, 'loan-type', 'conf');
                });

                // TODO: test negative scenarios: loan type doesn't change, etc

                it('should change a currently jumbo but previously fha loan back to fha if isJumbo is false', function() {
                    var loan = {errors: {}, 'loan-type': 'fha-hb', 'previous-type': 'fha'};
                    var jumboResults = {success: true, isJumbo: false};
                    sandbox.stub(loanStore, 'runJumboTest', function () {return jumboResults});
                    sandbox.stub(loanStore, 'updateLoan', function () {});

                    loanStore.jumboCheck(loan);
                    sinon.assert.calledOnce(loanStore['runJumboTest']);
                    expect(loan['need-county']).to.be.false();
                    expect(loan['errors']['loan-type']).not.to.exist();
                    sinon.assert.calledOnce(loanStore['updateLoan']);
                    sinon.assert.calledWith(loanStore['updateLoan'], loan, 'loan-type', 'fha');
                });
            });

            describe('jumbo test failure', function() {
                // TODO: this needs more tests
                it('should handle needing county data to complete jumbo check', function() {
                    var loan = {errors: {}, 'loan-type': 'fha'};
                    var jumboResults = {success: false, needCounty: true};
                    sandbox.stub(loanStore, 'runJumboTest', function () {return jumboResults});
                    sandbox.stub(loanStore, 'fetchCounties', function () {});

                    loanStore.jumboCheck(loan);
                    sinon.assert.calledOnce(loanStore['runJumboTest']);
                    expect(loan['need-county']).to.be.true();
                    expect(loan['errors']['county']).to.equal(common.errorMessages['need-county']);
                    sinon.assert.calledOnce(loanStore['fetchCounties']);
                });
            });
        });

        describe('run jumbo test', function() {
          it('should return {} if jumbo() fails', function()  {
            var result = loanStore.runJumboTest({dummy:'loan'});
            expect(result).to.deep.equal({});
          });
        });

        describe('get jumbo params', function() {
          it('should return default params if there are no county params', function() {
              sandbox.stub(loanStore, 'getCountyParams', function () {});

              var loan = {'loan-amount': 200000, 'loan-type': 'conf'};
              var jumboParams = loanStore.getJumboParams(loan);
              expect(jumboParams).to.deep.equal({loanType: loan['loan-type'], loanAmount: loan['loan-amount']});

              sinon.assert.calledOnce(loanStore['getCountyParams']);
          });

          it('should include county params when they are available', function() {
              var county = {gseCountyLimit: 1, fhaCountyLimit: 1, vaCountyLimit: 1};
              var loan = {'loan-amount': 200000, 'loan-type': 'conf', 'other': 'something'};
              sandbox.stub(loanStore, 'getCountyParams', function () {return county});

              var jumboParams = loanStore.getJumboParams(loan);

              sinon.assert.calledOnce(loanStore['getCountyParams']);

              expect(jumboParams).to.deep.equal({
                  loanType: loan['loan-type'],
                  loanAmount: loan['loan-amount'],
                  gseCountyLimit: county.gseCountyLimit,
                  fhaCountyLimit: county.fhaCountyLimit,
                  vaCountyLimit: county.vaCountyLimit
              });
          });

          it('should assign previous-type to loanType when common.jumboTypes[loanType] exists', function() {
            var loan = {'loan-type': 'jumbo', 'previous-type': 'test', 'loan-amount': 20000};
            var results = loanStore.getJumboParams(loan);
            expect(results.loanType).to.equal(loan['previous-type']);
          });

          it('should assign "conf" to loanType when common.jumboTypes[loanType] exists and loan[previous-type] doesnt', function() {
            var loan = {'loan-type': 'jumbo', 'loan-amount': 20000};
            var results = loanStore.getJumboParams(loan);
            expect(results.loanType).to.equal("conf");
          });
        });

        describe('get county params', function() {
            it('should return null if county or county-dict does not exist on loan', function() {
                expect(loanStore.getCountyParams({})).not.to.exist();
                expect(loanStore.getCountyParams({'county-dict': {1: {'complete_fips': 1}, 2: {'complete_fips': 2}}})).not.to.exist();
                expect(loanStore.getCountyParams({county: 1})).not.to.exist();
            });

            it('should return correctly configured county params if county & county-dict exist on loan', function() {
                var loan = {county: 1, 'county-dict': {1: {'gse_limit': 1, 'fha_limit': 1, 'va_limit': 1}}};
                var countyParams = {gseCountyLimit: 1, fhaCountyLimit: 1, vaCountyLimit: 1};

                expect(loanStore.getCountyParams(loan)).to.deep.equal(countyParams);
            });
        });
    });

    describe('fetch counties', function() {

        var loan, dfd, promise, stopExistingRequest, fetchCountiesStub, updateLoanCounties, emitChangeStub;

        beforeEach(function () {
            loan = {};
            dfd = $.Deferred();
            promise = dfd.promise();
            stopExistingRequest = sandbox.stub(loanStore, 'cancelExistingRequest');
            fetchCountiesStub = sandbox.stub(api, 'fetchCountyData', function () {return promise;});
            updateLoanCounties = sandbox.stub(loanStore, 'updateLoanCounties');
            emitChangeStub = sandbox.stub(loanStore, 'emitChange');
        });

        it ('should update loan counties on success', function() {
            loanStore.fetchCounties(loan);

            sinon.assert.calledOnce(loanStore.cancelExistingRequest);
            sinon.assert.calledOnce(api.fetchCountyData);
            sinon.assert.notCalled(loanStore.updateLoanCounties);
            expect(loan['county-request']).to.equal(promise);

            dfd.resolve({});

            sinon.assert.calledOnce(loanStore.updateLoanCounties);
            sinon.assert.calledOnce(loanStore.emitChange);
            expect(loan['county-request']).to.equal(null);
        });

        it ('should update loan counties on success, result is null', function() {
            loanStore.fetchCounties(loan);

            sinon.assert.calledOnce(loanStore.cancelExistingRequest);
            sinon.assert.calledOnce(api.fetchCountyData);
            sinon.assert.notCalled(loanStore.updateLoanCounties);
            expect(loan['county-request']).to.equal(promise);

            dfd.resolve(null);

            sinon.assert.calledOnce(loanStore.updateLoanCounties);
            sinon.assert.calledOnce(loanStore.emitChange);
            expect(loan['county-request']).to.equal(null);
        });


        it ('should not update loan counties on failure', function() {
            loanStore.fetchCounties(loan);

            sinon.assert.calledOnce(loanStore.cancelExistingRequest);
            sinon.assert.calledOnce(api.fetchCountyData);
            sinon.assert.notCalled(loanStore.updateLoanCounties);
            expect(loan['county-request']).to.equal(promise);

            dfd.reject({});

            sinon.assert.notCalled(loanStore.updateLoanCounties);
            sinon.assert.calledOnce(loanStore.emitChange);
            expect(loan['county-request']).to.equal(null);
        });
    });

    describe('update loan counties', function() {
        it('should update counties and county-dict on loan', function() {
            var loan = {};
            var county1 = {'complete_fips': 1, 'other': 1};
            var county2 = {'complete_fips': 2, 'other': 2};
            var data = [county1, county2];
            var dict = {1: county1, 2: county2};

            sandbox.spy(loanStore, 'updateLoan');

            loanStore.updateLoanCounties(loan, data);

            expect(loan.counties).to.equal(data);
            expect(loan['county-dict']).to.deep.equal(dict);

        });
    });

    describe('is prop linked', function() {
      it('should correctly calculate whether loan prop is linked in current scenario', function() {
        var getScenarioStub = sandbox.stub(scenarioStore, 'getScenario');
        getScenarioStub.returns({});
        var result = loanStore.isPropLinked('test');
        expect(result).to.equal(true);
      });

      it('should correctly calculate whether loan prop is linked in current scenario, v2', function() {
        var getScenarioStub = sandbox.stub(scenarioStore, 'getScenario');
        getScenarioStub.returns({independentInputs: ['test']});
        var result = loanStore.isPropLinked('test');
        expect(result).to.equal(false);
      });
    });

    describe('get all', function() {
      it('should return _loans', function() {
        var loans = [{name:'loan1', value:'loan1'}, {id:'loan2', value:'Loan #2'}];
        loanStore._loans = loans;
        var returned_loans = loanStore.getAll();
        expect(returned_loans).to.deep.equal(loans);
      });
    });

    describe('add change listener', function() {
      it('should add a change listener', function() {
        getAll = sandbox.stub(loanStore, 'getAll');
        loanStore.addChangeListener(loanStore.getAll);
        loanStore.emitChange();
        sinon.assert.calledOnce(loanStore.getAll);
      });
    });

    describe('remove change listener', function() {
      it('should remove a change listener', function() {
        getAll = sandbox.stub(loanStore, 'getAll');
        loanStore.addChangeListener(loanStore.getAll);
        loanStore.removeChangeListener(loanStore.getAll);
        loanStore.emitChange();
        sinon.assert.notCalled(loanStore.getAll);
      });
    });

    describe('dispatch token', function() {
      it('should do something magical', function() {
        //appDispatcher.handleServerAction({actionType: null, prop: 'test'});
        // TODO: not sure how to test this one
      });
    });

    describe('get prop label from common module', function() {
      it('should return a correct prop name', function() {
        var prop = 'arm-type';
        var result = common.getPropLabel(prop);
        expect(result).to.equal('ARM type');
      });

      it('should generate the correct prop name', function() {
        var prop = 'test-prop-name';
        var result = common.getPropLabel(prop);
        expect(result).to.equal('Test prop name');
      });
    });

});

