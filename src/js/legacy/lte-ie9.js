if ( !console ) {
  console = {};
  console.log = function(){};
}

if (typeof Object.create != 'function') {
    (function () {
        var F = function () {};
        Object.create = function (o) {
            if (arguments.length > 1) {
              throw Error('Second argument not supported');
            }
            if (typeof o != 'object') {
              throw TypeError('Argument must be an object');
            }
            F.prototype = o;
            return new F();
        };
    })();
}

if (!Object.isFrozen) {
    Object.isFrozen = function isFrozen(object) {
        return false;
    };
}