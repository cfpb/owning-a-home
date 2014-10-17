Feature: verify the navigation tabs works according to requirements
  As a first time visitor to the Owning a Home page
  I want to click on invidual tabs and links
  So that I can easily navigate the site
  # This test will be updated when the new landing page has the correct links

Background:
   Given I navigate to the Demo OAH page

@smoke_testing @ignore
Scenario Outline: Clicking on a link should display the corresponding page
   When I click on the "<link_name>" link
   Then I should see "<link_name>" displayed in the page title

Examples:
  | link_name      		|
  | Owning a Home   	|
  | Loan Comparison		|
  | Loan Options 		  |
  | Rate Checker 		  |
