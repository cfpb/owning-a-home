// config file used for adding external libraries that require browserify shimming
module.exports = {
  jquery: {
    exports: 'jQuery'
  },
  highcharts: {
    depends: {
      jquery: 'jQuery',
    }
  }
};