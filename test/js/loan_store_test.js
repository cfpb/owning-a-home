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
        var getScenarioStub, updateDPConstStub, resetLoanStub, origLoans;
        
        beforeEach(function () {
            getScenarioStub = sandbox.stub(scenarioStore, 'getScenario');
            updateDPConstStub = sandbox.stub(loanStore, 'updateDownpaymentConstant');
            resetLoanStub = sandbox.stub(loanStore, 'resetLoan');
            origLoans = loanStore._loans;
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
        });

        it('should reset loan to its default value when there is one loan in the store', function() {
            loanStore._loans = [{}]; // So this will not use common.loanCount = 2

            getScenarioStub.returns({'downpayment': 'test'});
            loanStore.resetAllLoans();

            sinon.assert.calledOnce(scenarioStore.getScenario);
            sinon.assert.calledOnce(loanStore.updateDownpaymentConstant);
            sinon.assert.calledOnce(loanStore.resetLoan);
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
    
    });
    
    describe('set loan data', function() {
        // This functionality is only needed if pre-pop scenarios are being used
        it('should set data on loan, including existing data with id = 0', function() {
            var scenario = {'loanProps': [{'scenario0': 0}, {'scenario0': 1}, {'scenario0': 2}, {'scenario0': 3}]};
            var origLoans = loanStore._loans;

            loanStore._loans = [
                {'id': 0, 'rate-request': true, 'mtg-ins-request': false, 'credit-score': 'score'},
                {'id': 1, 'rate-request': false, 'mtg-ins-request': true}];
            loanStore.setLoanData(0, scenario);

            expect(loanStore._loans).to.deep.equal([
                    {'id': 0, 'rate-request': true, 
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
                    'scenario0': 0}, 
                    {'id': 1, 'rate-request': false, 'mtg-ins-request': true}]);
            
            loanStore._loans = origLoans;
        });
        
        it('should set data on loan, including existing data from loan 0, for loan with id != 0', function() {

            var scenario = {'loanProps': [{'scenario0': 0}, {'scenario0': 1}, {'scenario0': 2}, {'scenario0': 3}]};
            var origLoans = loanStore._loans;

            loanStore._loans = [
                {'id': 0, 'rate-request': true, 'mtg-ins-request': false, 'credit-score': 'score'},
                {'id': 1, 'rate-request': false, 'mtg-ins-request': true}];
                
            loanStore.setLoanData(1, scenario);

            expect(loanStore._loans).to.deep.equal([
                    {'id': 0, 'rate-request': true, 'mtg-ins-request': false, 'credit-score': 'score'},
                    {'id': 1,
                    'credit-score': 'score',
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

            loanStore._loans = origLoans;
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
    
    });
    
    describe('standardize values', function() {
        describe('numeric vals', function() {
            var i = 0, 
                numericProps = common.numericLoanProps, 
                len = numericProps.length;
            
            function testNumericProps(prop, val, result, resultDesc) {
                it('should return ' + resultDesc + ' value for param ' + prop, function () {
                    expect(loanStore.standardizeValue(prop, val)).to.equal(result);
                });
            }
        
            for (i; i < len; i++) {
                var prop = numericProps[i];
                testNumericProps(prop, '1', 1, 'numeric rather than string');
                testNumericProps(prop, '', 0, 'zero rather than empty');
                testNumericProps(prop, null, 0, 'zero rather than null');
                testNumericProps(prop, undefined, 0, 'zero rather than undefined');
            }
        });
        
        describe('non-numeric vals', function() {
            it('should return the passed in value for non-numeric loan props if the value exists', function() {
                var val = 'CA';
                expect(loanStore.standardizeValue('state', val)).to.equal(val);
            });
        
            it('should return null for non-numeric loan props if an empty value is passed in', function() {
                var val = '';
                expect(loanStore.standardizeValue('state', val)).to.equal(null);
            });
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
            var loanSummaryValues = ['loan-type', 'loan-term', 'rate-structure'];
            
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
    
    describe('fetch loan data', function() {
    
    });
    
    describe('fetch insurance', function() {
    
    });
    
    describe('update loan insurance', function() {
        it('should update loan property mtg-ins-data given data', function() {
            var loan = {};
            loanStore.updateLoanInsurance(loan, "data");
            expect(loan['mtg-ins-data']).to.equal("data");
        });
    });
    
    describe('update loan rates', function() {
    
    });
    
    describe('process rate data', function () {
        
        it ('should process rates data and return a dictionary with processed rates and median rates', function() {
            var data = { "4.5": 3, "4.25": 2,"4.75": 1};

            var result = loanStore.processRatesData(data);
            expect(result.median).to.equal(4.5);
            expect(result.vals).to.deep.equal([ { val: 4.25, label: '4.25%' }, { val: 4.5, label: '4.5%' }, { val: 4.75, label: '4.75%' } ]);
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
        describe('jumbo check', function() {

        });
        
        describe('run jumbo test', function() {

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
    
    });
    
    describe('update loan counties', function() {
    
    });

});

