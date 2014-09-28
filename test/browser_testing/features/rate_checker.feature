Feature: verify the Rate Checker tool works according to requirements
  As a first time visitor to the Rate Checker page
  I want to utilize the Rate Checker tool
  So that I can make informed choices when shopping for a mortgage loan

Background:
  Given I navigate to the "Rate Checker" page

@smoke_testing @rc
Scenario Outline: Test selecting different states
  When I select "<state_name>" from the Location dropdown list
  Then I should see the selected "<state_name>" above the Rate Checker chart

Examples:
  | state_name      |
  | Nevada          |
  | California			|
  | Virginia		    |

@smoke_testing @rc
Scenario: Select the ARM Type
  When I select "Adjustable" Rate Structure
  Then I should see "3/1" as the selected ARM Type

@smoke_testing @rc
Scenario Outline: Select 30 and 15 year Fixed Rate loans
  When I select "Fixed" Rate Structure
    And I select "<total_number> Years" Loan Term
  Then I should see "District of Columbia" as the selected location
    And I should see the "Primary" Interest cost over <total_number> years
    And I should see the "Secondary" Interest cost over <total_number> years

Examples:
  | total_number |
  | 30           |
  | 15           |

@rc @ignore
Scenario: Test all dropdown lists in the Rate Checker page
  When I select "Adjustable" Rate Structure
    And I select "7/1" ARM Type
    And I select "Fixed" Rate Structure
    And I select "15 Years" Loan Term
    And I select "FHA" Loan Type
