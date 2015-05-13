var React = require('react');
var LoanActions = require('../actions/loan-actions');

var InterestRateInput = React.createClass({
    handleChange: function (e) {
        LoanActions.update(this.props.loan.id, this.props.prop, e.target.value);
    },
    fetchRates: function (e) {
        LoanActions.fetchRates(this.props.loan.id);
    },
    render: function() {
        var loan = this.props.loan;
        var className = 'interest-rate-container';
        if (loan['rate-request']) {
            className += ' updating';
        } else if (loan['edited']) {
            className += ' update';
        }
        var options;
        if (this.props.loan.rates) {
            var scenario = this.props.scenario;
            var options = this.props.loan.rates.map(function (rate) {
                var disabled;
                if (scenario && rate !== loan['interest-rate']) {
                    disabled = true;
                }
                return (
                    <option disabled={disabled} value={rate}>{rate + '%'}</option>
                );
            });
        }
        return (
            <div className={className}>
                <div className='select-content interest-rate-content'>
                    <select name='interest-rate-select' 
                            className='recalc' 
                            onChange={this.handleChange}
                            value={loan[this.props.prop]}>
                        {options}
                    </select>
                </div>
                <button className='btn btn__primary interest-rate-update' onClick={this.fetchRates}>
                    Update rates and costs
                </button>
                <div className='btn btn__disabled interest-rate-loading'></div>
            </div>
        );
    }
});

module.exports = InterestRateInput;