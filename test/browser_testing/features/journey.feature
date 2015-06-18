Feature: verify the /owning-a-home/process page works according to requirements
As a first time visitor to the Owning a Home page
I want to navigate the process page
So that I can find the information I'm looking for

@process_page @check_urls
Scenario Outline: Testing availability of all pages
  Given I navigate to the "<page_name>" page
  Then I see navbar-header loaded

Examples:
  | page_name             |
  | Know the Process      |
  | Prepare to Shop       |
  | Explore Loan Options  |
  | Compare Loan Options  |
  | Get Ready to Close    |
