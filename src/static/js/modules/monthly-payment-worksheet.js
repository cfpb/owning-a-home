var React = require('react');
var ReactDOM = require('react-dom');
var assign = require('object-assign');

var StickyContainer = require('react-sticky').StickyContainer;

var $ = require('jquery');
var jQuery = $;

require('jquery.scrollto');

var ResponsiveSticky = require('./react-components/responsive-sticky.jsx');
var WorksheetOutput = require('./monthly-payment-worksheet/worksheet-output.jsx');
var WorksheetRange = require('./monthly-payment-worksheet/worksheet-range.jsx');
var MPWInputRow = require('./monthly-payment-worksheet/input-row.jsx');
var MPWOutputRow = require('./monthly-payment-worksheet/output-row.jsx');
//var Slider = require('./monthly-payment-worksheet/slider.jsx');
//var Slide = require('./monthly-payment-worksheet/slide.jsx');
//<Slide max={this.state.availableHousingFunds} value={this.state.preferredPayment} onChange={this.update.bind(null, 'preferredPayment')}/>
//<Slider />
var OutputUSD = require('./react-components/output-usd.jsx');

var MPWStore = require('./monthly-payment-worksheet/flux/store.js');
var MPWActions = require('./monthly-payment-worksheet/flux/actions.js');

var MonthlyPaymentWorksheet = React.createClass({
  
    getInitialState: function() {
      MPWStore.init();
      return MPWStore.getWorksheet();
    },
    
    componentDidMount: function () {
      MPWStore.addChangeListener(this._onChange);
    },
    
    update: function (prop, val) {
      MPWActions.update(prop, val);
    },
    
    print: function () {
      window.focus();
      window.print();
    },
    
    scrollUp: function (e) {
      e.preventDefault();
      $.scrollTo( $('#estimate-section'), {
        duration: 600,
        offset: -30
      });
    },
    
    /**
     * Event handler for 'change' events coming from the Stores
     */
    _onChange: function() {
      this.setState(MPWStore.getWorksheet());
    },

    render: function() {
      return (
        <div className="monthly-payment_worksheet block">
          <section className="monthly-payment_worksheet">
            <form className="input-section">
            <StickyContainer>
              <div className="mpw-section block">
              <div className="content-l  ">
                <div className="content-l_col inputs-col">
                  <div className="form-section">
                  <div className="mpw-section_header">
                    <img src="/static/img/wallet.png"/>
                    <h2 tabIndex="0">Assess your current income, spending, and savings.</h2>
                  </div>
                    <fieldset>
                      <legend style={{maxWidth: '100%'}}>
                        <h3><span className="heading-number">1</span>What is your annual pre-tax income?</h3>
                      </legend>                      
                      <MPWInputRow title="Your annual pre-tax income" value={this.state.preTaxIncome} id="preTaxIncome" cb={this.update}/>
                      <MPWInputRow title="Your co-borrower's annual pre-tax income" value={this.state.preTaxIncomeCB} id="preTaxIncomeCB" cb={this.update} note="A co-borrower is anyone who will jointly buy the home and pay the mortgage with you, such as a spouse, domestic partner, or other family member."/>
                      <div className="block block__sub-section u-mt15">
                        <MPWOutputRow title="Total annual pre-tax income" value={this.state.preTaxIncomeTotal} rowClass="total-row"/>
                      </div>
                      <div className="content-l input-row u-mt0">
                        <div className="label-col"></div>
                        <div className="input-col">
                          <em>Your total monthly pre-tax income is <WorksheetOutput value={this.state.preTaxIncomeMonthly}/>.</em>
                        </div>
                      </div>
                    </fieldset>
                  
                    <fieldset>
                      <legend style={{maxWidth: '100%'}}>
                        <h3><span className="heading-number">2</span>What is your monthly take-home income?</h3>
                        <div className="fieldset-note">
                          <p>Your monthly take-home income is the net amount you receive after taxes and other deductions, such as automatic retirement savings and health insurance, are taken out.</p><p><em>* Check your paystub or bank statements to figure out your take-home income.</em></p>
                        </div>
                      </legend>

                      <MPWInputRow title="Your monthly take-home income" value={this.state.takeHomeIncome} id="takeHomeIncome" cb={this.update}/>
                      <MPWInputRow title="Your co-borrower's monthly take-home income" value={this.state.takeHomeIncomeCB} id="takeHomeIncomeCB" cb={this.update}/>
                      <div className="block block__sub-section u-mt15">
                        <MPWOutputRow title="Total monthly take-home income" value={this.state.takeHomeIncomeTotal} rowClass="total-row"/>
                      </div>
                   </fieldset>
                 
                   <fieldset>
                    <legend style={{maxWidth: '100%'}}>
                      <h3><span className="heading-number">3</span>How does your money get used each month?</h3>
                      <div className="fieldset-note">
                        <p>Include expenses paid by both you and your co-borrower.</p>
                      </div>
                    </legend>
                    <MPWInputRow title="Rent" value={this.state.rent} id="rent" cb={this.update}/>
                    <MPWInputRow title="Utilities" value={this.state.utilities} id="utilities" cb={this.update} note="Electricity, gas, water, phone, internet, etc."/>
                    <MPWInputRow title="Debt Payments" value={this.state.debtPayments} id="debtPayments" cb={this.update} note="Student loans, car loans, credit card debt, etc."/>
                    <MPWInputRow title="Living and other expenses" value={this.state.livingExpenses} id="livingExpenses" cb={this.update} note="Groceries, transportation, child care, child support, eating out, health, entertainment, etc."/>
                    <MPWInputRow title="Monthly savings" value={this.state.savings} id="savings" cb={this.update} note="Amount you put away each month from your take-home income."/>
                    <div className="block block__sub-section u-mt15">
                      <MPWOutputRow title="Total monthly spending and savings" value={this.state.spendingAndSavings} note="Your total monthly spending and savings should be no more than your total monthly take-home income." rowClass="total-row"/>
                    </div>
                   </fieldset>
                </div>
                <div className="form-section">
                  <div className="mpw-section_header">
                    <img src="/static/img/calculator.png"/>
                    <h2 tabIndex="0">Estimate your financial responsibilities after buying a home.</h2>
                  </div>
                  
                  <fieldset>
                    <legend style={{maxWidth: '100%'}}>
                      <h3><span className="heading-number">4</span>What new expenses will you have after buying a home?</h3>
                      <div className="fieldset-note">
                        <p>There are more costs to being a homeowner than just the monthly mortgage payment. Estimate these homeownership expenses on a monthly basis.</p>
                      </div>
                    </legend>
                    
                    <MPWInputRow title="Home maintenance" value={this.state.homeMaintenance} id="homeMaintenance" cb={this.update} note="A common rule of thumb is 1% of your target home price (divide by 12 to get a monthly amount)."/>
                    <MPWInputRow title="Condo/Home Owners' Association (HOA) fees" value={this.state.condoHOA} id="condoHOA" cb={this.update} note="These fees depend on the specific home you choose and can range from nothing to several hundreds of dollars. Explore listings in your target neighborhoods to make an estimate."/>
                    <div className="block block__sub-section u-mt15">
                      <MPWOutputRow title="Total new homeownership expenses" value={this.state.newHomeownershipExpenses} rowClass="total-row"/>
                    </div>
                  </fieldset>
                  
                  <fieldset>
                    <legend style={{maxWidth: '100%'}}>
                      <h3><span className="heading-number">5</span>How will your expenses change as a homeowner?</h3>
                      <div className="fieldset-note">
                        <p>If some of your utilities are included in your rent now, you'll likely have to pay for them separately as a homeowner. Utilities may also increase with a larger home.</p>
                      </div>
                    </legend>
                    
                    <MPWInputRow title="Total future monthly utilities" value={this.state.futureUtilities} id="futureUtilities" cb={this.update}/>
                  </fieldset>
                  
                  <fieldset>
                    <legend style={{maxWidth: '100%'}}>
                      <h3><span className="heading-number">6</span>How much do you want to save each month?</h3>
                      <div className="fieldset-note">
                        <p>Your savings goals as a homeowner may be different than your current goals.</p>
                      </div>
                    </legend>
                    
                    <MPWInputRow title="Future monthly savings" value={this.state.futureSavings} id="futureSavings" cb={this.update} note="Enter the amount you want to put away each month from your take-home income."/>
                    
                  </fieldset>
                  
                  <fieldset>
                    <legend style={{maxWidth: '100%'}}>
                      <h3><span className="heading-number">7</span>What will taxes and insurance cost?</h3>
                      <div className="fieldset-note">
                        <p>Property taxes and homeowner's insurance are an important part of your monthly payment. Update these assumptions as you move forward to get more precise estimates.</p>
                      </div>
                    </legend>
                    
                    <MPWInputRow title="Annual property tax rate (%)" value={this.state.propertyTax} id="propertyTax" cb={this.update} note="The national median is 1.1%, but rates vary widely by location. Check with your local tax authority for a more precise estimate." type="percent"/>
                    <MPWInputRow title="Annual homeowner's insurance ($)" value={this.state.homeownersInsurance} id="homeownersInsurance" cb={this.update} note="The national median is $750, but rates vary by location, the value and features of your home, and the coverage that you select."/>
                    
                  </fieldset>
                  
                  <fieldset>
                    <legend style={{maxWidth: '100%'}}>
                      <h3><span className="heading-number">8</span>What is your expected interest rate?</h3>
                      <div className="fieldset-note">
                        <p>The interest rate you expect to receive is a key factor that affects how much you can afford to spend on a home.</p>
                      </div>
                    </legend>
                    
                    <MPWInputRow title="Expected interest rate (%)" value={this.state.interestRate} id="interestRate" cb={this.update} note="<a href=''>Explore the range of interest rates you can expect</a>" type="percent"/>
                  </fieldset>
                  </div>
                </div>
                
                <div className="content-l_col outputs-col">
                  <ResponsiveSticky>
                    <div className="block sticky-outputs">
                      <h3>Estimated totals</h3>
                      <MPWOutputRow title="Estimated funds available for monthly housing expenses" value={this.state.availableHousingFunds} placeholder="--"/>
                      <div className="content-l output-row">
                        <div className="content-l_col-1">
                          <p><label htmlFor="preferredPayment">How much of your available funds do you want to use for monthly housing expenses?</label></p>
                          <WorksheetRange max={this.state.availableHousingFunds} val={this.state.preferredPayment} onChange={this.update.bind(null, 'preferredPayment')}/>
                        </div>
                      </div>
                      <MPWOutputRow title="Estimated monthly principal and interest" value={this.state.principalAndInterest} placeholder="--"/>
                      <MPWOutputRow title="Estimated home price" value={this.state.housePrice} placeholder="--"/>
                    </div>
                  </ResponsiveSticky>
                </div>
              </div>
              </div>
              </StickyContainer>
              
            </form>
            
          </section>
          
          <section className="summary-section">
            <h2 tabIndex="0">How much can you afford?</h2>
            
            <div className="content-l  mpw-section">
              <div>
                <div className="content-l_col content-l_col-1-2 col-left summary-row">
                  <MPWOutputRow title="Estimated funds available for monthly housing expenses" value={this.state.availableHousingFunds}/>
                </div>
              </div>
            </div>
            <div className="block block__main-section block__border-strong">
              <div className="content-l  mpw-section">
            
                  <div className="content-l_col content-l_col-1-2 col-left">
                    <p>We calculated your total available for monthly housing obligations by subtracting your expenses and savings from your take-home income.</p>
                  
                    <div className="block block__sub-section">
                      <MPWOutputRow title="Take-home income" value={this.state.takeHomeIncomeTotal} className="h4"/>
                      <MPWOutputRow title="Debts" value={this.state.debtPayments} prefix="-" />
                      <MPWOutputRow title="Living expenses" value={this.state.livingExpenses} prefix="-"/>
                      <MPWOutputRow title="Future savings" value={this.state.futureSavings} prefix="-"/>
                      <MPWOutputRow title="Home maintenance" value={this.state.homeMaintenance} prefix="-"/>
                      <MPWOutputRow title="Future utilities" value={this.state.futureUtilities} prefix="-"/>
                    </div>
                    <div className="block block__sub-section">
                      <MPWOutputRow title="Estimated funds available for monthly housing expenses" value={this.state.availableHousingFunds} rowClass="total-row"/>
                    </div>
                  </div>
              
                  <div className="content-l_col content-l_col-1-2 col-right">
                    <p>How much of your available funds do you want to use for monthly housing expenses?</p>
                    <WorksheetRange max={this.state.availableHousingFunds} val={this.state.preferredPayment} onChange={this.update.bind(null, 'preferredPayment')}/>
                    <div className="block block__sub-section">
                      <MPWOutputRow title="Amount to use for housing" value={this.state.preferredPayment} labelClass="large-text" outputClass="h4 emphasis"/>
                      <MPWOutputRow title="Left over money" value={this.state.otherExpenses} labelClass="large-text" outputClass="h4 emphasis"/>
                    </div>
                    <div className="block block__sub-section">
                      <p><WorksheetOutput value={this.state.preferredPayment}  placeholder="$--" className="h4"/> is <WorksheetOutput value={this.state.preferredPaymentPercentage} placeholder="--%" type="percent" className="h4"/> of your pre-tax income of <WorksheetOutput value={this.state.preTaxIncomeMonthly}  placeholder="$--" className="h4"/></p>
                      <p className="u-mb0">A mortgage lending rule of thumb is that your total monthly housing obligations should be no more than 28% of your pre-tax income. Lenders may approve you for more or less depending on your overall financial picture.</p>
                    </div>
                </div>
              </div>
            </div>
            <div className="block block__main-section u-mt30">
              <div className="content-l  mpw-section summary-header-section">
                <div className="content-l_col content-l_col-1-2 col-left summary-row">
                  <MPWOutputRow title="Estimated monthly principal and interest" value={this.state.principalAndInterest}/>
                </div>
                <div className="content-l_col content-l_col-1-2 col-right summary-row">
                  <MPWOutputRow title="Estimated home price" value={this.state.housePrice} placeholder="--"/>
                </div>
              </div>
            </div>
            <div className="content-l  mpw-section">
              <div className="content-l_col content-l_col-1-2 col-left">
                <div className="block block__sub-section block__border-strong">
                  The <WorksheetOutput value={this.state.preferredPayment} placeholder="$--"  className="h4"/> you want to use for monthly housing expenses needs to cover your principal & interest payment, taxes and insurance, and condo/HOA fees.
                </div>
                <div className="block block__sub-section u-mt15">
                  <MPWOutputRow title="Amount you want to use for monthly housing expenses" value={this.state.preferredPayment} outputClass="h4"/>
                  <MPWOutputRow title="Condo/HOA fees" value={this.state.condoHOA} prefix="-" note="Usually not included in your mortgage payment."/>
                </div>
                <div className="block block__sub-section u-mt15">
                  <MPWOutputRow title="Estimated total monthly payment" value={this.state.estimatedMonthlyPayment} outputClass="h4"/>
                  <MPWOutputRow title="Monthly taxes and insurance" value={this.state.taxesAndInsurance} prefix="-"/>
                </div>
                <div className="block block__sub-section total-row">
                  <MPWOutputRow title="Estimated monthly principal and interest" value={this.state.principalAndInterest}/>
                </div>
              </div>
              
              <div className="content-l_col content-l_col-1-2 col-right">
                <div className="home-price__stacked summary-row">
                  <MPWOutputRow title="Estimated home price" value={this.state.housePrice} placeholder="--"/>
                </div>
                <div className="block block__sub-section block__border-strong">
                  <MPWOutputRow title="Estimated down payment" value={this.state.downpayment} placeholder="--" outputClass="h3"/>
                </div>
                <div className="block block__sub-section">
                  <MPWOutputRow title="Estimated loan amount" value={this.state.loanAmount} placeholder="--" outputClass="h3"/>
                  <p>To keep things simple at this stage, this tool calculates an estimated home price assuming that you will make a 20% down payment and that you will choose a standard, 30-year fixed mortgage.</p>
                  <p>If you put down less than 20% of your home's purchase price, you will likely have to pay for <a href="#">mortgage insurance</a>, which will increase your monthly payment. If you choose a different <a>kind of loan</a>, your monthly payment may be higher or lower.</p>
                </div>
              </div>
            </div>
            
          </section>
          <section className="print-section">
            <h2 className="indented-content" tabIndex="0">Print your information.</h2>
            <div className="block block__bg block__bg-highlight block__flush-top">
              <div className="content-l">
                <div className="content-l_col content-l_col-1-2">
                  <p>Finished filling out the worksheet? Be sure to print your work or save it as a PDF before navigating to a different page.</p>
                  <button className="btn btn__primary" onClick={this.print}>
                    Print or save as PDF
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      );
    }

});

ReactDOM.render(
  <MonthlyPaymentWorksheet/>, document.getElementById('app-container')
);


