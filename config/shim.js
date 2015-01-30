// config file used for adding external libraries that require browserify shimming
module.exports = {
  jquery: {
    exports: 'jQuery'
  },
  'jquery-easing': {
    depends: {
      jquery: 'jQuery',
    }
  },
  'cf-expandables': {
    depends: {
      jquery: 'jQuery',
    }
  },
  highcharts: {
    depends: {
      jquery: 'jQuery',
    }
  },
  sticky: {
    depends: {
      jquery: 'jQuery',
    }
  }
};
