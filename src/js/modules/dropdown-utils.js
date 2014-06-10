/**
 * Some dropdown utility methods.
 * @param  {string | array} id ID(s) of the HTML select elements.
 * @return {object} Methods to manipulate the requested elements.
 */
var utils = function( id ) {

  var $el;

  if (!id) {
    throw new Error('You must specify the id of a dropdown.');
  }

  // If they provided an array, select 'em all. Otherwise, just the one.
  $el = id instanceof Array
      ? $( '#' + id.join(', #') )
      : $el = $( '#' + id );

  // If optionVal is provided as an array, turn it into a string
  // of attribute selectors. Otherwise, just create a single attribute
  // selector. If no val is provided, return an asterisk to select 
  // all elements.
  function parseVals( optionVal ) {
    return optionVal instanceof Array
           ? '[value=' + optionVal.join('],[value=') + ']'
           : optionVal ? '[value=' + optionVal + ']' : '*';
  }

  /**
   * Disable a select element's option(s).
   * @param  {string | array} optionVal The value(s) of the options
   * that you'd like to disable. Can be a string or an array.
   * @return {jQuery object} The element(s) that were manipulated.
   */
  function disable( optionVal ) {
    return $el.find('option')
              .filter( parseVals(optionVal) )
              .attr( 'disabled', 'disabled' );
  }

  /**
   * Enable a select element's option(s).
   * @param  {string | array} optionVal The value(s) of the options
   * that you'd like to enable. Can be a string or an array.
   * @return {jQuery object} The element(s) that were manipulated.
   */
  function enable( optionVal ) {
    return $el.find('option')
              .filter( parseVals(optionVal) )
              .removeAttr('disabled');
  }

  /**
   * Resets the select's element to its first option.
   * @return {jQuery object} The element(s) that were manipulated.
   */
  function reset() {
    $el.each(function() {
      $( this )[0].selectedIndex = 0;
    });
    return $el;
  }

  /**
   * Hide a dropdown.
   * @return {jQuery object} The element(s) that were manipulated.
   */
  function hide() {
    $el.each(function() {
      $( this ).parents('.col-6').addClass('hidden');
    });
    return $el;
  }

  /**
   * Show a dropdown.
   * @return {jQuery object} The element(s) that were manipulated.
   */
  function show() {
    $el.each(function() {
      $( this ).parents('.col-6').removeClass('hidden');
    });
    return $el;
  }

  return {
    disableOption: disable,
    enableOption: enable,
    hide: hide,
    show: show,
    reset: reset
  };

};

module.exports = utils;
