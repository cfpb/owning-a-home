var React = require('react');
var $ = jQuery = require('jquery');


var TestComp = React.createClass({
  
    getInitialState: function() {
        return  {
         
        };
    },


    render: function() {
        return (
          React.createElement("div", {className: "monthly-payment_worksheet"}
          )
        );
    }

});
module.exports = TestComp;