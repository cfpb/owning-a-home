require('./nemo');
require('./nemo-shim');

var $ = jQuery = require('jquery');
require('tooltips');

var monthlyPaymentMsg = 'Make sure to download this PDF and open it in Adobe Acrobat.\nOtherwise, the calculations may not work correctly.';

$(document).ready( function() {
  
  $('a[href$="monthly_payment_worksheet.pdf"]').tooltip({
      'placement': 'bottom',
      container: 'body',
      title: function getTooltipTitle(){
          return monthlyPaymentMsg;
      }
  });
  
});
