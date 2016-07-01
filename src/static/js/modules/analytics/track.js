'use strict';

// Add in Google Analytics tracking check wrapper
// http://ejohn.org/blog/fixing-google-analytics-for-ghostery/
function track( category, name, value ) {
  if ( window._gaq ) {
    window._gaq.push( [ '_trackEvent', category, name, value ] );
  }
}

module.exports = track;
