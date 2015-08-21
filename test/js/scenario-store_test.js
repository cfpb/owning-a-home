var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var scenarioStore = require('../../src/static/js/modules/loan-comparison/stores/scenario-store.js');
var sandbox;

describe('Scenario store tests', function() {
  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('get scenario', function() {
    it('should return the correct scenario', function() {
      var result = scenarioStore.getScenario();
      // very weak test
      expect(result['val']).to.equal("downpayment");
    });
  });

  describe('add change listener', function() {
    it('should add a change listener', function() {
      var stub = sinon.spy(scenarioStore, 'getScenario');
      scenarioStore.addChangeListener(scenarioStore.getScenario);
      scenarioStore.emitChange();
      sinon.assert.calledOnce(scenarioStore.getScenario);
      stub.restore();
    });
  });

  describe('remove change listener', function() {
    it('should remove change listeners', function() {
      var stub = sinon.spy(scenarioStore, 'getScenario');
      scenarioStore.addChangeListener(scenarioStore.getScenario);
      scenarioStore.removeChangeListener(scenarioStore.getScenario);
      scenarioStore.emitChange();
      sinon.assert.notCalled(scenarioStore.getScenario);
    });
  });
});
