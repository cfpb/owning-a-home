var dispatcher = require('../../src/static/js/modules/loan-comparison/dispatcher/app-dispatcher.js');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sandbox, dispatch;

describe('App dispatcher tests', function() {

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    dispatch = sinon.stub(dispatcher, 'dispatch');
  });

  afterEach(function() {
    sandbox.restore();
    dispatcher.dispatch.restore();
  });

  describe('handle server action', function() {
    it('should correctly handle server action', function() {
      var action = {'dummy': 'action'};
      dispatcher.handleServerAction(action);
      sinon.assert.calledOnce(dispatcher.dispatch);
      sinon.assert.calledWith(dispatcher.dispatch, {source: 'SERVER_ACTION', action: action});
    });
  });

  describe('handle view action', function() {
    it('should correctly handle view action', function() {
      var action = {'dummy': 'action'};
      dispatcher.handleViewAction(action);
      sinon.assert.calledOnce(dispatcher.dispatch);
      sinon.assert.calledWith(dispatcher.dispatch, {source: 'VIEW_ACTION', action: action});
    });
  });

});
