Feature: verify the navigation tabs/links works according to requirements
  As a first time visitor to the Owning a Home page
  I want to click on invidual tabs and links
  So that I can easily navigate the site

@smoke_testing @landing_page
Scenario Outline: Test Journey links in the landing page
  Given I navigate to the OAH Landing page
  When I click on the link with id "<link_id>"
  Then I should be directed to the internal "<relative_url>" URL
  And I should see "<page_title>" displayed in the page title

Examples:
  | link_id   		                    | page_title                      | relative_url                             |
  | prepare-header-link         | Know the Process                    | process/prepare/                            |
  | prepare-learn-link         | Know the Process                    | process/prepare/                            |
  | explore-header-link         | Know the Process                    | process/explore/                            |
  | explore-learn-link         | Know the Process                    | process/explore/                            |
  | compare-header-link         | Know the Process                    | process/compare/                            |
  | compare-learn-link         | Know the Process                    | process/compare/                            |
  | decide-header-link         | Know the Process                    | process/decide/                            |
  | decide-learn-link         | Know the Process                    | process/decide/                            |
  | maintain-header-link         | Know the Process                    | process/maintain/                            |
  | maintain-learn-link         | Know the Process                    | process/maintain/                            |


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
