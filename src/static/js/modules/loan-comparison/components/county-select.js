var React = require('react');
var common = require('../common');

// adds background image of a down arrow to select
var CountySelect = React.createClass({
        
    generateOptions: function () {
        if (this.props.items) {
            var opts = this.props.items.map(function (opt) {
                return (
                    <option value={opt['complete_fips']} data-value={{opt}}>{opt['county']}</option>
                );
            }, this);
            return opts;
        }
    },
    handleChange: function (e) {
        console.log(e.target);
        var val;
        var options = e.target.options;
          for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
              val = options[i].getAttribute('data-value');
              break;
            }
          }
        
        this.props.onChange(val);
    },
    render: function() {
        var className = 'select-content ';
        if (this.props.className) {
            className += this.props.className;
        }
        
        // pass everything through but className
        var props = common.omit(this.props, 'className');
        var loan = this.props.loan;
        var val = (loan && loan.county) ? loan.county['complete_fips'] : null;
        return (
            <div className={className}>
                <select value={val} onChange={this.handleChange}>
                    {this.generateOptions()}
                </select>
            </div>
        );
    }
});

module.exports = CountySelect;