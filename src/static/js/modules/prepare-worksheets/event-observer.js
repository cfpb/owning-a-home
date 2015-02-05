// Used for creating an object that can be used to dispatch and listen
// to custom events.

// @param target [Object] An object to attach event listener methods to.
function attach(target) {
  var eventObserver = new EventObserver();
  target.addEventListener = eventObserver.addEventListener;
  target.removeEventListener = eventObserver.removeEventListener;
  target.dispatchEvent = eventObserver.dispatchEvent;
  return target;
}

function EventObserver() {

  // The events registered on this instance.
  var _events = {};

  // Register an event listener.
  // @param evt [String] The event name to listen for.
  // @param callback [Function] The function called when the event has fired.
  function addEventListener(evt, callback) {
    // jshint validthis: true
    if (_events.hasOwnProperty(evt))
      _events[evt].push(callback);
    else
      _events[evt] = [callback];

    return this;
  }

  // Remove an added event listener.
  // Must match a call made to addEventListener.
  // @param evt [String] The event name to remove.
  // @param callback [Function] The function attached to the event.
  function removeEventListener(evt, callback) {
    // jshint validthis: true
    if (!_events.hasOwnProperty(evt))
      return;

    var index = _events[evt].indexOf(callback);
    if (index !== -1)
      _events[evt].splice(index, 1);

    return this;
  }

  // Broadcast an event.
  // @param evt [String] The type of event to broadcast.
  // @param options [Object] The event object to pass to the event handler.
  function dispatchEvent(evt, options) {
    // jshint validthis: true
    if (!_events.hasOwnProperty(evt))
      return;

    options = options || {};

    var evts = _events[evt], len = evts.length;
    for (var e = 0; e < len; e++) {
      evts[e].call(this, options);
    }

    return this;
  }

  return {
    addEventListener: addEventListener,
    removeEventListener: removeEventListener,
    dispatchEvent: dispatchEvent
  };
}

// Expose public methods.
this.attach = attach;
