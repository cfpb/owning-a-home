describe('Input Percent react component tests', function () {
  
  global.expect = require('chai').expect;
  require('mocha-jsdom')();
  var sinon = require('sinon');
  var React = require('react');
  var ReactAddons = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var InputPercent = require('../../src/static/js/modules/react-components/input-percent.jsx');
  var renderedComponent, input;

  function setupComponent (props) {
    renderedComponent = TestUtils.renderIntoDocument(
      <InputPercent {...props}/>
    );
    input = TestUtils.findRenderedDOMComponentWithTag(
      renderedComponent,
      'input'
    );
  }
  
  beforeEach(function () {
      sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
      sandbox.restore();
  });

  describe('component format method tests', function() {
    
    beforeEach(function () {
      setupComponent();
    });
    
    it('should correctly format a nonexistent value', function() {
      var formattedVal = renderedComponent.format('');
      expect(formattedVal).to.equal('0%');
    });
    
    it('should correctly format a value of zero', function() {
      var formattedVal = renderedComponent.format(0);
      expect(formattedVal).to.equal('0%');
    });
    
    it('should correctly format a value', function() {
      var formattedVal = renderedComponent.format(12);
      expect(formattedVal).to.equal('12%');
    });
  });
    
  // TODO
  describe('rendering tests', function() {
    
  });  
  
  describe('additional props tests', function() {
    
    it('should pass to input element any additional props that are passed in', function() {
      setupComponent({value: '123'})
      expect(input.getDOMNode().className).to.equal('');
      
      setupComponent({value: '123', className: 'test-class'})
      expect(input.getDOMNode().className).to.equal('test-class');
    });
    
  });
})