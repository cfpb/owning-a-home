describe('Input USD react component tests', function () {
  
  global.expect = require('chai').expect;
  require('mocha-jsdom')();
  var sinon = require('sinon');
  var React = require('react');
  var ReactDOM = require('react-dom');
  var TestUtils = require('react-addons-test-utils');
  var InputUSD = require('../../src/static/js/modules/react-components/input-usd.jsx');
  var renderedComponent, input, sandbox;

  function setupComponent (props) {
    renderedComponent = TestUtils.renderIntoDocument(
      <InputUSD {...props}/>
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
    
    describe('tests component with default decimalPlaces prop of zero', function() {
      beforeEach(function () {
        setupComponent();
      });
      
      it('should display a nonexistent value as zero', function() {
        var formattedVal = renderedComponent.format();
        expect(formattedVal).to.equal('$0');
      });
    
      it('should correctly format a value of zero', function() {
        var formattedVal = renderedComponent.format(0);
        expect(formattedVal).to.equal('$0');
      });
    
      it('should correctly format a value without decimal places', function() {
        var formattedVal = renderedComponent.format(12);
        expect(formattedVal).to.equal('$12');
      });
      
      it('should truncate a value for display based on decimalPlaces prop', function() {
        var formattedVal = renderedComponent.format(3.14159);
        expect(formattedVal).to.equal('$3.14');
      });
      
      it('should display a non-existent value as zero, without decimal places', function() {
        var formattedVal = renderedComponent.format();
        expect(formattedVal).to.equal('$0');
      });
      
      it('should display zero without decimal places', function() {
        var formattedVal = renderedComponent.format(0);
        expect(formattedVal).to.equal('$0');
      });      
    });
    
    describe('tests component with passed in decimalPlaces prop', function() {
      
      it('should correctly format a value with decimal places, rounding down', function() {
        setupComponent({decimalPlaces: 0});
        
        var formattedVal = renderedComponent.format(12.24);
        expect(formattedVal).to.equal('$12');
      });
      
      it('should correctly format a value with decimal places, rounding up', function() {
        setupComponent({decimalPlaces: 0});
        
        var formattedVal = renderedComponent.format(12.74);
        expect(formattedVal).to.equal('$13');
      });
    
    });
    
  });
    
  // TODO
  describe('render tests', function() {
    
  });  
  
  describe('additional props tests', function() {
    
    it('should pass to input element any additional props that are passed in', function() {
      setupComponent({value: '123'})
      expect(ReactDOM.findDOMNode(input).className).to.equal('');
      
      setupComponent({value: '123', className: 'test-class'})
      expect(ReactDOM.findDOMNode(input).className).to.equal('test-class');
    });
    
  });
})