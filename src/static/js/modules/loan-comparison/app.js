var $ = jQuery = require('jquery');
var loanService = require('./loan');
var appUI = require('./app-ui');
var defaultAppState = {
    'state': 'CA'
};

var app = {};
var scenarios = {
    
}

app.state = {};

// Refresh the app state with new properties.
app.resetState = function (props) {
    props || (props = defaultAppState);
    app.state = $.extend({}, props);
    appUI.reset(app.state);
}

app.setStateProperty = function (prop, val) {
    app.state[prop] = val;
    
    if (prop === 'state') {
        loanService.updateSharedProperty(prop, val);
        
        app.state.county = null;
        app.state.counties = null;
        // resets county dropdown
        // makes request for counties
    } else if (prop === 'scenario') {
        //loanService.updateSharedProperty(prop, val);
        appUI.showScenario(val);
    }
}

module.exports = app;