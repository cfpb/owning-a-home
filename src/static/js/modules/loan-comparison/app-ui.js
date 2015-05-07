var utils = require('./ui-utils');
var common = require('./common');

var $ = jQuery = require('jquery');

var inputProps = ['state', 'county'];
var inputLookup = function (prop) {
    return '#input-' + prop
};
var $inputEls = {};

function setup() {
    // cache the els
    $inputEls = utils.cacheElements(inputProps, inputLookup);
}

// Update the UI to match refreshed app state.
function reset (appState) {
    // update the shared inputs w/ state
    utils.updateInputs($inputEls, appState);
}

function showScenario (scenario) {
    var data = common.scenarios[scenario];
    $('#scenario-title').text(data.title);
    $('#scenario-intro').text(data.intro);
}

module.exports = {
    setup: setup,
    reset: reset,
    showScenario: showScenario
};