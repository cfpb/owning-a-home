Feature: verify the navigation tabs works according to requirements
  As a first time visitor to the Owning a Home page
  I want to click on invidual tabs and links
  So that I can easily navigate the site

@smoke_testing @landing_page
Scenario Outline: Test inbound links in the landing page
   Given I navigate to the OAH Landing page
   When I click on the "<link_name>" link
   Then I should be directed to the internal "<relative_url>" URL
      And I should see "<page_title>" displayed in the page title

Examples:
  | link_name      		                    | page_title                      | relative_url                             |
  | Learn more about loan options         | Loan Options                    | loan-options/                            |
  | Get the closing checklist		          | checklist_mortgage_closing.pdf  | resources/checklist_mortgage_closing.pdf |
  | Get the closing forms explainer       | mortgage_closing_forms.pdf      | resources/mortgage_closing_forms.pdf     |



@smoke_testing @landing_page
Scenario Outline: Test outbound links in the landing page
   Given I navigate to the OAH Landing page
   When I click on the "<link_name>" link
   Then I should be directed to the external "<full_url>" URL
      And I should see "<page_title>" displayed in the page title

Examples:
  | link_name                                       | page_title               | full_url                                                   |
  | Find a HUD-approved housing counselor           | Find a housing counselor | http://www.consumerfinance.gov/find-a-housing-counselor/   |
  | Get answers to common questions                 | Mortgages                | /askcfpb/search/?selected_facets=category_exact:mortgages  |
  | Submit a mortgage complaint                     | Submit a complaint       | /complaint/#mortgage                                       |
  | Learn how CFPB is protecting mortgage borrowers | Mortgages                | /mortgage/                                                 |
