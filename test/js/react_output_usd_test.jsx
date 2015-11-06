describe('OutputUSD component tests', function () {
  
  global.expect = require('chai').expect;
  require('mocha-jsdom')();
  
  var React = require('react');
  var ReactAddons = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var OutputUSD = require('../../src/static/js/modules/react-components/output-usd.jsx');
  var componentEl;

  function setupComponent (props) {
    var renderedComponent = TestUtils.renderIntoDocument(
      <OutputUSD {...props}/>
    );
    componentEl = TestUtils.findRenderedDOMComponentWithTag(
      renderedComponent,
      'span'
    );
  }

  describe('component defaults test', function() {
    
    it('should display $0 when no value is passed in', function() {
      setupComponent();
      expect(componentEl.getDOMNode().textContent).to.equal('$0');
    });

    it('should format and display value passed in', function() {
      setupComponent({value: '2'})
      expect(componentEl.getDOMNode().textContent).to.equal('$2');
    });

    it('should default to showing zero decimal places, rounding down to the next integer when the decimal value is less than .5', function() {
      setupComponent({value: '2.23'})
      expect(componentEl.getDOMNode().textContent).to.equal('$2');
    });

    it('should default to showing zero decimal places, rounding up to the next integer when the decimal value is greater than .5', function() {
      setupComponent({value: '2.73'})
      expect(componentEl.getDOMNode().textContent).to.equal('$3');
    });

    it('should convert non-numeric values to 0', function() {
      setupComponent({value: 'asdf'})
      expect(componentEl.getDOMNode().textContent).to.equal('$0');
    });

  });

  describe('decimalPlaces prop test', function() {

    it('should show decimal places accordingly if decimalPlaces optional prop is passed in', function() {
      setupComponent({value: '2.23', decimalPlaces: 2})
      expect(componentEl.getDOMNode().textContent).to.equal('$2.23');
    });

    it('should show no decimal places when value is 0', function() {
      setupComponent({value: '0', decimalPlaces: 2})
      expect(componentEl.getDOMNode().textContent).to.equal('$0');
    });

    it('should show no decimal places when value is converted to 0', function() {
      setupComponent({value: 'asdf', decimalPlaces: 2})
      expect(componentEl.getDOMNode().textContent).to.equal('$0');
    });

  });

  describe('additional props test', function() {

    it('should pass through additional props that are passed in', function() {
      setupComponent({value: '2.23', className: 'test-class'})
      expect(componentEl.getDOMNode().className).to.equal('test-class');
    });

  });
  
})