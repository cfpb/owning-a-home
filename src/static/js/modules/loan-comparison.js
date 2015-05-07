var $ = jQuery = require('jquery');
var debounce = require('debounce');
var formatUSD = require('format-usd');
require('tooltips');

var app = require('./loan-comparison/app');
var appUI = require('./loan-comparison/app-ui');
var loanService = require('./loan-comparison/loan');
var loanUI = require('./loan-comparison/loan-ui');
var mortgageCalculations = require('./loan-comparison/mortgage-calculations');
var api = require('./loan-comparison/api');
var utils = require('./loan-comparison/ui-utils');


// Init the page.
function init() {
    // Setup appState & reflect it in UI
    appUI.setup();
    app.resetState();
    
    // Setup event handlers on the shared inputs.
    $('#input-state').on('change', function (e) {
        app.setStateProperty('state', $(e.target).val());
    });
    $('#input-county').on('change', function (e) {
        app.setStateProperty('county', $(e.target).val());
    });
    $('#input-scenario').on('change', function (e) {
        console.log('changed')
        app.setStateProperty('scenario', $(e.target).val());
    });
    // scenario choice
    // custom scenario buttons
    
    // get loans from loanService
    // Setup the loans.
    var loans = loanService.resetLoans();
    $.each(loans, function(loanInd, loan) {
        loanUI.setup(loan);
        loan = loanService.resetLoan(loan);
        loanUI.resetLoanUI(loan);
        
        // set up event handlers on the loan inputs
        var $inputs = loanUI.$loanInputEls[loan.id];
        
        $.each(loanUI.loanSelectInputs, function (ind, prop) {
            $inputs[prop].on('change', function(e) {
                loanService.updateLoanProperty(loan, prop, $(e.target).val());
            });
        });
        
        $.each(loanUI.loanRadioInputs, function (ind, prop) {
            $inputs[prop].on('click', function(e) {
                loanService.updateLoanProperty(loan, prop, $(e.target).val());
            });
        });
                                  
        $.each(loanUI.loanTextInputs, function (ind, prop) {
            var allowedKeys = [ 8, 9, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
                              96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 188, 190 ];
            var $el = $inputs[prop];
                        
            $el.on('keyup', debounce(function (e) {
                var val = $el.val();
                loanService.updateLoanProperty(loan, prop, +val);
            }, 500));
            
            $el.on( 'keydown', function(e){
                var key = e.which;
                if (allowedKeys.indexOf(key) === -1) {
                    e.preventDefault();
                }
            });
        });
        
        $('#button-interest-rate-' + loan.id).click(function rateUpdateHandler(e) {
            e.preventDefault();
            loanService.getRates(loan);
        });
    });
    
    // set up tooltips
    $('body').tooltip({
        selector: '[data-toggle="tooltip"]',
        'placement': 'bottom', 
        title: function getTooltipTitle(){
            return $(this).attr('title') || $(this).next('.help-text').html();
        }
    });
}

$(document).ready(function() {
    init();
});