// Add in Google Analytics tracking check wrapper
// http://ejohn.org/blog/fixing-google-analytics-for-ghostery/
var track = function(category, name, value) {
  if (window._gaq) {
    window._gaq.push(['_trackEvent', category, name, value]);
  }
};

module.exports = track;