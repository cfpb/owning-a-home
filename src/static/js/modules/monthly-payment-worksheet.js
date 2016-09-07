var React = require( 'react' );
var $ = jQuery = require( 'jquery' );
require( 'jquery.scrollto' );

var InputUSD = require( './react-components/input-usd.jsx' );
var InputPercentage = require( './react-components/input-percent.jsx' );
var WorksheetOutput = require( './monthly-payment-worksheet/worksheet-output.jsx' );

var MonthlyPaymentWorksheet = React.createClass( {

    getInitialState: function() {
      return {
        worksheet: this.props.worksheet
      }
    },

    update: function( prop, val ) {
        var worksheet = this.state.worksheet;
        worksheet[prop] = val || 0;
        this.setState({worksheet: worksheet});
    },

    print: function () {
        window.focus();
        window.print();
    },

    scrollUp: function( evt ) {
        evt.preventDefault();
        $.scrollTo( $( '#estimate-section' ), {
          duration: 600,
          offset:   -30
        });
    },

    render: function() {
        var worksheet = this.state.worksheet || {};
        return (
          <div className="monthly-payment_worksheet">
            <section>
              <h2 className="indented-content" tabIndex="0">Assess your current income, spending, and savings.</h2>
              <form className="block block__bg block__flush-top block__unpadded">
                <div className="content-l form-cols">
                  <div className="content-l_col content-l_col-1-2 col-left">
                    <fieldset>
                      <legend className="h3">
                        <span className="heading-number">1</span>Monthly income
                      </legend>


                      <fieldset>
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
                            <InputUSD id="preTaxIncome" value={worksheet.preTaxIncome} onChange={this.update.bind(null, 'preTaxIncome')}/>
                          </div>
                        </div>
                        <div className="content-l input-row">
                          <div className="label-col">
                            <label htmlFor="preTaxIncomeCB">
                              Co-borrower's income
                            </label>
                          </div>
                          <div className="input-col">
                            <InputUSD id="preTaxIncome" value={worksheet.preTaxIncomeCB} onChange={this.update.bind(null, 'preTaxIncomeCB')}/>
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
                              <WorksheetOutput prop="preTaxIncomeTotal" data={worksheet}/>
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
                            <InputUSD id="takeHomeIncome" value={worksheet.takeHomeIncome} onChange={this.update.bind(null, 'takeHomeIncome')}/>

                          </div>
                        </div>
                        <div className="content-l input-row">
                          <div className="label-col">
                            <label htmlFor="takeHomeIncomeCB">
                              Co-borrower's income
                            </label>
                          </div>
                          <div className="input-col">
                            <InputUSD id="takeHomeIncomeCB" value={worksheet.takeHomeIncomeCB} onChange={this.update.bind(null, 'takeHomeIncomeCB')}/>
                          </div>
                        </div>
                        <div className="total-row output-row">
                          <div className="content-l">
                            <div className="label-col">
                              <div className="label">
                                Total monthly take-home income
                              </div>
                            </div>
                            <div className="input-col">
                              <WorksheetOutput prop="takeHomeIncomeTotal" data={worksheet}/>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </fieldset>
                  </div>
                  <div className="content-l_col content-l_col__before-divider content-l_col-1-2 col-right savings-section">
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
                          <InputUSD id="rent" value={worksheet.rent} onChange={this.update.bind(null, 'rent')}/>

                        </div>
                      </div>
                      <div className="content-l input-row">
                        <div className="label-col">
                          <label htmlFor="utilities">
                            Utilities
                          </label>
                        </div>
                        <div className="input-col">
                          <InputUSD id="utilities" value={worksheet.utilities} onChange={this.update.bind(null, 'utilities')}/>
                        </div>
                        <div className="content-l_col content-l_col-1  note-row">
                          <em>Electricity, gas, water, phone, internet, etc.</em>
                        </div>
                      </div>
                      <div className="content-l input-row">
                        <div className="label-col">
                          <label htmlFor="debtPayments">
                            Debt payments
                          </label>
                        </div>
                        <div className="input-col">
                          <InputUSD id="debtPayments" value={worksheet.debtPayments} onChange={this.update.bind(null, 'debtPayments')}/>
                        </div>
                        <div className="content-l_col content-l_col-1 note-row">
                          <em>Student loans, car loans, credit card debt, etc.</em>
                        </div>
                      </div>
                      <div className="content-l input-row">
                        <div className="label-col">
                          <label htmlFor="livingExpenses">
                            Living and other expenses
                          </label>
                        </div>
                        <div className="input-col">
                          <InputUSD id="livingExpenses" value={worksheet.livingExpenses} onChange={this.update.bind(null, 'livingExpenses')}/>
                        </div>
                        <div className="content-l_col content-l_col-1 note-row">
                          <em>Groceries, transportation, child care, child support, eating out, health, entertainment, etc.</em>
                        </div>
                      </div>
                      <div className="content-l input-row">
                        <div className="label-col">
                          <label htmlFor="savings">
                            Savings
                          </label>
                        </div>
                        <div className="input-col">
                          <InputUSD id="savings" value={worksheet.savings} onChange={this.update.bind(null, 'savings')}/>             
                        </div>
                        <div className="content-l_col content-l_col-1 note-row">
                          <em>Amount you put away each month from your take-home income.</em>
                        </div>
                      </div>

                      <div className="total-row output-row">
                        <div className="content-l">
                          <div className="label-col">
                            <div className="label">
                              Total monthly spending and savings
                            </div>
                          </div>
                          <div className="input-col">
                            <WorksheetOutput prop="spendingAndSavings" data={worksheet}/>

                          </div>
                          <div className="content-l_col content-l_col-1  note-row">
                            <em>Your total monthly spending and savings should be no more than your total monthly take-home income.</em>
                          </div>
                        </div>
                      </div>

                    </fieldset>
                  </div>
                </div>
              </form>
            </section>
            <section className="estimate-section" id="estimate-section">
              <h2 className="indented-content" tabIndex="0">Estimate your financial responsibilities after buying a home.</h2>
              <form className="block block__bg block__flush-top block__unpadded">
                <div className="content-l form-cols">
                  <div className="content-l_col content-l_col-1-2 col-left">
                    <fieldset className="form-section-3">
                      <legend className="h3">
                        <span className="heading-number">3</span>Future monthly savings goals
                      </legend>
                      <p>Your savings goals as a homeowner may be different than your current goals. Enter the amount you want to put away each month from your take-home income.</p>
                      <div className="content-l input-row">
                        <div className="label-col">
                          <label htmlFor="emergencySavings">
                            Emergency savings
                          </label>
                        </div>
                        <div className="input-col">
                          <InputUSD id="emergencySavings" value={worksheet.emergencySavings} onChange={this.update.bind(null, 'emergencySavings')}/>
                        </div>
                        <div className="content-l_col content-l_col-1 note-row">
                          <em>A good rule of thumb is to have at least 3-6 months of expenses saved.</em>
                        </div>
                      </div>
                      <div className="content-l input-row">
                        <div className="label-col">
                          <label htmlFor="longTermSavings">
                            Long-term savings
                          </label>
                        </div>
                        <div className="input-col">
                          <InputUSD id="longTermSavings" value={worksheet.longTermSavings} onChange={this.update.bind(null, 'longTermSavings')}/>
                        </div>
                        <div className="content-l_col content-l_col-1 note-row">
                          <em>Savings for retirement, kids' college, vacations, or other goals.</em>
                        </div>
                      </div>
                      <div className="total-row output-row">
                        <div className="content-l">
                          <div className="label-col">
                            <div className="label">
                              Total future monthly savings goals
                            </div>
                          </div>
                          <div className="input-col">
                            <WorksheetOutput prop="futureSavings" data={worksheet}/>
                          </div>
                        </div>
                      </div>

                    </fieldset>
                    <fieldset>
                      <legend className="h3">
                        <span className="heading-number">4</span>New homeownership expenses
                      </legend>
                      <p>There are more costs to being a homeowner than just the monthly mortgage payment. Estimate these homeownership expenses on a monthly basis.</p>
                      <div className="content-l input-row">
                        <div className="label-col">
                          <label htmlFor="homeMaintenance">
                            Home maintenance
                          </label>
                        </div>
                        <div className="input-col">
                          <InputUSD id="homeMaintenance" value={worksheet.homeMaintenance} onChange={this.update.bind(null, 'homeMaintenance')}/>
                        </div>
                        <div className="content-l_col content-l_col-1 note-row">
                          <em>A common rule of thumb is 1% of your target home price (divide by 12 to get a monthly amount).</em>
                        </div>
                      </div>
                      <div className="content-l input-row">
                        <div className="label-col">
                          <label htmlFor="homeImprovement">
                            Home improvement
                          </label>
                        </div>
                        <div className="input-col">
                          <InputUSD id="homeImprovement" value={worksheet.homeImprovement} onChange={this.update.bind(null, 'homeImprovement')}/>
                        </div>
                        <div className="content-l_col content-l_col-1 note-row">
                          <em>This is up to you. What kinds of improvements do you plan to make? How much do you want to set aside monthly?</em>
                        </div>
                      </div>
                      <div className="content-l input-row">
                        <div className="label-col">
                          <label htmlFor="condoHOA">
                            Condo/HOA fees
                          </label>
                        </div>
                        <div className="input-col">
                          <InputUSD id="condoHOA" value={worksheet.condoHOA} onChange={this.update.bind(null, 'condoHOA')}/>
                        </div>
                        <div className="content-l_col content-l_col-1 note-row">
                          <em>These fees can vary widely depending on the specific building or HOA. Explore listings in your target neighborhoods to make an estimate.</em>
                        </div>
                      </div>
                      <div className="total-row output-row">
                        <div className="content-l">
                          <div className="label-col">
                            <div className="label">
                              Total new homeownership expenses
                            </div>
                          </div>
                          <div className="input-col">
                            <WorksheetOutput prop="newHomeownershipExpenses" data={worksheet}/>
                          </div>
                        </div>
                      </div>

                    </fieldset>
                  </div>
                  <div className="content-l_col content-l_col__before-divider content-l_col-1-2 col-right">
                    <fieldset>
                      <legend className="h3">
                        <span className="heading-number">5</span>Changed monthly expenses
                      </legend>
                      <p>Estimate the total monthly utilities you will pay as a homeowner. If some of your utilities are included in your rent now, you'll likely have to pay for them separately as a homeowner. Utilities may also increase with a larger home.</p>
                      <div className="content-l input-row">
                        <div className="label-col">
                          <label htmlFor="futureUtilities">
                            Future utilities
                          </label>
                        </div>
                        <div className="input-col">
                          <InputUSD id="futureUtilities" value={worksheet.futureUtilities} onChange={this.update.bind(null, 'futureUtilities')}/>
                        </div>
                      </div>
                    </fieldset>
                    <fieldset>
                      <legend className="h3">
                        <span className="heading-number">6</span>Property taxes and homeowner's insurance
                      </legend>
                      <p>Property taxes and homeowner's insurance are an important part of your monthly payment. Update these assumptions as you move forward to more precisely estimate your affordable monthly payment.</p>
                      <div className="content-l input-row">
                        <div className="label-col">
                          <label htmlFor="homePrice">
                            Home value
                          </label>
                        </div>
                        <div className="input-col">
                          <InputUSD id="homePrice" value={worksheet.homePrice} onChange={this.update.bind(null, 'homePrice')}/>
                        </div>
                        <div className="content-l_col content-l_col-1 note-row">
                          <em>Property taxes are based on the assessed value of a home, which may be different from the home price. But, the typical home price in your target neighborhood is a good rough estimate.</em>
                        </div>
                      </div>
                      <div className="content-l input-row">
                        <div className="label-col">
                          <label htmlFor="propertyTax">
                            Property tax rate (annual)
                          </label>
                        </div>
                        <div className="input-col">
                          <InputPercentage id="propertyTax" value={worksheet.propertyTax} onChange={this.update.bind(null, 'propertyTax')}/>
                        </div>
                        <div className="content-l_col content-l_col-1 note-row">
                          <em>The national median is 1.1%, but rates vary widely by location. Check with your local tax authority for a more precise estimate.</em>
                        </div>
                      </div>
                      <div className="content-l input-row">
                        <div className="label-col">
                          <label htmlFor="homeownersInsurance">
                            Annual homeowner's insurance
                          </label>
                        </div>
                        <div className="input-col">
                          <InputUSD id="homeownersInsurance" value={worksheet.homeownersInsurance} onChange={this.update.bind(null, 'homeownersInsurance')}/>
                        </div>
                        <div className="content-l_col content-l_col-1 note-row">
                          <em>The national median is $750, but rates vary by location, the value and features of your home, and the coverage that you select.</em>
                        </div>
                      </div>
                      <div className="content-l input-row sources-note">
                        <div className="content-l_col content-l_col-1">
                          <div className="label">Wondering where we got our data?</div>
                          <p><a href="/owning-a-home/process/sources/">Check out our sources</a></p>
                        </div>
                      </div>

                    </fieldset>
                  </div>
                </div>
              </form>
            </section>
            <section className="summary-section">
              <h2 className="indented-content" tabIndex="0">How much can you afford?</h2>
              <div className="block block__bg block__flush-top block__bg-highlight block__flush-bottom">
                <div className="content-l">
                  <div className="content-l_col content-l_col-2-3">
                    <h3>Based on your monthly income and estimated expenses, you have <strong><WorksheetOutput prop="availableHousingFunds" data={worksheet}/></strong> available for monthly housing obligations. This is <strong><WorksheetOutput prop="percentageIncomeAvailable" data={worksheet}/></strong> of your pre-tax income.</h3>
                    <p className="u-mb0">A mortgage lending rule of thumb is that your total monthly housing obligations should be no more than 28% of your pre-tax income. Lenders may approve you for more or less depending on your overall financial picture. To change this percentage, <a href="#estimate-section" onClick={this.scrollUp}>scroll back up</a> and consider whether you have budgeted enough for new homeownership expenses and savings.</p>
                  </div>
                </div>
              </div>
              <div className="block block__bg block__flush-top block__unpadded monthly-payment_summary">
                <div className="content-l form-cols">
                  <div className="content-l_col content-l_col-1-2 col-left budget-col">
                    <h3>Your homeownership budget</h3>
                    <p>We calculated your total available for monthly housing obligations by subtracting your expenses and savings from your take-home income.</p>
                    <div className="content-l output-row">
                      <div className="label-col">
                        <div className="label">Take-home income</div>
                      </div>
                      <div className="input-col">
                        <strong><WorksheetOutput prop="takeHomeIncomeTotal" data={worksheet}/></strong>
                      </div>
                    </div>
                    <div className="content-l output-row">
                      <div className="label-col">
                        <div className="label">Debts</div>
                      </div>
                      <div className="input-col">
                        <span id="summaryDebts">
                          - <WorksheetOutput prop="debtPayments" data={worksheet}/>
                        </span>
                      </div>
                    </div>
                    <div className="content-l output-row">
                      <div className="label-col">
                        <div className="label">Living expenses</div>
                      </div>
                      <div className="input-col">
                        <span id="summaryLivingExpenses">
                          - <WorksheetOutput prop="livingExpenses" data={worksheet}/>
                        </span>
                      </div>
                    </div>
                    <div className="content-l output-row">
                      <div className="label-col">
                        <div className="label">Future savings</div>
                      </div>
                      <div className="input-col">
                        - <WorksheetOutput prop="futureSavings" data={worksheet}/>
                      </div>
                    </div>
                    <div className="content-l output-row">
                      <div className="label-col">
                        <div className="label">Home maintenance and improvement</div>
                      </div>
                      <div className="input-col">
                        - <WorksheetOutput prop="homeMaintenanceAndImprovement" data={worksheet}/>
                      </div>
                    </div>
                    <div className="content-l output-row">
                      <div className="label-col">
                        <div className="label">Future utilities</div>
                      </div>
                      <div className="input-col">
                        - <WorksheetOutput prop="futureUtilities" data={worksheet}/>
                      </div>
                    </div>
                    <div className="total-row output-row summary-row">
                      <div className="content-l">
                        <div className="label-col">
                          <div className="label">
                            Total available for monthly housing obligations
                          </div>
                        </div>
                        <div className="input-col">
                          <WorksheetOutput prop="availableHousingFunds" data={worksheet}/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-l_col content-l_col__before-divider content-l_col-1-2 col-right breakdown-col">
                    <h3>What's included in your total monthly housing obligations?</h3>
                    <p>The <strong><WorksheetOutput prop="availableHousingFunds" data={worksheet}/></strong> you have available for monthly housing obligations needs to cover your principal & interest payment, taxes and insurance, and condo/HOA fees.</p>
                    <div className="content-l output-row">
                      <div className="label-col">
                        <div className="label">Total available for monthly housing obligations</div>
                      </div>
                      <div className="input-col">
                        <strong><WorksheetOutput prop="availableHousingFunds" data={worksheet}/></strong>
                      </div>
                    </div>
                    <div className="content-l output-row">
                      <div className="label-col">
                        <div className="label">
                          Condo/HOA fees
                        </div>
                      </div>
                      <div className="input-col">
                        - <WorksheetOutput prop="condoHOA" data={worksheet}/>
                      </div>
                      <div className="content-l_col content-l_col-1 note-row">
                        <em>Usually not included in your mortgage payment.</em>
                      </div>
                    </div>
                    <div className="total-row output-row">
                      <div className="content-l">
                        <div className="label-col">
                          <div className="label">
                            Estimated total monthly payment*
                          </div>
                        </div>
                        <div className="input-col">
                          <strong><WorksheetOutput prop="estimatedTotalPayment" data={worksheet}/></strong>
                        </div>
                      </div>
                    </div>

                    <div className="content-l output-row">
                      <div className="label-col">
                        <div className="label">Monthly taxes and insurance</div>
                      </div>
                      <div className="input-col">
                        - <WorksheetOutput prop="taxesAndInsurance" data={worksheet}/>
                      </div>
                    </div>

                    <div className="total-row output-row summary-row">
                      <div className="content-l">
                        <div className="label-col">
                          <div className="label">
                            Estimated monthly principal and interest
                          </div>
                        </div>
                        <div className="input-col">
                          <WorksheetOutput prop="principalAndInterest" data={worksheet}/>
                        </div>
                        <div className="content-l_col content-l_col-1 note-row">
                          <em>You'll need this number to calculate how much you want to spend on a home.</em>
                        </div>
                      </div>
                    </div>
                    <div className="content-l content-l_col-1 note-row footnote-row">
                      <p>* This worksheet assumes you are able to put down 20% of your home's purchase price. If you put down less than 20%, you will likely have to pay for mortgage insurance, which will increase your monthly payment. <a href="http://www.consumerfinance.gov/askcfpb/1953/what-is-mortgage-insurance-and-how-does-it-work.html">Learn more</a>.</p>
                    </div>
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

} );

var worksheet = {};

React.render(
  <MonthlyPaymentWorksheet worksheet={worksheet}/>, document.getElementById( 'app-container' )
);
