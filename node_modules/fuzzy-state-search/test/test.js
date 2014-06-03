var getState = require('../index.js'),
    pos = {};

// Test a bunch of coordinates
exports['Portland coordinates should return Oregon'] = function (test) {
  pos.coords = {
    latitude: 45.511656,
    longitude: -122.623554
  };
  test.equal(getState(pos), 'OR');
  test.done();
};

exports['Los Angeles coordinates should return California'] = function (test) {
  pos.coords = {
    latitude: 34.018222,
    longitude: -118.305989
  };
  test.equal(getState(pos), 'CA');
  test.done();
};

exports['Fort Dodge coordinates should return Iowa'] = function (test) {
  pos.coords = {
    latitude: 42.504948,
    longitude: -94.170732
  };
  test.equal(getState(pos), 'IA');
  test.done();
};

exports['Woodward coordinates should return Oklahoma'] = function (test) {
  pos.coords = {
    latitude: 36.435458,
    longitude: -99.440386
  };
  test.equal(getState(pos), 'OK');
  test.done();
};

exports['Ocala coordinates should return Florida'] = function (test) {
  pos.coords = {
    latitude: 29.205912,
    longitude: -82.103960
  };
  test.equal(getState(pos), 'FL');
  test.done();
};

exports['Greenville coordinates should return North Carolina'] = function (test) {
  pos.coords = {
    latitude: 35.635902,
    longitude: -77.379840
  };
  test.equal(getState(pos), 'NC');
  test.done();
};

exports['Madison coordinates should return Wisconsin'] = function (test) {
  pos.coords = {
    latitude: 43.065706,
    longitude: -89.398882
  };
  test.equal(getState(pos), 'WI');
  test.done();
};

exports['Corpus Christi coordinates should return Texas'] = function (test) {
  pos.coords = {
    latitude: 27.815793,
    longitude: -97.396929
  };
  test.equal(getState(pos), 'TX');
  test.done();
};

exports['Lansing coordinates should return Michigan'] = function (test) {
  pos.coords = {
    latitude: 42.729877,
    longitude: -84.587073
  };
  test.equal(getState(pos), 'MI');
  test.done();
};

exports['Lewiston coordinates should return Maine'] = function (test) {
  pos.coords = {
    latitude: 44.118167,
    longitude: -70.173010
  };
  test.equal(getState(pos), 'ME');
  test.done();
};

exports['Boston coordinates should return Massachusetts'] = function (test) {
  pos.coords = {
    latitude: 42.357541,
    longitude: -71.040930
  };
  test.equal(getState(pos), 'MA');
  test.done();
};

exports['Norfolk coordinates should return Virginia'] = function (test) {
  pos.coords = {
    latitude: 37.534789,
    longitude: -77.429480
  };
  test.equal(getState(pos), 'VA');
  test.done();
};

exports['New Iberia coordinates should return Louisiana'] = function (test) {
  pos.coords = {
    latitude: 30.016641,
    longitude: -91.842785
  };
  test.equal(getState(pos), 'LA');
  test.done();
};

exports['Nashville coordinates should return Tennessee'] = function (test) {
  pos.coords = {
    latitude: 36.182329,
    longitude: -86.812037
  };
  test.equal(getState(pos), 'TN');
  test.done();
};