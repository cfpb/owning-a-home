function getJumboLoanType( opts ) {

  opts = opts || {};

  var amount = opts.loanAmount || 0,
      type = opts.loanType || undefined,
      limits = {};

  // Each loan type has a standard limit and may optionally have a lower
  // one based on the relevant county.
  limits.gse = {
    default: 417000,
    county: opts.gseCountyLimit || undefined
  };
  limits.fha = {
    default: 271050,
    county: opts.fhaCountyLimit || undefined
  };
  limits.va = {
    default: 417000,
    county: opts.vaCountyLimit || undefined
  };

  switch ( type ) {
    case 'conf':
      return processConfLoan( amount, limits );
    case 'fha':
      return processFHALoan( amount, limits );
    case 'va':
      return processVALoan( amount, limits );
    default:
      return fail();
  }

}

function processConfLoan( amount, limits ) {
  if ( amount >= limits.gse.default ) {
    if ( !limits.gse.county ) {
      return fail('county');
    }
    if ( amount <= limits.gse.county ) {
      return success('agency', 'When you borrow between ' + limits.gse.default + ' and ' + limits.gse.county + ' in your county, you are eligible for a conforming jumbo loan.');
    }
    if ( amount > limits.gse.county ) {
      return success('jumbo', 'When you borrow more than ' + limits.gse.county + ' in your county, the only loan type available to you is a jumbo (non-conforming) loan.');
    }
  }
  // It ain't jumbo
  return success();
}

function processFHALoan( amount, limits ) {
  if ( amount >= limits.fha.default ) {
    if ( !limits.gse.county || !limits.fha.county ) {
      return fail('county');
    }
    if ( amount <= limits.fha.county ) {
      return success('fha-hb', 'When you borrow between ' + limits.fha.default + ' and ' + limits.fha.county + ' in your county, you are eligible for a high-balance FHA loan.');
    }
    if ( amount > limits.fha.county && amount <= limits.gse.default ) {
      return success('conf', 'You are not eligible for an FHA loan when you borrow more than ' + limits.fha.county + ' in your county. You are eligible for a conventional loan.');
    }
    if ( amount > limits.gse.default && amount <= limits.gse.county ) {
      return success('agency', 'You are not eligible for an FHA loan when you borrow more than ' + limits.fha.county + ' in your county. You are eligible for a conforming jumbo loan.');
    }
    if ( amount > limits.gse.default && amount > limits.gse.county ) {
      return success('jumbo', 'You are not eligible for an FHA loan when you borrow more than ' + limits.fha.county + ' in your county. The only loan type available to you at this loan amount is a jumbo (non-conforming) loan.');
    }
  }
  // It ain't jumbo
  return success();
}

function processVALoan( amount, limits ) {
  if ( amount >= limits.va.default ) {
    if ( !limits.gse.county || !limits.va.county ) {
      return fail('county');
    }
    if ( amount <= limits.va.county ) {
      return success('va-hb', 'When you borrow between ' + limits.va.default + ' and ' + limits.va.county + ' your county, you may be eligible for a high-balance VA loan.');
    }
    if ( amount > limits.va.county && amount < limits.gse.county ) {
      return success('agency', 'While VA loans do not have strict loan limits, most lenders are unlikely to make a VA loan more than ' + limits.va.county + ' in your county. Your only option may be a conforming jumbo loan.');
    }
    if ( amount > limits.gse.county ) {
      return success('jumbo', 'While VA loans do not have strict loan limits, most lenders are unlikely to make a VA loan more than ' + limits.va.county + ' in your county. Your only option may be a jumbo (non-conforming) loan.');
    }
  }
  // It ain't jumbo
  return success();
}

function success( type, msg ) {

  if ( type ) {
    return {
      success: true,
      isJumbo: true,
      type: type,
      msg: msg || undefined
    };
  }

  // If no loan type is provided, to indicate that it's not a jumbo 
  // loan and nothing needs to be changed.
  return {
    success: true,
    isJumbo: false
  };

}

function fail( status ) {

  if ( status === 'county' ) {
    return {
      success: false,
      needCounty: true,
      msg: 'Please provide county limits.'
    };
  }

  return {
    success: false,
    msg: 'Unknown loan type.'
  };

}

module.exports = getJumboLoanType;
