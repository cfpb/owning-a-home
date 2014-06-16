var highcharts = require('highcharts');

Highcharts.theme = {
  colors: ['#FFCE8D'],
  style: {
    fontFamily: '"Avenir Next", Arial, Helvetica, sans-serif',
    fontSize: '13px'
  },
  chart: {
    backgroundColor: ['#fff'],
  },
  yAxis: {
    labels: {
      style: {
        color: '#BABBBD',
      }
    },
    minorTickInterval: null,
    gridLineColor: '#E3E4E5',
    tickWidth: 0,
    title: {
      style: {
        color: '#BABBBD',
        fontSize: '10px',
        fontFamily: '"Avenir Next", Arial, sans-serif'
      },
      rotation: 450
    },
    plotLines: [{
      color: '#919395',
      width: 1,
      value: 0,
      zIndex: 100
    }]
  },
  xAxis: {
    labels: {
      style: {
        color: '#fff' // hide the labels
      }
    },
    minorTickInterval: null,
    tickWidth: 0,
    title: {
      style: {
        color: '#BABBBD',
        fontSize: '12px',
        fontWeight: 'medium',
        fontFamily: '"Avenir Next", Arial, sans-serif'
      }
    }
  },
  tooltip: {
    backgroundColor: 'transparent',
    borderColor: 'none',
    shadow: false
  },
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
