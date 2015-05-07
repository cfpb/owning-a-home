// UI helpers
var $ = jQuery = require('jquery');
var formatUSD = require('format-usd');

var utils = {};

utils.toggleEl = function($el, show) {
    if (show) {
        $el.removeClass('hidden');
    } else {
        $el.addClass('hidden');
    }
}

utils.toggleMsg = function($msgEl, msg) {
    var $textEl = $msgEl.find('.msg-text');
    if (msg) {
        $textEl.text(msg);
        $msgEl.removeClass('hidden');
    } else {
        $textEl.text('');
        $msgEl.addClass('hidden');
    }
}

// Update the value of an input.
utils.updateInput = function($el, val, type) {
    if (type === 'radio') {
        $el.find('input[value="' + val + '"]').prop("checked",true);
    } else {
        $el.val(val);
    }
}

// Update a set of inputs.
utils.updateInputs = function ($inputs, propObj) {
    $.each($inputs, function (prop, $input){
        var val = propObj[prop];
        var type = prop === 'points' ? 'radio' : '';
        if (['price', 'downpayment'].indexOf(prop) !== -1) {
            val = formatUSD(val, {decimalPlaces: 0}).split('$')[1];
        }
        utils.updateInput($input, val, type);
    });
}


utils.resetSelect = function ($select, opts) {
    $select.empty();
    utils.setSelectOptions($select, opts);
}

// TODO: this might exist in dropdown module
utils.setSelectOptions = function ($select, options) {
    $.each(options, function(ind, option) {
      var opt = $("<option></option>")
                  .attr("value", option.val)
                  .text(option.text);
      if (option.selected) {
          opt.attr('selected', 'selected');
      }
      $select.append(opt);
    });
}

utils.disableDropdown = function () {
    
}

utils.cacheElements = function (propArr, transform, opts) {
    var obj = {};
    $.each(propArr, function (ind, prop) {
        var el = transform(prop, opts);
        obj[prop] = $(el);
    })
    return obj;
};

module.exports = utils;