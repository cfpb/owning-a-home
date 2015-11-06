describe('Formatted Numeric Input react component tests', function () {
  
  global.expect = require('chai').expect;
  require('mocha-jsdom')();
  var sinon = require('sinon');
  var React = require('react');
  var ReactAddons = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var FormattedNumericInput = require('../../src/static/js/modules/react-components/formatted-numeric-input.jsx');
  var renderedComponent, input;

  function setupComponent (props) {
    renderedComponent = TestUtils.renderIntoDocument(
      <FormattedNumericInput {...props}/>
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

  describe('displaying input value tests', function() {
    var stripHandler, formatHandler, formatter;
    
    beforeEach(function () {
      //http://stackoverflow.com/questions/24280428/stubbing-a-react-component-method-with-sinon
      stripHandler = sandbox.spy(FormattedNumericInput.prototype.__reactAutoBindMap, 'strip');   
      formatHandler = sandbox.spy(FormattedNumericInput.prototype.__reactAutoBindMap, 'format');  
      formatter = sandbox.spy(function (val) {return '^' + val + '^'});
    });
    
    describe('initial render tests', function() {

      it('should call strip and format functions, and display passed-in numeric value unchanged when no formatter is passed in', function () {
        setupComponent({value: 123});
        sinon.assert.calledOnce(stripHandler);
        sinon.assert.calledOnce(formatHandler);
        expect(input.getDOMNode().value).to.equal('123');
      });
    
      it('should strip non-numeric characters from value passed in before displaying it', function () {
        setupComponent({value: 'abc123!@#'});
        sinon.assert.calledOnce(stripHandler);
        sinon.assert.calledOnce(formatHandler);
        expect(input.getDOMNode().value).to.equal('123');
      });
      
      it('should format the value passed in when a formatter is included in props', function () {
        setupComponent({value: 123, formatter: formatter});
        sinon.assert.calledOnce(stripHandler);
        sinon.assert.calledOnce(formatHandler);
        sinon.assert.calledOnce(formatter);
        sinon.assert.calledWith(formatter, '123');
        expect(input.getDOMNode().value).to.equal('^123^');
      });
      
      it('should strip non-numeric characters & format the value passed in when a formatter is included in props', function () {
        setupComponent({value: 'abc123!@#', formatter: formatter});
        sinon.assert.calledOnce(stripHandler);
        sinon.assert.calledOnce(formatHandler);
        sinon.assert.calledOnce(formatter);
        sinon.assert.calledWith(formatter, '123');
        expect(input.getDOMNode().value).to.equal('^123^');
      });
      
    });
    
    describe('focus and blur event tests', function() {
      
      it('should remove formatting when the input is focused, and add formatting again when input is blurred', function() {
        setupComponent({formatter: formatter, value: 12});
        
        sinon.assert.calledOnce(formatter);
        expect(input.getDOMNode().value).to.equal('^12^');
        
        TestUtils.Simulate.focus(input);
        expect(input.getDOMNode().value).to.equal('12');
      
        TestUtils.Simulate.blur(input);
        sinon.assert.calledTwice(formatter);
        expect(input.getDOMNode().value).to.equal('^12^');
      });
    
    });
    
    describe('receiving updated props tests', function() {
      it('should not update the value of the input when new props are received if the input is focused', function() {    
        setupComponent({formatter: formatter, value: 12});
        sinon.assert.calledOnce(stripHandler);
        sinon.assert.calledOnce(formatHandler);
        sinon.assert.calledOnce(formatter);
        expect(input.getDOMNode().value).to.equal('^12^');
        
        TestUtils.Simulate.focus(input);
        sinon.assert.calledTwice(stripHandler);
        sinon.assert.calledOnce(formatHandler);
        sinon.assert.calledOnce(formatter);
        expect(input.getDOMNode().value).to.equal('12');
        
        renderedComponent.componentWillReceiveProps({value: '@abc123'})
        sinon.assert.calledTwice(stripHandler);
        sinon.assert.calledOnce(formatHandler);
        sinon.assert.calledOnce(formatter);
        expect(input.getDOMNode().value).to.equal('12');
      });
      
      it('should update the input value when new props are passed in if the input is not focused, calling strip and format functions before displaying value', function() {        
        setupComponent({formatter: formatter, value: 12});
        sinon.assert.calledOnce(stripHandler);
        sinon.assert.calledOnce(formatHandler);
        sinon.assert.calledOnce(formatter);
        expect(input.getDOMNode().value).to.equal('^12^');
        
        renderedComponent.componentWillReceiveProps({value: '@abc123'})
        sinon.assert.calledTwice(stripHandler);
        sinon.assert.calledTwice(formatHandler);
        sinon.assert.calledTwice(formatter);
        expect(input.getDOMNode().value).to.equal('^123^');
      });
    
    });
    
  });
  
  // TODO: more variations on interaction tests
  
  describe('interaction tests', function() {
    
    it('should allow keypress event when numeric keys are pressed', function() {
      var preventDefault = sandbox.spy();
      var keypressHandler = sandbox.spy(FormattedNumericInput.prototype.__reactAutoBindMap, 'keypress');      
      
      setupComponent({value: '123'});
      
      TestUtils.Simulate.keyDown(input, {name: '1', keyCode: 49, which: 49, preventDefault: preventDefault});
      sinon.assert.calledOnce(keypressHandler);      
      sinon.assert.notCalled(preventDefault);
    });
    
    it('should prevent key press event when non-numeric keys are pressed', function() {
      var preventDefault = sandbox.spy();
      var keypressHandler = sandbox.spy(FormattedNumericInput.prototype.__reactAutoBindMap, 'keypress');

      setupComponent({value: '123'});
      TestUtils.Simulate.keyDown(input, {name: 'a', keyCode: 65, which: 65, preventDefault: preventDefault});
      
      sinon.assert.calledOnce(keypressHandler);
      sinon.assert.calledOnce(preventDefault);
    });
    
    it('should update state with new value on change, without calling format or strip methods', function() {
      var stripHandler = sandbox.spy(FormattedNumericInput.prototype.__reactAutoBindMap, 'strip');   
      var formatHandler = sandbox.spy(FormattedNumericInput.prototype.__reactAutoBindMap, 'format');  
      var formatter = sandbox.spy(function (val) {return '^' + val + '^'});

      setupComponent({value: '123', formatter: formatter});
      sinon.assert.calledOnce(stripHandler);
      sinon.assert.calledOnce(formatHandler);
      sinon.assert.calledOnce(formatter);
      expect(input.getDOMNode().value).to.equal('^123^');
      
      TestUtils.Simulate.change(input, {target: {value: '321'}});
      sinon.assert.calledOnce(stripHandler);
      sinon.assert.calledOnce(formatHandler);
      sinon.assert.calledOnce(formatter);
      expect(input.getDOMNode().value).to.equal('321');
      
    });
      
    it('should call passed-in event callbacks for events that are handled by component', function() {
      var componentChangeHandler = sandbox.spy(FormattedNumericInput.prototype.__reactAutoBindMap, 'change');    
      var customChangeHandler = sandbox.spy();
      
      setupComponent({value: '123', onChange:customChangeHandler});
      
      TestUtils.Simulate.change(input, {});
      sinon.assert.calledOnce(componentChangeHandler);      
      sinon.assert.calledOnce(customChangeHandler);      
    });
    
  });
  
  describe('additional props tests', function() {
    
    it('should pass any extra props on to input element', function() {
      setupComponent({value: '123'})
      expect(input.getDOMNode().className).to.equal('');
      
      setupComponent({value: '123', className: 'test-class'})
      expect(input.getDOMNode().className).to.equal('test-class');
    });
    
    it('should pass through any event callbacks for events that are not handled by component', function() {
      var customKeyUpHandler = sandbox.spy();
      
      setupComponent({value: '123', onKeyUp:customKeyUpHandler});
      
      TestUtils.Simulate.keyUp(input, {});
      sinon.assert.calledOnce(customKeyUpHandler);      
    });
  });
})