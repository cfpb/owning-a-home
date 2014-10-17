Feature: verify the Loan Options page works according to requirements
  As a first time visitor to the Owning a Home page
  I want to navigate the Loan Options page
  So that I can find the information I'm looking for

Background:
   Given I navigate to the "Loan Options" page

@smoke_testing @expand
Scenario Outline: Click 'Learn More' to expand sections
	When I click Learn More to expand the "<section_name>" section
	Then I should see a collapse link for the "<section_name>" section
		And I should see "<expected_text>" inside the "<section_name>" section

Examples:
  | section_name        	| expected_text 				 	 |
  | Loan term 				| Compare your loan term options 	 |
  | Interest rate structure | Compare your interest rate options |
  | Loan type 				| Choosing the right loan type 		 |

@smoke_testing @collapse
Scenario Outline: Click 'Collapse' to collapse sections
	When I click Learn More to expand the "<section_name>" section
		And I collapse the "<section_name>" section
	Then I should NOT see the "<section_name>" section expanded

Examples:
  | section_name        	 |
  | Loan term 				 |
  | Interest rate structure  |
  | Loan type 				 |