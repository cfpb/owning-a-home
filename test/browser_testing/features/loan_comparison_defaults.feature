Feature: verify the default values in the Loan Comparison page
  As a first time visitor to the Owning a Home page
  I want to have fields pre-poluated
  So that I can compare loan costs easily

@desktop
Scenario: First time Desktop visitor should see default State selected for Loan A
  Given I navigate to the "Loan Comparison" page
  Then I should see "Alabama" as default State

@desktop
Scenario: First time Desktop visitor should see default Credit Score for Loan A
  Given I navigate to the "Loan Comparison" page
  Then I should see "701 - 720" as default Credit Score

@desktop
Scenario: First time Desktop visitor should see default Loan Amount for Loan A
  Given I navigate to the "Loan Comparison" page
  Then I should see "$180,000" as default Loan Amount

@desktop
Scenario: First time Desktop visitor should see default House Price for Loan A
  Given I navigate to the "Loan Comparison" page
  Then I should see "$200,000" as default House Price

@desktop
Scenario: First time Desktop visitor should see default Down Payment percent for Loan A
  Given I navigate to the "Loan Comparison" page
  Then I should see "10" as default Down Payment percent

@desktop
Scenario: First time Desktop visitor should see default Down Payment amount for Loan A
  Given I navigate to the "Loan Comparison" page
  Then I should see "$20,000" as default Down Payment amount

@desktop
Scenario: First time Desktop visitor should see default Rate Structure for Loan A
  Given I navigate to the "Loan Comparison" page
  Then I should see "Fixed" as default Rate Structure

@desktop
Scenario: First time Desktop visitor should see default Loan Term for Loan A
  Given I navigate to the "Loan Comparison" page
  Then I should see "30 years" as default Loan Term

@desktop
Scenario: First time Desktop visitor should see default Loan Type for Loan A
  Given I navigate to the "Loan Comparison" page
  Then I should see "Conventional" as default Loan Type

@desktop
Scenario: First time Desktop visitor should see default ARM Type for Loan A
  Given I navigate to the "Loan Comparison" page
  Then I should see "3/1" as default ARM Type

@desktop1
Scenario: First time Desktop visitor should see default Discount point and credits for Loan A
  Given I navigate to the "Loan Comparison" page
  Then I should see "0" as default Discount point and credits

@desktop
Scenario: First time Desktop visitor should see default Interest Rate for Loan A
  Given I navigate to the "Loan Comparison" page
  Then I should see "3.25%" as default Interest Rate


