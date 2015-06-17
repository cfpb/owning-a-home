var chai = require('chai');
var expect = chai.expect;
var loanStore;
var $;



describe('Loan store validation', function() {
    before(function () {
        $ = require('jquery');
        loanStore = require('../../src/static/js/modules/loan-comparison/stores/loan-store.js');
    });
    
    describe('loan type validation', function() {

        it('should return an error for a VA ARM loan', function() {
            expect(loanStore.validators['loan-type']({'rate-structure': 'arm', 'loan-type': 'va'})).to.exist()
        });

        it('should change FHA ARM loan to conventional', function() {
            var loan = {'rate-structure': 'arm', 'loan-type': 'fha'};
            loanStore.validators['loan-type'](loan);
            expect(loan['loan-type']).to.equal('conf')
        });

        it('should not return an error for a conventional ARM loan', function() {
            expect(loanStore.validators['loan-type']({'rate-structure': 'arm', 'loan-type': 'conf'})).not.to.exist();
        });

    });


});

