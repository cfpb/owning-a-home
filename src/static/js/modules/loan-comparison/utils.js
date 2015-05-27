var utils = {};

utils.median = function (arr) {
    arr.sort( function(a,b) {return a - b;} );
    var half = Math.floor(arr.length / 2);
    return arr[half];
}

utils.capitalizeFirst = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

utils.capitalizeFirst = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}



module.exports = utils;