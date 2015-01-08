Feature: verify the Rate Checker tool works according to requirements
  As a first time visitor to the Rate Checker page
  I want to utilize the Rate Checker tool
  So that I can make informed choices when shopping for a mortgage loan

Background:
  Given I navigate to the "Rate Checker" page

@rate_checker
Scenario: Select the ARM Type
  When I select "Adjustable" Rate Structure
  Then I should see "5/1" as the selected ARM Type

@rate_checker
Scenario Outline: Select Fixed Rate loans for different loan types and terms
  When I select "<rate_structure>" Rate Structure
  	And I select "<loan_type>" Loan Type
    And I select "<loan_term> Years" Loan Term
  Then I should see primary Interest costs over the first "5" years
    And I should see primary Interest costs over "<loan_term>" years

Examples:
  | rate_structure   | loan_type    | loan_term |
  | Fixed 			     | Conventional | 30        |
  | Fixed 			     | Conventional | 15        |
  | Fixed 			     | FHA 		      | 30        |
  | Fixed 			     | FHA 		      | 15        |
  | Fixed 			     | VA 		      | 30 	      |
  | Fixed 			     | VA 		      | 15 	      |
 
@rate_checker
Scenario Outline: Select Adjustable Rate loans for different ARM types
  When I select "<rate_structure>" Rate Structure
    And I select "<arm_type>" ARM Type
  Then I should see Interest costs over the first "<fixed_years>" years
    And I should see Interest costs over "30" years

Examples:
  | rate_structure    | arm_type    | fixed_years |
  | Adjustable 		    | 3/1         | 3 	        |
  | Adjustable        | 5/1         | 5           |
  | Adjustable        | 7/1         | 7           |

@rate_checker
Scenario: Select Adjustable rate and verify that ONLY 30 Year loan term can be selected
  When I select "Adjustable" Rate Structure
  Then Loan type option "Conventional" should be "enabled"
    And Loan type option "FHA" should be "disabled"


@rate_checker
Scenario Outline: Select Adjustable rate and verify that ONLY Conventional loan type can be selected
  When I select "Adjustable" Rate Structure
  Then Loan term option "<loan_term>" should be "<option_state>"

Examples:
   | loan_term    | option_state | 
   | 30 Years     | enabled      |
   | 15 Years     | disabled     |
