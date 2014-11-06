Feature: verify the Home page works according to requirements
As a first time visitor to the Owning a Home page
I want to navigate the home page
So that I can find the information I'm looking for

Background:
   Given I navigate to the OAH Landing page

@smoke_testing @landing_page
Scenario Outline: Testing valid email signup
  When I enter "<email_address>"
    And I click the Signup button
  Then I should see "Thanks, we’ll be in touch!" displayed

Examples:
  | email_address         |
  | test@yahoo.com        |
  | test123@gmail.com     |
  | mr.tester@github.com  |

@smoke_testing @landing_page
Scenario Outline: Testing multiple messages
  When I enter "<email_address>"
    And I click the Signup button
    And I click the Signup button again
    And I click the Signup button again
  Then I should NOT see multiple "Thanks, we’ll be in touch!" messages displayed

Examples:
  | email_address         |
  | test@yahoo.com        |
