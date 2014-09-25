Feature: verify the Loan Comparison page works according to requirements
  As a first time visitor to the Owning a Home page
  I want to navigate the Loan Comparison page
  So that I can find the information I'm looking for

@desktop
Scenario: First time Desktop visitor should only see Loan A column
  Given I navigate to the "Loan Comparison" page
  Then I should see the "Loan A" column enabled
  	And I should NOT see the "Loan B" column
  	And I should NOT see the "Loan C" column

@desktop
Scenario: First time Desktop visitor should see default State selected
  Given I navigate to the "Loan Comparison" page
  Then I should see "Alabama" as default State

@desktop
Scenario: First time Desktop visitor should see default Credit Score
  Given I navigate to the "Loan Comparison" page
  Then I should see "600 - 620" as default Credit Score

@desktop
Scenario: First time Desktop visitor should see default Loan Amount
  Given I navigate to the "Loan Comparison" page
  Then I should see "$180,000" as default Loan Amount

@desktop
Scenario: First time Desktop visitor should see default House Price
  Given I navigate to the "Loan Comparison" page
  Then I should see "$200,000" as default House Price

@desktop
Scenario: First time Desktop visitor should see default Down Payment percent
  Given I navigate to the "Loan Comparison" page
  Then I should see "10" as default Down Payment percent

@desktop
Scenario: First time Desktop visitor should see default Down Payment amount
  Given I navigate to the "Loan Comparison" page
  Then I should see "$20,000" as default Down Payment amount

@desktop
Scenario: First time Desktop visitor should see default Rate Structure
  Given I navigate to the "Loan Comparison" page
  Then I should see "Fixed" as default Rate Structure

@desktop
Scenario: First time Desktop visitor should see default Loan Term
  Given I navigate to the "Loan Comparison" page
  Then I should see "30 years" as default Loan Term

@desktop
Scenario: First time Desktop visitor should see default Loan Type
  Given I navigate to the "Loan Comparison" page
  Then I should see "Conventional" as default Loan Type

@desktop
Scenario: First time Desktop visitor should see default ARM Type
  Given I navigate to the "Loan Comparison" page
  Then I should see "3/1" as default ARM Type

@desktop
Scenario: First time Desktop visitor should see default Interest Rate
  Given I navigate to the "Loan Comparison" page
  Then I should see "3.25%" as default Interest Rate

@mobile
Scenario: First time Mobile visitor should only see Loan A column
  Given I navigate to the "Loan Comparison" page
  Then I should see the "Loan A" column enabled
  	And I should NOT see the "Loan B" column

