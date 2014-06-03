[![Build Status](https://travis-ci.org/cfpb/fuzzy-state-search.svg?branch=master)](https://travis-ci.org/cfpb/fuzzy-state-search)

Get the U.S. state closest to the user's position. Compares lat/lon coordinates from a [`Position` object](https://developer.mozilla.org/en-US/docs/Web/API/Position) to the centroid of each U.S. state. Favors speed over accuracy.

Locations near a state's border may return an incorrect, neighboring state. If accuracy is important, you should use a third-party [reverse geocoding](http://en.wikipedia.org/wiki/Reverse_geocoding) API (e.g. [Google's](https://developers.google.com/maps/documentation/geocoding/?csw=1#ReverseGeocoding)).

## Installation

First install [node.js](http://nodejs.org/). Then:

```sh
npm install fuzzy-state-search --save
```

## Usage

[Require](http://browserify.org/) the module and pass it a [`Position` object](https://developer.mozilla.org/en-US/docs/Web/API/Position):

```javascript
var getState = require('fuzzy-state-search');

function logState( pos ){
  var state = getState( pos );
  console.log( 'User lives in ' + state );
};

// Get their coordinates using the HTML5 geolocation API.
navigator.geolocation.getCurrentPosition( logState );
```

## Contributing

Please read the [Contributing guidelines](CONTRIBUTING.md).

### Running Tests

We are using [nodeunit](https://github.com/caolan/nodeunit) to test. To run tests, first install nodeunit and any dependencies via npm:

```
npm install
```

Run tests with:

```
npm test
```
