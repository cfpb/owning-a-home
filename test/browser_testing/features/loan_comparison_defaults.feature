Feature: Test the default values in the Loan Comparison page
  As a first time visitor to the Owning a Home page
  I want to have fields pre-poluated
  So that I can compare loan costs easily

Background:
   Given I navigate to the "Loan Comparison" page

@smoke_testing @loan_comparison1
Scenario: First time visitor should see Loan A but NOT Loan B or C
  Then I should see the "Loan A" column
    But I should NOT see the "Loan B" column
    But I should NOT see the "Loan C" column

@smoke_testing @loan_comparison
Scenario: First time visitor should see default State selected for Loan A
  Then I should see "Alabama" as default State for "Loan A"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default State selected for Loan B
  When I click Add another loan
  Then I should see "Alabama" as default State for "Loan B"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default State selected for Loan C
  When I click Add another loan
    And I click Add another loan again
  Then I should see "Alabama" as default State for "Loan C"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Credit Score for Loan A
  Then I should see "701 - 720" as default Credit Score for "Loan A"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Credit Score for Loan B
  When I click Add another loan
  Then I should see "701 - 720" as default Credit Score for "Loan B"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Credit Score for Loan C
  When I click Add another loan
    And I click Add another loan again
  Then I should see "701 - 720" as default Credit Score for "Loan C"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Loan Amount for Loan A
  Then I should see "$180,000" as default Loan Amount for "Loan A"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Loan Amount for Loan B
  When I click Add another loan
    And I click Add another loan again
  Then I should see "$180,000" as default Loan Amount for "Loan B"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Loan Amount for Loan C
  When I click Add another loan
    And I click Add another loan again
  Then I should see "$180,000" as default Loan Amount for "Loan C"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default House Price for Loan A
  Then I should see "$200,000" as default House Price for "Loan A"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default House Price for Loan B
  When I click Add another loan
    And I click Add another loan again
  Then I should see "$200,000" as default House Price for "Loan B"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default House Price for Loan C
  When I click Add another loan
    And I click Add another loan again
  Then I should see "$200,000" as default House Price for "Loan C"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Down Payment percent for Loan A
  Then I should see "10" as default Down Payment percent for "Loan A"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Down Payment percent for Loan B
  When I click Add another loan
  Then I should see "10" as default Down Payment percent for "Loan B"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Down Payment percent for Loan C
  When I click Add another loan
    And I click Add another loan again
  Then I should see "10" as default Down Payment percent for "Loan C"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Down Payment amount for Loan A
  Then I should see "$20,000" as default Down Payment amount for "Loan A"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Down Payment amount for Loan B
  When I click Add another loan
  Then I should see "$20,000" as default Down Payment amount for "Loan B"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Down Payment amount for Loan C
  When I click Add another loan
    And I click Add another loan again
  Then I should see "$20,000" as default Down Payment amount for "Loan C"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Rate Structure for Loan A
  Then I should see "Fixed" as default Rate Structure for "Loan A"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Rate Structure for Loan B
  When I click Add another loan
  Then I should see "Fixed" as default Rate Structure for "Loan B"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Rate Structure for Loan C
  When I click Add another loan
    And I click Add another loan again
  Then I should see "Fixed" as default Rate Structure for "Loan C"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Loan Term for Loan A
  Then I should see "30 years" as default Loan Term for "Loan A"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Loan Term for Loan B
  When I click Add another loan
  Then I should see "30 years" as default Loan Term for "Loan B"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Loan Term for Loan B
  When I click Add another loan
    And I click Add another loan again
  Then I should see "30 years" as default Loan Term for "Loan B"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Loan Type for Loan A
  Then I should see "Conventional" as default Loan Type for "Loan A"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Loan Type for Loan B
  When I click Add another loan
  Then I should see "Conventional" as default Loan Type for "Loan B"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default Loan Type for Loan C
  When I click Add another loan
    And I click Add another loan again
  Then I should see "Conventional" as default Loan Type for "Loan C"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default ARM Type for Loan A
  Then I should see "3/1" as default ARM Type for "Loan A"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default ARM Type for Loan B
  When I click Add another loan
  Then I should see "3/1" as default ARM Type for "Loan B"

@smoke_testing @loan_comparison
Scenario: First time visitor should see default ARM Type for Loan C
  When I click Add another loan
    And I click Add another loan again
  Then I should see "3/1" as default ARM Type for "Loan C"

@smoke_testing @loan_comparison
Scenario: First time Desktop visitor should see default Discount point and credits for Loan A
  Then I should see "0" as default Discount point and credits for "Loan A"

@smoke_testing @loan_comparison
Scenario: First time Desktop visitor should see default Discount point and credits for Loan B
  When I click Add another loan
  Then I should see "0" as default Discount point and credits for "Loan B"

@smoke_testing @loan_comparison
Scenario: First time Desktop visitor should see default Discount point and credits for Loan C
  When I click Add another loan
    And I click Add another loan again
  Then I should see "0" as default Discount point and credits for "Loan C"

@smoke_testing @loan_comparison
Scenario: First time Desktop visitor should see default Interest Rate for Loan A
  Then I should see "3.25%" as default Interest Rate for "Loan A"

@smoke_testing @loan_comparison
Scenario: First time Desktop visitor should see default Interest Rate for Loan B
  When I click Add another loan
  Then I should see "3.25%" as default Interest Rate for "Loan B"

@smoke_testing @loan_comparison
Scenario: First time Desktop visitor should see default Interest Rate for Loan C
  When I click Add another loan
    And I click Add another loan again
  Then I should see "3.25%" as default Interest Rate for "Loan C"

