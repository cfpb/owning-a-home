var chai = require('chai');
var expect = chai.expect;

describe('Loan store validation', function() {
  var $, loanStore;

  before(function () {
    $ = require('jquery');
    loanStore =  require('../../src/static/js/modules/loan-comparison/stores/loan-store.js');
  });
  
  describe('loan term validation', function() {   
    
    it('Positive test - should return an error for a 15-year ARM loan', function() {
      expect(loanStore.validators['loan-term']({'rate-structure': 'arm', 'loan-term': 15})).to.exist();
    });
    
    it('Positive test - should change term of a 15-year ARM loan to 30', function() {
      var loan = {'rate-structure': 'arm', 'loan-term': 15};
      loanStore.validators['loan-term'](loan);
      expect(loan['loan-term']).to.equal(30);
    });
    
    it('Negative test - should not return an error for a 30-year ARM loan', function() {
      expect(loanStore.validators['loan-term']({'rate-structure': 'arm', 'loan-term': 30})).not.to.exist();
    });
    
  });
  
  describe('loan type validation', function() {
    
    it('Positive test - should return an error for a VA ARM loan', function() {
      expect(loanStore.validators['loan-type']({'rate-structure': 'arm', 'loan-type': 'va'})).to.exist()
    });
    
    it('Positive test - should change FHA ARM loan to conventional', function() {
      var loan = {'rate-structure': 'arm', 'loan-type': 'fha'};
      loanStore.validators['loan-type'](loan);
      expect(loan['loan-type']).to.equal('conf')
    });
    
    it('Negative test - should not return an error for a conventional ARM loan', function() {
      expect(loanStore.validators['loan-type']({'rate-structure': 'arm', 'loan-type': 'conf'})).not.to.exist();
    });
    
  });


});


