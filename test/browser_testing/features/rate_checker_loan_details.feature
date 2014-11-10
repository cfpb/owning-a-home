Feature: verify the Rate Checker tool works according to requirements
  As a first time visitor to the Rate Checker page
  I want to utilize the Rate Checker tool
  So that I can make informed choices when shopping for a mortgage loan

Background:
  Given I navigate to the "Rate Checker" page

@rate_checker
Scenario: Select the ARM Type
  When I select "Adjustable" Rate Structure
  Then I should see "3/1" as the selected ARM Type

@rate_checker
Scenario Outline: Select Fixed Rate loans for different loan types and terms
  When I select "<rate_structure>" Rate Structure
  	And I select "<loan_type>" Loan Type
    And I select "<loan_term> Years" Loan Term
  Then I should see primary Interest cost over "<loan_term>" years in the "First" column
    And I should see primary Interest cost over "<loan_term>" years in the "Second" column

Examples:
  | rate_structure   | loan_type    | loan_term |
  | Fixed 			     | Conventional | 30        |
  | Fixed 			     | Conventional | 15        |
  | Fixed 			     | FHA 		      | 30        |
  | Fixed 			     | FHA 		      | 15        |
  | Fixed 			     | VA 		      | 30 	      |
  | Fixed 			     | VA 		      | 15 	      |
 
@rate_checker
Scenario Outline: Select Fixed Rate loans for different loan types and terms
  When I select "<rate_structure>" Rate Structure
  	And I select "<loan_type>" Loan Type
    And I select "<loan_term> Years" Loan Term
  Then I should see secondary Interest cost over "<fixed_years>" years in the "First" column
    And I should see secondary Interest cost over "<fixed_years>" years in the "Second" column

Examples:
  | rate_structure    | loan_type    | loan_term    | fixed_years |
  | Adjustable 		    | Conventional | 30           | 3 	        |

@rate_checker
Scenario Outline: Select Adjustable rate and verify that ONLY 30 Year loan term can be selected
  When I select "Adjustable" Rate Structure
  Then Loan type option "<loan_type>" should be "<option_state>"

Examples:
   | loan_type    | option_state | 
   | Conventional | enabled      |
   | FHA 		      | disabled     |

@rate_checker1
Scenario Outline: Select Adjustable rate and verify that ONLY Conventional loan type can be selected
  When I select "Adjustable" Rate Structure
  Then Loan term option "<loan_term>" should be "<option_state>"

Examples:
   | loan_term    | option_state | 
   | 30 Years     | enabled      |
   | 15 Years     | disabled     |
