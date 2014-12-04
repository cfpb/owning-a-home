module.exports = function( then ) {

  then = new Date( then );
  return (then.getUTCMonth() + 1) + '/' + then.getUTCDate() + '/' +  then.getUTCFullYear();

};
