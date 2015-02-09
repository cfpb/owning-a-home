// Allows decorating of an object with a Universal Unique IDentifier (UUID).

// @param target [Object] An object to attach methods to.
function attach ( target ) {
  var proxy = new UUID();
  target.UUID = proxy.UUID;
  return target;
}

var _UUID = 0;

function UUID () {

  // @return [Number] A UUID attached to the target object.
  this.UUID = (function () {
    var UUID = _UUID++;

    // Perhaps this is overkill.
    if ( _UUID === Number.MAX_VALUE ) {
      throw new Error( 'Maximum number of InputGraded instances created!' );
    }

    return UUID;
  }) ();
}

// Expose public methods externally.
this.attach = attach;
