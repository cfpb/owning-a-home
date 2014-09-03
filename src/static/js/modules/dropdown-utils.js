/**
 * Some dropdown utility methods.
 * @param  {string | array} id ID(s) of the HTML select elements.
 * @return {object} Methods to manipulate the requested elements.
 */
var utils = function( id ) {

  var $el;

  if ( !id ) {
    throw new Error('You must specify the id of a dropdown.');
  }

  // If they provided an array, select 'em all. Otherwise, just the one.
  $el = id instanceof Array
      ? $( '#' + id.join(', #') )
      : $el = $( '#' + id );

  /**
   * If optionVal is provided as an array, turn it into a string
   *  of attribute selectors. Otherwise, just create a single attribute
   *  selector. If no val is provided, return an asterisk to select
   *  all elements.
   * @param  {string|array} optionVal Option(s) in the dropdown to modify.
   * @return {string}       Selector string of values.
   */
  function parseVals( optionVal ) {
    return optionVal instanceof Array
           ? '[value=' + optionVal.join('],[value=') + ']'
           : optionVal ? '[value=' + optionVal + ']' : '*';
  }

  /**
   * Disable a select element's option(s).
   * @param  {string | array} optionVal The value(s) of the options
   * that you'd like to disable. Can be a string or an array. If no
   * option(s) are specified, the entire dropdown is disabled.
   * @return {object} this
   */
  function disable( optionVal ) {
    if ( !optionVal ) {
      $el.attr('disabled', 'disabled');
    }
    $el.find('option')
       .filter( parseVals(optionVal) )
       .attr( 'disabled', 'disabled' );
    return this;
  }

  /**
   * Enable a select element's option(s).
   * @param  {string | array} optionVal The value(s) of the options
   * that you'd like to enable. Can be a string or an array. If no
   * option(s) are specified, the entire dropdown is enabled.
   * @return {object} this
   */
  function enable( optionVal ) {
    if ( !optionVal ) {
      $el.removeAttr('disabled');
    }
    $el.find('option')
       .filter( parseVals(optionVal) )
       .removeAttr('disabled');
    return this;
  }

  /**
   * Resets the select's element to its first option.
   * @return {object} this
   */
  function reset() {
    $el.each(function() {
      $( this )[0].selectedIndex = 0;
    });
    return this;
  }

  /**
   * Show a dropdown.
   * @return {object} this
   */
  function show() {
    $el.each(function() {
      var $container = $( '.' + $( this ).attr('id') );
      $container.removeClass('hidden');
    });
    return this;
  }

  /**
   * Hide a dropdown.
   * @return {object} this
   */
  function hide() {
    $el.each(function() {
      var $container = $( '.' + $( this ).attr('id') );
      $container.addClass('hidden');
    });
    return this;
  }

  /**
   * Show a loading animation.
   * @return {object} this
   */
  function showLoading() {
    $el.each(function() {
      var $container = $( '.' + $( this ).attr('id') );
      $container.addClass('loading');
    });
    return this;
  }

  /**
   * Hide the loading animation.
   * @return {object} this
   */
  function hideLoading() {
    $el.each(function() {
      var $container = $( '.' + $( this ).attr('id') );
      $container.removeClass('loading');
    });
    return this;
  }

  /**
   * Give a dropdown a yellow border to highlight it.
   * @return {object} this
   */
  function showHighlight() {
    $el.each(function() {
      $( this ).parent().addClass('highlight-dropdown');
    });
    return this;
  }

  /**
   * Remove a dropdown's highlight.
   * @return {object} this
   */
  function hideHighlight() {
    $el.each(function() {
      $( this ).parent().removeClass('highlight-dropdown');
    });
    return this;
  }

  return {
    disable: disable,
    enable: enable,
    show: show,
    hide: hide,
    showLoadingAnimation: showLoading,
    hideLoadingAnimation: hideLoading,
    showHighlight: showHighlight,
    hideHighlight: hideHighlight,
    reset: reset
  };

};

module.exports = utils;