describe('Input react component tests', function () {
  
  global.expect = require('chai').expect;
  require('mocha-jsdom')();
  var sinon = require('sinon');
  var React = require('react');
  var ReactDOM = require('react-dom');
  
  var TestUtils = require('react-addons-test-utils');
  var Input = require('../../src/static/js/modules/react-components/input.jsx');
  var renderedComponent, input, sandbox;

  function setupComponent (props) {
    renderedComponent = TestUtils.renderIntoDocument(
      <Input {...props}/>
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
  
  describe('setup tests', function() {
    it('should default to a text input', function() {
      setupComponent();
      expect(ReactDOM.findDOMNode(input).getAttribute('type')).to.equal('text');
    });
    
    it('should create a number input if numeric prop is true', function() {
      setupComponent({numeric: true});
      expect(ReactDOM.findDOMNode(input).getAttribute('type')).to.equal('number');
    });
  });
  
  
  describe('value and optional formatter tests', function() {
    var formatHandler, formatter, blurHandler, focusHandler;
    beforeEach(function () {
      //http://stackoverflow.com/questions/24280428/stubbing-a-react-component-method-with-sinon
      //formatHandler = sandbox.spy(Input.prototype.__reactAutoBindMap, 'format');  
      //blurHandler = sandbox.spy(Input.prototype.__reactAutoBindMap, 'blur');  
      //focusHandler = sandbox.spy(Input.prototype.__reactAutoBindMap, 'focus');  
      //formatter = sandbox.spy(function (val) {return '^' + val + '^'});
    });
    
    describe('no format tests', function() {
      xit('should call format handler on init, and set input to value passed in if there is no formatting function', function() {
        setupComponent({value: 12});
        sinon.assert.calledOnce(formatHandler);
        expect(ReactDOM.findDOMNode(input).value).to.equal('12');        
      });
    });
    
    describe('formatter tests', function() {
      xit('should call formatting function on init if one is passed in, and display formatted value', function() {
        setupComponent({formatter: formatter, value: 12});
        sinon.assert.calledOnce(formatHandler);
        sinon.assert.calledOnce(formatter);
        expect(ReactDOM.findDOMNode(input).value).to.equal('^12^');
      });
      
      xit('should display formatted value on init, actual value when input is focused, and formatted value again when input is blurred', function() {
        setupComponent({formatter: formatter, value: 12});
        sinon.assert.notCalled(focusHandler);
        sinon.assert.notCalled(blurHandler);
        sinon.assert.calledOnce(formatHandler);
        sinon.assert.calledOnce(formatter);
        expect(ReactDOM.findDOMNode(input).value).to.equal('^12^');

        TestUtils.Simulate.focus(input);
        sinon.assert.calledOnce(focusHandler);
        expect(ReactDOM.findDOMNode(input).value).to.equal('12');

        TestUtils.Simulate.blur(input);
        sinon.assert.calledOnce(blurHandler);
        sinon.assert.calledTwice(formatHandler);
        sinon.assert.calledTwice(formatter);
        expect(ReactDOM.findDOMNode(input).value).to.equal('^12^');
      });
      
    });
    
  });
  
  describe('event tests', function() {
    var changeHandler, blurHandler, focusHandler, customBlurHandler, customFocusHandler, customChangeHandler;
    beforeEach(function () {
      //http://stackoverflow.com/questions/24280428/stubbing-a-react-component-method-with-sinon
      //blurHandler = sandbox.spy(Input.prototype.__reactAutoBindMap, 'blur');  
      //focusHandler = sandbox.spy(Input.prototype.__reactAutoBindMap, 'focus');  
      //changeHandler = sandbox.spy(Input.prototype.__reactAutoBindMap, 'change'); 
      customBlurHandler = sandbox.spy();  
      customFocusHandler = sandbox.spy();  
      customChangeHandler = sandbox.spy();  
    });
    
    xit('calls change handler on change event & updates value of input', function() {
      setupComponent({value: 12});
      sinon.assert.notCalled(changeHandler);
      expect(ReactDOM.findDOMNode(input).value).to.equal('12');

      TestUtils.Simulate.change(input, {target: { value: 'a' }});
      sinon.assert.calledOnce(changeHandler);
      sinon.assert.notCalled(customChangeHandler);
      expect(ReactDOM.findDOMNode(input).value).to.equal('a');
    });
    
    xit('calls blur handler on blur event & updates focused state', function() {
      setupComponent({value: 12});
      sinon.assert.notCalled(blurHandler);
      expect(input.state.focused).to.equal(undefined);

      TestUtils.Simulate.blur(input);
      // wait for state to change TODO: is there a better way to do this?
      setTimeout(function () {
        expect(input.state.focused).to.equal(false);
      }, 3000);
      sinon.assert.calledOnce(blurHandler);
      sinon.assert.notCalled(customBlurHandler);
    });
    
    xit('calls focus handler on focus event & updates focused state', function() {
      setupComponent({value: 12});
      sinon.assert.notCalled(focusHandler);
      expect(input.state.focused).to.equal(undefined);

      TestUtils.Simulate.focus(input);
      sinon.assert.calledOnce(focusHandler);
      setTimeout(function () {
        expect(input.state.focused).to.equal(true);
      }, 30000);
      sinon.assert.notCalled(customFocusHandler);
    });
    
    xit('calls any passed in onChange handler from change event handler', function() {
      setupComponent({onChange: customChangeHandler});
      sinon.assert.notCalled(changeHandler);
      sinon.assert.notCalled(customChangeHandler);

      TestUtils.Simulate.change(input);
      sinon.assert.calledOnce(changeHandler);
      sinon.assert.calledOnce(customChangeHandler);
    });
    
    xit('calls any passed in onBlur handler from blur event handler', function() {
      setupComponent({onBlur: customBlurHandler});
      sinon.assert.notCalled(blurHandler);
      sinon.assert.notCalled(customBlurHandler);

      TestUtils.Simulate.blur(input);
      sinon.assert.calledOnce(blurHandler);
      sinon.assert.calledOnce(customBlurHandler);
    });
    
    xit('calls any passed in onFocus handler from focus event handler', function() {
      setupComponent({onFocus: customFocusHandler});
      sinon.assert.notCalled(focusHandler);
      sinon.assert.notCalled(customFocusHandler);

      TestUtils.Simulate.focus(input);
      sinon.assert.calledOnce(focusHandler);
      sinon.assert.calledOnce(customFocusHandler);
    });
    
  });
  
  describe('additional props tests', function() {
    var customKeyUpHandler;
    beforeEach(function () {
      customKeyUpHandler = sandbox.spy();  
    });
    
    it('does not set a class on the input it generates by default', function() {
      setupComponent({value: '123'})
      expect(ReactDOM.findDOMNode(input).className).to.equal('');
    });
    
    it('will pass a className prop on the component to the input it generates', function() {
      setupComponent({value: '123', className: 'test-class'})
      expect(ReactDOM.findDOMNode(input).className).to.equal('test-class');
    });
    
    it('does not call handler on keyup event', function() {
      setupComponent({value: '123'});
      sinon.assert.notCalled(customKeyUpHandler);      

      TestUtils.Simulate.keyUp(input, {});
      sinon.assert.notCalled(customKeyUpHandler);      
    });
    
    it('should call event handlers that are passed in for events that are not handled by component', function() {
      setupComponent({value: '123', onKeyUp:customKeyUpHandler});
      sinon.assert.notCalled(customKeyUpHandler);      

      TestUtils.Simulate.keyUp(input, {});
      sinon.assert.calledOnce(customKeyUpHandler);      
    });
  
  });
  
  
})