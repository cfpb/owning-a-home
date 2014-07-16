Feature: verify the navigation tabs works according to requirements
  As a first time visitor to the Owning a Home page
  I want to click on invidual tabs and links
  So that I can easily navigate the site
  
@smoke_testing 
Scenario Outline: Clicking on a link should display the corresponding page
  Given I navigate to the Demo OAH page
  When I click on the "<link_name>" link
  Then I should see "<link_name>" displayed in the page title

Examples:
  | link_name      		|
  | Owning a Home   	|
  | Loan Comparison		|
  | Loan Types 			  |
  | Rate Checker 		  |
