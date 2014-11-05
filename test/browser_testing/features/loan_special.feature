Feature: verify the Special Programs Loan page works according to requirements
  As a first time visitor to the Owning a Home page
  I want to navigate the Special Programs Loan page
  So that I can find the information I'm looking for

Background:
   Given I navigate to the "Special Loan Programs" page

@smoke_testing @loan_options
Scenario Outline: Test inbound links in the Special Programs Loan page
	When I click on the "<link_name>" link
	Then I should be directed to the internal "<relative_url>" URL
		And I should see "<page_title>" displayed in the page title

Examples:
  | link_name       	  		     | relative_url											                      | page_title 	  |
  | Owning a Home              | /                                                      | Owning a Home |
  | conventional               	 | loan-options/conventional-loans/                       | Loan Options  |
  | FHA                          | loan-options/FHA-loans/                                | Loan Options  |
  | conventional loans           | loan-options/conventional-loans/                       | Loan Options  |
  | More on mortgage insurance   | loan-options/special-loan-programs/#mortgage-insurance | Loan Options  |
  | mortgage insurance           | loan-options/special-loan-programs/#mortgage-insurance | Loan Options  |

@smoke_testing @loan_options @prod_only
Scenario Outline: Test outbound links in the Special Programs Loan page
	When I click on the "<link_name>" link
	Then I should be directed to the external "<full_url>" URL
		And I should see "<page_title>" displayed in the page title

Examples:
  | link_name       	  											  | full_url		 																                        | page_title 							            |
  | Good Faith Estimates    									  | /askcfpb/146/what-is-a-good-faith-estimate-what-is-a-gfe.html  		  | What is a Good Faith Estimate? 		  |
  | Department of Veterans' Affairs (VA)        | http://www.benefits.va.gov/homeloans/                               | Home Loans Home                     |
  | eligible                                    | http://www.benefits.va.gov/homeloans/purchaseco_certificate.asp     | Certificate of Eligibility          |
  | upfront fee                                 | http://www.benefits.va.gov/homeloans/purchaseco_loan_fee.asp        | Loan Fees                           |
  | US Department of Agriculture                | http://www.rurdev.usda.gov/had-guaranteed_housing_loans.html        | Guaranteed Housing Loans            |
  | Find out if you're eligible.                | http://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do    | Welcome                             |
  | this tool                                   | http://downpaymentresource.com/                                     | Down Payment Resource               |
  | local housing counselor                     | /find-a-housing-counselor/                                          | Find a housing counselor            |
  | Learn more about mortgage insurance         | /askcfpb/1953/what-is-mortgage-insurance-and-how-does-it-work.html          | What is mortgage insurance and how does it work? |


@smoke_testing @loan_options
Scenario Outline: Test Related links in the Special Programs Loan page
	When I click Get all the details for "<loan_type>" loans
	Then I should be directed to the internal "<relative_url>" URL
		And I should see "<page_title>" displayed in the page title

Examples:
  | loan_type   	  				      | relative_url								          | page_title 	  |
  | Related Link Conventional 		| /loan-options/conventional-loans/ 		| Loan Options  |
  | Related Link FHA              | /loan-options/FHA-loans/              | Loan Options  |
