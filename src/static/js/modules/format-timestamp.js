module.exports = function( then ) {

  // format the date for older versions of IE
  then = then.slice(0, 10).replace('-', '/');
  then = new Date( then );
  return (then.getUTCMonth() + 1) + '/' + then.getUTCDate() + '/' +  then.getUTCFullYear();

};
