var React = require('react');
var mortgageCalculations = require('../mortgage-calculations');
var debounce = require('debounce');
var LoanActions = require('../actions/loan-actions');
var ErrorMessage = require('./error-message');

var LoanDownpaymentInput = React.createClass({
    getInitialState: function () {
        return {
            downpayment: this.props.loan['downpayment'],
            downpaymentPercent: this.props.loan['downpayment-percent']
        };
    },
    componentWillMount: function() {
      var self = this;
      this.handleChangeDebounced = debounce(function () {
          var changed = self.state.changed;
          LoanActions.update(self.props.loan.id, changed, self.state[changed]);
      }, 500);
    },
    handleChange: function (prop, e) {
        var changes = {changed: prop};
        changes[prop] = e.target.value;
        this.setState(changes);
        this.handleChangeDebounced();
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            changed: null,
            downpayment: nextProps.loan['downpayment'],
            downpaymentPercent: nextProps.loan['downpayment-percent']
        });
    },
    showError: function() {
        var loan = this.props.loan;
        if (loan['downpayment-too-high']) {
            return 'downpayment-too-high';
        } else if (loan['downpayment-too-low']) {
            return 'downpayment-too-low-' + loan['loan-type'].split('-')[0];
        }
        return false;
    },
    render: function() {
      var loan = this.props.loan;
      return (
        <div>
            <div className="percent-input small-input">
                <span className="unit">%</span>
                <input type="text" 
                       placeholder="10" 
                       maxLength="2" 
                       name="input-downpayment-percent-0"   
                       id="input-downpayment-percent-0" 
                       className="recalc"
                       value={this.state.downpaymentPercent}
                       onChange={this.handleChange.bind(this, 'downpayment-percent')}/>
            </div>
            <label htmlFor="input-downpayment-percent-0" className="u-visually-hidden">
                Down payment amount
            </label>
            <div className="mid-input">
                <input type="text" 
                       placeholder="$20,000" 
                       name="input-downpayment-0" 
                       id="input-downpayment-0" 
                       className="recalc"
                       ref="downpayment"
                       value={this.state.downpayment}
                       onChange={this.handleChange.bind(this, 'downpayment')}/>
            </div>
            <ErrorMessage opts={{showMessage: this.showError}}/>
         </div>
        );
    }
});

module.exports = LoanDownpaymentInput;