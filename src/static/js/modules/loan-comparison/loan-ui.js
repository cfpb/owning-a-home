var $ = jQuery = require('jquery');
var formatUSD = require('format-usd');
var dropdown = require('../dropdown-utils');
var utils = require('./ui-utils');
var common = require('./common');
var positive = require('stay-positive');


var loanSelectInputs = ['credit-score', 'rate-structure', 'loan-term', 'loan-type', 'arm-type', 'interest-rate'];
var loanTextInputs = ['price', 'downpayment', 'downpayment-percent'];
var loanRadioInputs = ['points'];
var loanInputs = loanSelectInputs.concat(loanTextInputs, loanRadioInputs);

var directOutputs = ['interest-rate', 'loan-term', 'downpayment'];
var calculatedOutputs = ['loan-summary', 'loan-amount'];
var calculatedOutputsBasedOnIR = [
    'discount', 'processing', 'third-party-services',
    'insurance', 'taxes-gov-fees', 'prepaid-expenses', 'initial-escrow',        
    'monthly-taxes-insurance', 'monthly-hoa-dues', 'monthly-principal-interest',
    'monthly-mortgage-insurance', 'monthly-payment', 'closing-costs', 
    'principal-paid', 'interest-fees-paid', 'overall-cost'
];
var loanOutputs = directOutputs.concat(calculatedOutputs, calculatedOutputsBasedOnIR);

function loanOutputsLookup (prop, opts) {
    return '.output-' + prop + '-' + opts.id
};
function loanInputsLookup (prop, opts) {
    return '#input-' + prop + '-' + opts.id
};

function loanInputRowLookup (prop) {
    return '#row-input-' + prop;
}

$loanOutputEls = [];
$loanInputEls = [];
$loanInputRows = [];

var msgs = {
    'downpayment-too-high': 'Your down payment cannot be more than your house price.',
    'downpayment-too-low': {
        fha: 'FHA loans typically require a down payment of at least ' + common.minDownpaymentPcts.fhaPercent + '%.',
        conf: 'Conventional loans typically require a down payment of at least ' + common.minDownpaymentPcts.confPercent + '%.'
    },
    'is-arm': 'While some lenders may offer FHA, VA, or 15-year adjustable-rate mortgages, they are rare. We don’t have enough data to display results for these combinations. Choose a fixed rate if you’d like to try these options.'
}

function setup (loan) {
    console.log('setting up')
    var id = loan.id;
    $loanInputEls[id] = utils.cacheElements(loanInputs, loanInputsLookup, {id: id});
    console.log($loanInputEls)
    $loanInputRows[id] = utils.cacheElements(loanInputs, loanInputRowLookup);
    $loanOutputEls[id] = utils.cacheElements(loanOutputs, loanOutputsLookup, {id: id});
    // show scenario
        
}

function downpayment (loan) {
    var $msgEl = $('.msg-downpayment-' + loan.id );
    
    if (loan['downpayment-too-high']) {
        utils.toggleMsg($msgEl, msgs['downpayment-too-high']);
    } else if (loan['downpayment-too-low']) {
        // TODO: update field with min val
        var loanType = loan['loan-type'].split('-')[0],
            minDownpayment = common.minDownpaymentPcts[loanType] * loan['price'],
            minDownpaymentPercent = common.minDownpaymentPcts[loanType + 'Percent'],
            $inputs = $loanInputEls[loan.id];
        utils.updateInput($inputs['downpayment'], minDownpayment);
        utils.updateInput($inputs['downpayment-percent'], minDownpaymentPercent);
        utils.toggleMsg($msgEl, msgs['downpayment-too-low'][loanType]);
    } else {
        utils.toggleMsg($msgEl);
    }
}

function arm (loan) {
    var disallowedTypes = [ 'fha', 'va', 'va-hb', 'fha-hb'],
        disallowedTerms = [15],
        $inputs = $loanInputEls[loan.id],
        $armSelectContainer = $inputs['arm-type'].closest('.select-content'),
        $msgEl = $('#msg-arm-type-' + loan.id),
        // note: the dropdown plugin wants an id string, not an $el
        typeSelect = 'input-loan-type-' + loan.id,
        termSelect = 'input-loan-term-' + loan.id;
        
    if (loan['is-arm']) {
        utils.toggleEl($armSelectContainer, true);
        dropdown(termSelect).disable(disallowedTerms);
        dropdown(typeSelect).disable(disallowedTypes);
        // TODO: set zero index value on loan

        // armTermError
        if (disallowedTerms.indexOf(+loan['loan-term']) !== -1) {
            dropdown(termSelect).reset();
            dropdown(termSelect).showHighlight();
            utils.toggleMsg($msgEl, msgs.isArm);
        }
        // armTypeError
        if (disallowedTypes.indexOf(loan['loan-type']) !== -1) {
            dropdown(termSelect).reset();
            dropdown(typeSelect).showHighlight();
            utils.toggleMsg($msgEl, msgs.isArm);
        }
        
    } else {
        utils.toggleEl($armSelectContainer);
        utils.toggleMsg($msgEl);
        dropdown(typeSelect).hideHighlight();
        dropdown(termSelect).hideHighlight();
        
        if (!loan['is-jumbo']) {
            dropdown(termSelect).enable(disallowedTerms);
            dropdown(typeSelect).enable(disallowedTypes);
        }
    }
}

function jumbo (loan) {
    
}

function interestRate (loan) {
    var $container = $('#interest-rate-container-' + loan.id);
    if (loan['edited']) {
        if (loan['rate-request']) {
            // show loading
            $container.removeClass('update').addClass('updating');
        } else {
            // show button
            $container.removeClass('updating').addClass('update');
        }
    } else {
        // show dropdown
        $container.removeClass('updating update');
    }
}


// Make sure UI reflects refreshed loan state.
function resetLoanUI (loan) {
    // update inputs with new loan values
    utils.updateInputs($loanInputEls[loan.id], loan);
    
    // update outputs
    updateLoanOutputs(loan);
}

function updateDownpaymentUI (loan, prop) {
    var $input = $loanInputEls[loan.id][prop];
    $input.val(loan[prop]);
}

function formatOutput(prop, val) {
    console.log(prop);
    console.log(val);
    if (prop === 'loan-amount') {
        val = formatUSD(positive(val), {decimalPlaces:0})
    } else if ($.inArray(prop, ['loan-summary', 'loan-term'])) {
        val = formatUSD(val, {decimalPlaces:0});
    }
    console.log(val);
    
    return val;
}

// Update the outputs for a loan when a loan property changes.
// Different outputs change dep. on whether changed prop is interest rate.
function updateLoanOutputs (loan, rateChange) {
    var outputs = rateChange ? calculatedOutputsBasedOnIR : calculatedOutputs;
    var $els = $loanOutputEls[loan.id];
        
    $.each(outputs, function (ind, prop) {
        $els[prop].each(function (i, el) {
            var val = formatOutput(prop, loan[prop]);
            $(this).text(val);
        });
    });
    
    if (rateChange) {
        $.each(directOutputs, function (ind, prop) {
            $els[prop].each(function (i, el) {
                $(this).text(loan[prop]);
            });
        });
    } else {
        // clear all IR-dependent fields
        $.each(directOutputs.concat(calculatedOutputsBasedOnIR), function (ind, prop) {
            $els[prop].each(function (i, el) {
                $(this).text('');
            });
        });
    }
}

function buildRateOptions(rates) {
    // TODO: get median
    var ratesArr = [];
    $.each(rates, function(key, val) {
        var rateObj = {
            val: key,
            text: key + '%'
        };
        ratesArr.push(rateObj);
    });
    ratesArr.sort(function(a,b){return a.val - b.val;})
    return ratesArr;
}

function updateRateSelect (loan, rates) {
    var options = buildRateOptions(rates),
        select = $loanInputEls[loan.id]['interest-rate'];
    utils.resetSelect(select, options);
}

function buildCountyOptions(counties) {
    var opts = [];    
    var counties = {};
    
    $.each(counties, function(ind, val) {
        counties[val.complete_fips] = val;
        opts.push({text: val.county, val: val.complete_fips});
    });

    opts.sort( function(x,y) {
        if ( x.text > y.text ) {
            return 1;
        }
        else if ( x.text < y.text ) {
            return -1;
        }
        else {
            return 0;
        }
    });
    
    return {
        opts: opts,
        counties: counties
    }
}

function updateCountySelect(counties) {
    //var $select = ['county'];
    var countyData = buildCountyOptions(counties);
    //app.setStateProperty('counties', countyData.counties);
    //app.setStateProperty('county', countyData.opts[0].val);
    
    //utils.resetSelect($select, countyData.opts);
}

function showScenario (loan) {
    var scenario = loan.scenario,
        scenarioData = common.scenarios[scenario];
        rows = scenarioData.rows,
        $rows = $loanInputRows[loan.id];
    highlightRows(rows, $rows);
    disableRows(rows, $rows);
}

function resetRows() {
    $.each($loanInputRows, function (key, $row) {
        $row.removeClass('highlighted disabled');
        
    })
    // each of the text & selects -- re-enabled
}

function highlightRows(rows, $rows) {
    $.each($rows, function (key, $row) {
        //if ($.inArray("baz", arr))
    })
    $.each(rows, function (prop, note) {
        $rows[prop].addClass('highlighted')
    })
    
}

module.exports = {
    updateDownpaymentUI: updateDownpaymentUI,
    resetLoanUI: resetLoanUI,
    interestRate: interestRate,
    jumbo: jumbo,
    downpayment: downpayment,
    arm: arm, 
    setup: setup,
    updateLoanOutputs: updateLoanOutputs,
    calculatedOutputsBasedOnIR: calculatedOutputsBasedOnIR,
    calculatedOutputs: calculatedOutputs,
    $loanOutputEls: $loanOutputEls,
    $loanInputEls: $loanInputEls,
    $loanInputRows: $loanInputRows,
    loanSelectInputs: loanSelectInputs,
    loanTextInputs: loanTextInputs,
    loanRadioInputs: loanRadioInputs,
    formatOutput: formatOutput
};