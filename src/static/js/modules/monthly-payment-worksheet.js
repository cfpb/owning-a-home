var React = require('react');
var $ = jQuery = require('jquery');
var MonthlyPaymentWorksheet = React.createClass({
  
    getInitialState: function() {
        return {};
    },

    componentDidMount: function() {
        
    },

    componentWillUnmount: function() {
    },

    componentDidUpdate: function () {
       
    },

    render: function() {
        return (
          <div className="monthly-payment_worksheet">
            <section>
              <h2 className="indented-content">Assess your current income, spending, and savings.</h2>
              <form className="block block__bg block__flush-top block__unpadded">
                <div className="content-l form-cols">
                  <div className="content-l_col content-l_col-1-2 col-left">
                    <fieldset>
                      <legend className="h3">
                        <span className="heading-number">1</span>Monthly income
                      </legend>
                      
                      
                      <fieldset >
                        <legend className="h5">
                          Pre-tax income
                        </legend>
                        <div className="content-l input-row">
                          <div className="label-col">
                            <label htmlFor="preTaxIncome">
                              Your income
                            </label>
                          </div>
                          <div className="input-col">
                            <input type="text" id="preTaxIncome"/>
                          </div>
                        </div>
                        <div className="content-l input-row">
                          <div className="label-col">
                            <label htmlFor="preTaxIncomeCB">
                              Co-borrower's income
                            </label>
                          </div>
                          <div className="input-col">
                            <input type="text" id="preTaxIncomeCB"/>
                          </div>
                        </div>
                        <div className="total-row output-row">
                          <div className="content-l">
                            <div className="label-col">
                              <label htmlFor="preTaxIncomeTotal">
                                Total monthly pre-tax income
                              </label>
                            </div>
                            <div className="input-col">
                              <strong id="preTaxIncomeTotal">$9,000</strong>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                      
                      
                      <fieldset>
                        <legend className="h5">
                          Take-home income
                        </legend>
                        <div className="content-l input-row">
                          <div className="label-col">
                            <label htmlFor="takeHomeIncome">
                              Your income
                            </label>
                          </div>
                          <div className="input-col">
                            <input type="text" id="takeHomeIncome"/>
                          </div>
                        </div>
                        <div className="content-l input-row">
                          <div className="label-col">
                            <label htmlFor="takeHomeIncomeCB">
                              Co-borrower's income
                            </label>
                          </div>
                          <div className="input-col">
                            <input type="text" id="takeHomeIncomeCB"/>
                          </div>
                        </div>
                        <div className="total-row output-row">
                          <div className="content-l">
                            <div className="label-col">
                              <label htmlFor="takeHomeIncomeTotal">
                                Total monthly take-home income
                              </label>
                            </div>
                            <div className="input-col">
                              <strong id="takeHomeIncomeTotal">$6,500</strong>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </fieldset>
                  </div>
                  <div className="content-l_col content-l_col__before-divider content-l_col-1-2 col-right">
                    <fieldset>
                      <legend className="h3">
                        <span className="heading-number">2</span>Monthly spending and savings
                      </legend>
                      
                      <div className="content-l input-row">
                        <div className="label-col">
                          <label htmlFor="rent">
                            Rent
                          </label>
                        </div>
                        <div className="input-col">
                          <input type="text" id="rent"/>
                        </div>
                      </div>
                      <div className="content-l input-row">
                        <div className="label-col">
                          <label htmlFor="utilities">
                            Utilities
                          </label>
                        </div>
                        <div className="input-col">
                          <input type="text" id="utilities"/>
                        </div>
                        <div className="content-l_col content-l_col-1">
                          <em>Electricity, gas, water, phone, internet, etc.</em>
                        </div>
                      </div>
                      <div className="total-row output-row">
                        <div className="content-l">
                          <div className="label-col">
                            <label htmlFor="spendingAndSavingsTotal">
                              Total monthly spending and savings
                            </label>
                          </div>
                          <div className="input-col">
                            <strong id="spendingAndSavingsTotal">$6,300</strong>
                          </div>
                          <div className="content-l_col content-l_col-1">
                            <em>Your total monthly spending and savings should be no more than your total monthly take-home income.</em>
                          </div>
                        </div>
                      </div>
                      
                    </fieldset>
                  </div>
                </div>
              </form>
            </section>
            <section>
              <h2 className="indented-content">Estimate your financial responsibilities after buying a home.</h2>
              <form className="block block__bg block__flush-top block__unpadded">
                <div className="content-l form-cols">
                  <div className="content-l_col content-l_col-1-2 col-left">
                    <fieldset>
                      <legend className="h3">
                        <span className="heading-number">3</span>Future monthly savings goals
                      </legend>
                    </fieldset>
                    <fieldset>
                      <legend className="h3">
                        <span className="heading-number">4</span>New homeownership expenses
                      </legend>
                    </fieldset>
                  </div>
                  <div className="content-l_col content-l_col__before-divider content-l_col-1-2 col-right">
                    <fieldset>
                      <legend className="h3">
                        <span className="heading-number">5</span>Changed monthly expenses
                      </legend>
                    </fieldset>
                    <fieldset>
                      <legend className="h3">
                        <span className="heading-number">6</span>Property taxes and homeowner's insurance
                      </legend>
                    </fieldset>
                  </div>
                </div>
              </form>
            </section>
            <section>
              <h2 className="indented-content">How much can you afford?</h2>
              <div className="block block__bg block__flush-top block__bg-highlight block__flush-bottom">
                <div className="content-l">
                  <div className="content-l_col content-l_col-2-3">
                    <h3>Based on your income and estimated expenses, you have <strong>$1,900</strong> available for monthly housing obligations. This is <strong>29%</strong> of your pre-tax income.</h3>
                    <p className="u-mb0">A mortgage lending rule of thumb is that your total monthly housing obligations should be no more than 28% of your pre-tax income. Lenders may approve you for more or less depending on your overall financial picture. To change this percentage, <a>scroll back up</a> and consider whether you have budgeted enough for new homeownership expenses and savings.</p>
                  </div>
                </div>
              </div>
              <div className="block block__bg block__flush-top block__unpadded monthly-payment_summary">
                <div className="content-l form-cols">
                  <div className="content-l_col content-l_col-1-2 col-left">
                    <h3>Your homeownership budget</h3>
                    <p>We calculated your total available for monthly housing obligations by subtracting your expenses and savings from your take-home income.</p>
                    <div className="content-l output-row">
                      <div className="label-col">
                        <label htmlFor="summaryTakeHomeIncome">Take-home income</label>
                      </div>
                      <div className="input-col">
                        <strong id="summaryTakeHomeIncome">$6,500</strong>
                      </div>
                    </div>
                    <div className="content-l output-row">
                      <div className="label-col">
                        <label htmlFor="summaryDebts">Debts</label>
                      </div>
                      <div className="input-col">
                        <span id="summaryDebts">-$1,000</span>
                      </div>
                    </div>
                    
                    <div className="total-row output-row">
                      <div className="content-l">
                        <div className="label-col">
                          <label htmlFor="summaryTotal">
                            Total available for monthly housing obligations
                          </label>
                        </div>
                        <div className="input-col">
                          <strong id="summaryTotal">$1,900</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-l_col content-l_col__before-divider content-l_col-1-2 col-right">
                    <h3>What's included in your total monthly housing obligations?</h3>
                    <p>The <strong>$1900</strong> you have available for monthly housing obligations needs to cover your principal & interest payment, taxes and insurance, and condo/HOA fees.</p>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <h2 className="indented-content">Print your information.</h2>
              <div className="block block__bg block__bg-highlight block__flush-top">
                <div className="content-l">
                  <div className="content-l_col content-l_col-1-2">
                    <p>Finished filling out the worksheet? Be sure to print your work or save it as a PDF before navigating to a different page.</p>
                    <button className="btn btn__primary">
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

React.render(
  <MonthlyPaymentWorksheet/>, document.getElementById('app-container')
);