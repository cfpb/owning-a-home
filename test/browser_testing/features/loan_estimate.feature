Feature: Test the default values in the Loan Estimate page
  As a first time visitor to the Loan Estimate page
  I want to have content loaded
  So that I can get clever and live somewhere remote in a hut

Background:
   Given I navigate to the "Loan Estimate" page

@loan_estimate
Scenario Outline: Test that tabs are on the page
   Then I should see "<tab_name>" tab

Examples:
  | tab_name    |
  | Checklist   |
  | Definitions |


@loan_estimate
Scenario Outline: Test that the content is loaded
  When I click the tab "<tab_name>"
  Then Content image is loaded

Examples:
  | tab_name    |
  | Checklist   |
  | Definitions |


@loan_estimate
Scenario Outline: Test that resizing window size changes image size too
  When I click the tab "<tab_name>"
    When I resize window image "<css_selector>" size changes too

Examples:
  | tab_name    | css_selector          |
  | Checklist   | div.illustration img  |
  | Definitions | img.image-map_image   |


@loan_estimate
Scenario Outline: Test that expandable explainers are loaded
  When I click the tab "<tab_name>"
  Then Expandable explainers for "<tab_name>" are loaded
    And Expandable explainers for tab other than "<tab_name>" are invisible

Examples:
  | tab_name    |
  | Checklist   |
  | Definitions |


@loan_estimate
Scenario Outline: Test overlays/highlights
  When I click the tab "<tab_name>"
    When I hover over an overlay the corresponding explainer has class has-attention

Examples:
  | tab_name    |
  | Checklist   |
  | Definitions |
