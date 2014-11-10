Feature: verify the Rate Checker tool works according to requirements
  As a first time visitor to the Rate Checker page
  I want to utilize the Rate Checker tool
  So that I can make informed choices when shopping for a mortgage loan

Background:
  Given I navigate to the "Rate Checker" page

@beta_signup
Scenario Outline: Testing valid email signup
  When I enter "<email_address>"
    And I click the Signup button
  Then I should see "Thanks, we’ll be in touch!" displayed

Examples:
  | email_address         |
  | test@yahoo.com        |
  | test123@gmail.com     |
  | mr.tester@github.com  |

@bugfix
Scenario Outline: Testing that multiple "Thanks, we’ll be in touch!" messages are NOT displayed
  When I enter "<email_address>"
    And I click the Signup button
    And I click the Signup button again
    And I click the Signup button again
  Then I should NOT see multiple "Thanks, we’ll be in touch!" messages displayed

Examples:
  | email_address        |
  | test.abc@yahoo.com   |

@rate_checker
Scenario Outline: Test selecting different states
  When I select "<state_name>" from the Location dropdown list
  Then I should see the selected "<state_name>" above the Rate Checker chart

Examples:
  | state_name      |
  | Nevada          |
  | California			|
  | Virginia		    |

@rate_checker @ignore
Scenario: Test all dropdown lists in the Rate Checker page
  When I select "Adjustable" Rate Structure
    And I select "7/1" ARM Type
    And I select "Fixed" Rate Structure
    And I select "15 Years" Loan Term
    And I select "FHA" Loan Type
