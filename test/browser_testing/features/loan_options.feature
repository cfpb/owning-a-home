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
  | section_name        	  | expected_text 				 	            |
  | Loan term 				      | Compare your loan term options 	    |
  | Interest rate structure | Compare your interest rate options  |
  | Loan type 				      | Choosing the right loan type 		    |

@smoke_testing @collapse
Scenario Outline: Click 'Collapse' to collapse sections
	When I click Learn More to expand the "<section_name>" section
		And I collapse the "<section_name>" section
	Then I should NOT see the "<section_name>" section expanded

Examples:
  | section_name        	   |
  | Loan term 				       |
  | Interest rate structure  |
  | Loan type 				       |

@smoke_testing @internal
Scenario Outline: Test inbound links in the Loan Options page
   Given I navigate to the "Loan Options" page 
   When I click on the "<link_name>" link
   Then I should be directed to the internal "<relative_url>" URL

Examples:
  | link_name                             | page_title                      | relative_url                             |
  | Understanding loan options            | Loan Options                    | loan-options/                            |
  | Closing checklist                     | checklist_mortgage_closing.pdf  | resources/checklist_mortgage_closing.pdf |
  | Closing forms explainer               | mortgage_closing_forms.pdf      | resources/mortgage_closing_forms.pdf     |

@smoke_testing @internal
Scenario: Test inbound links in the Loan Options page
   Given I navigate to the "Loan Options" page 
   When I click on the "Owning a Home" link
   Then I should be directed to the OAH Landing page
