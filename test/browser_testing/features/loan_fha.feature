Feature: verify the FHA Loan page works according to requirements
  As a first time visitor to the Owning a Home page
  I want to navigate the FHA Loan page
  So that I can find the information I'm looking for

Background:
   Given I navigate to the "FHA Loan" page

@smoke_testing @loan_options
Scenario Outline: Test inbound links in the FHA Loan page
	When I click on the "<link_name>" link
	Then I should be directed to the internal "<relative_url>" URL
		And I should see "<page_title>" displayed in the page title

Examples:
  | link_name       	  		| relative_url											| page_title 	|
  | Understanding loan options 	| /loan-options/  	    								| Loan Options  |
  | conventional loans 			| /loan-options/conventional-loans/ 					| Loan Options  |
  | Learn more below 			| /loan-options/FHA-loans/#mortgage-insurance 			| Loan Options  |



@smoke_testing @loan_options @prod_only
Scenario Outline: Test outbound links in the FHA Loan page
	When I click on the "<link_name>" link
	Then I should be directed to the external "<full_url>" URL
		And I should see "<page_title>" displayed in the page title

Examples:
  | link_name       	  											  | full_url		 																  | page_title 							  |
  | Federal Housing Administration									  | http://portal.hud.gov/hudportal/HUD?src=/federal_housing_administration  		  | Federal Housing Administration 		  |
  | Learn your FHA loan limit 										  | /askcfpb/1963/how-can-i-find-the-loan-limit-for-an-fha-loan-in-my-county.html 	  | Consumer Financial Protection Bureau  |
  | Learn more about mortgage insurance 							  | /askcfpb/1953/what-is-mortgage-insurance-and-how-does-it-work.html 				  | Consumer Financial Protection Bureau  |
  | How can I find the loan limit for an FHA loan in my county?       | /askcfpb/1963/how-can-i-find-the-loan-limit-for-an-fha-loan-in-my-county.html     | Consumer Financial Protection Bureau  |


@smoke_testing @loan_options
Scenario Outline: Test Related links in the FHA Loan page
	When I click Get all the details for "<loan_type>" loans
	Then I should be directed to the internal "<relative_url>" URL
		And I should see "<page_title>" displayed in the page title

Examples:
  | loan_type   	  				| relative_url								| page_title 	|
  | Related Link Conventional 		| /loan-options/conventional-loans/ 		| Loan Options  |
  | Related Link Special Programs   | /loan-options/special-loan-programs/      | Loan Options  |

