// from https://github.com/mochajs/mocha/issues/1458

var fs = require('fs');
var ReactTools = require("react-tools");

require.extensions['.jsx'] = function(module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    var compiled = ReactTools.transform(content, {harmony: true} );

    return module._compile(compiled, filename); // module._compile is not mentioned in the Node docs, what is it? And why is it private-ish?
};