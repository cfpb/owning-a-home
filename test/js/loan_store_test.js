var chai = require('chai');
var expect = chai.expect;
var loanStore;
var common;
var $;
var sinon = require('sinon');
var mortgageCalculations = require('../../src/static/js/modules/loan-comparison/mortgage-calculations.js');
var common = require('../../src/static/js/modules/loan-comparison/common.js');
var sandbox;


describe('Loan store tests', function() {
    before(function () {
        $ = require('jquery');
        loanStore = require('../../src/static/js/modules/loan-comparison/stores/loan-store.js');        
    });
    
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();

    });
    
    describe('reset all loans', function() {

    });

    

    describe('update all loans', function() {

    });

    describe('update loan', function() {

    });

    describe('update downpayment constant', function() {
        
    });
    
    // find county
    
    // fetch counties
    
    // is disallowed
    
    // (set loan, reset loan, update loan)
    
    describe('reset loan', function() {
        
    });
    
    describe('standardize values', function() {
        describe('numeric vals', function() {
            function testNumericProps(prop, val, result, str) {
                it('should return ' + str + ' value for param ' + prop, function() {
                    var processedVal = loanStore.standardizeValue(prop, val);
                    expect(processedVal).to.equal(result);
                });
            }
        
            for (var i = 0; i<common.numericLoanProps.length; i++) {
              testNumericProps(common.numericLoanProps[i], '1', 1, 'numeric rather than string');
              testNumericProps(common.numericLoanProps[i], '', 0, 'zero rather than empty');
              testNumericProps(common.numericLoanProps[i], null, 0, 'zero rather than null');
              testNumericProps(common.numericLoanProps[i], undefined, 0, 'zero rather than undefined');
            }
        });
        describe('non-numeric vals', function() {
            it('should return the passed in value for non-numeric loan props if the value exists', function() {
                var val = 'CA';
                expect(loanStore.standardizeValue('state', val)).to.equal(val);
            });
        
            it('should return null for non-numeric loan props if the value does not exist', function() {
                var val = '';
                expect(loanStore.standardizeValue('state', val)).to.equal(null);
            });
        });
    });
    
    describe('reset county', function() {
        // TODO: test county-dict (if keeping)
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
    
    describe('update counties', function() {
        // TODO: test county-dict (if keeping)
        it('should update county data on loan', function() {
            sandbox.stub(loanStore, 'updateLoan', function () {});            
            
            var loan = {'county-request': {}};
            var data = [{'complete_fips': 1}, {'complete_fips': 2}];
            loanStore.updateLoanCounties(loan, data);
            sinon.assert.calledOnce(loanStore['updateLoan']);
            sinon.assert.calledWith(loanStore['updateLoan'], loan, 'county', data[0]['complete_fips']);
            expect(loan['county-request']).not.to.exist();
            expect(loan.counties).to.equal(data);
        });
        
        it('should not set value for counties on loan if county data is not an array', function() {
            var loan = {'county-request': 'request'};
            var data = 'data';
            loanStore.updateLoanCounties(loan);
            expect(loan['county-request']).not.to.exist();
            expect(loan.counties).not.to.exist();
        });
        
    });
    
    describe('jumbo logic', function() {
        
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
                var loan = {'loan-amount': 200000, 'loan-type': 'conf'};
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
        
        // jumbo check
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
                it('should handle needing county data to complete jumbo check', function() {
                    var loan = {errors: {}, 'loan-type': 'fha'};
                    var jumboResults = {success: false, needCounty: true};
                    sandbox.stub(loanStore, 'runJumboTest', function () {return jumboResults});
                    sandbox.stub(loanStore, 'fetchCounties', function () {});
                    
                    loanStore.jumboCheck(loan);        
                    sinon.assert.calledOnce(loanStore['runJumboTest']);
                    expect(loan['need-county']).to.be.true();
                    expect(loan['errors']['county']).to.equal(common.jumboMessages[loan['loan-type']]);
                    sinon.assert.calledOnce(loanStore['fetchCounties']);
                });
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
                it('should call downpayment dependencies update function for param ' + val, function() {
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
        
        beforeEach(function () {
            sandbox.stub(loanStore, 'updateCalculatedValues', function () {});            
        });
        
        describe('summary props', function() {
            var loanSummaryValues = ['loan-type', 'loan-term', 'rate-structure'];
        
            function testLoanSummaryCalculations(val) {
                it('should update loan summary calculations when called with param ' + val, function() {
                    var loan = {};
                    loanStore.updateLoanCalculations(loan, val);

                    // called with
                    sinon.assert.calledOnce(loanStore['updateCalculatedValues']);
                    sinon.assert.calledWith(loanStore['updateCalculatedValues'], loan, 'loan-summary');
                });
            }
        
            for (var i = 0; i<loanSummaryValues.length; i++) {
              testLoanSummaryCalculations(loanSummaryValues[i]);
            }
        });
        
        it('should update interest rate calculations when called with param interest rate', function() {
            var loan = {};
            loanStore.updateLoanCalculations(loan, 'interest-rate');
            
            sinon.assert.calledOnce(loanStore['updateCalculatedValues']);
            sinon.assert.calledWith(loanStore['updateCalculatedValues'], loan, common.calculatedPropertiesBasedOnIR);
        });
        
        it('should not update calculated values when called without designated params', function() {
            var loan = {};
            loanStore.updateLoanCalculations(loan, 'price');
            
            sinon.assert.notCalled(loanStore['updateCalculatedValues']);
        });
        
    });

    describe('update downpayment dependencies', function() {
        
        it('should update downpayment-percent given updated downpayment property', function() {
            
            // given
            var prop = 'downpayment';
            var loan = {'price': 200000, 'downpayment-percent': 30, 'downpayment': 40000};
            loanStore.downpaymentConstant = '';
            // when
            loanStore.updateDownpaymentDependencies(loan, prop);

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
            loanStore.updateDownpaymentDependencies(loan, prop);

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
            loanStore.updateDownpaymentDependencies(loan, prop);

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
            loanStore.updateDownpaymentDependencies(loan, prop);

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
    
    

});

