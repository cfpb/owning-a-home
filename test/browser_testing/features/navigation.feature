Feature: verify the navigation tabs/links works according to requirements
  As a first time visitor to the Owning a Home page
  I want to click on invidual tabs and links
  So that I can easily navigate the site

@smoke_testing @landing_page
Scenario Outline: Test Learn more links in the landing page
  Given I navigate to the OAH Landing page
  When I click on the Learn more link inside "<section_name>"
  Then I should be directed to the internal "<relative_url>" URL
  And I should see "<page_title>" displayed in the page title

Examples:
  | section_name      		                    | page_title                      | relative_url                             |
  | Prepare to shop         | Know the Process                    | process/prepare/                            |
  | Explore loan options         | Know the Process                    | process/explore/                            |
  | Compare loan packages        | Know the Process                    | process/compare/                            |
  | Decide and close         | Know the Process                    | process/decide/                            |
  | Maintain your mortgage         | Know the Process                    | process/maintain/                            |


@smoke_testing @landing_page
Scenario Outline: Test Key Tools links in the landing page
  Given I navigate to the OAH Landing page
  When I click on the Key Tools "<link_name>" link inside "<section_name>"
  Then I should be directed to the internal "<relative_url>" URL
  And I should see "<page_title>" displayed in the page title

Examples:
  | link_name | section_name | relative_url | page_title |
  | Worksheet: clarify your goals | Prepare to shop | prepare-worksheets/ | Preparation worksheets |
  | Check interest rates for your situation | Prepare to shop | check-rates/ | Check interest rates |
  | Check interest rates for your situation | Explore loan options | check-rates/ | Check interest rates |
  | Understand loan options | Explore loan options | loan-options/ | Loan Options |

@smoke_testing @landing_page
Scenario Outline: Test outbound links in the landing page
   Given I navigate to the OAH Landing page
   When I click on the "<link_name>" link
   Then I should see the "<relative_url>" URL with page title <page_title> open in a new tab

Examples:
  | link_name                                       | page_title               | relative_url                                               |
  | Find a HUD-approved housing counselor           | Find a housing counselor | /find-a-housing-counselor/                                 |
  | Get answers to common questions                 | Mortgages                | /askcfpb/search/?selected_facets=category_exact:mortgages  |
  | Submit a mortgage complaint                     | Submit a complaint       | /complaint/#mortgage                                       |
  | Learn how CFPB is protecting mortgage borrowers | Mortgages                | /mortgage/                                                 |
