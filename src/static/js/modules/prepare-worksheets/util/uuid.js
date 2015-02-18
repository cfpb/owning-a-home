var _UUID = 0;

this.generateIdentifier = function () {
  // @return [Number] A UUID
  var UUID = _UUID++;

  // Perhaps this is overkill.
  if ( _UUID === Number.MAX_VALUE ) {
    throw new Error( 'Maximum number of instances created!' );
  }

  return UUID;
}


