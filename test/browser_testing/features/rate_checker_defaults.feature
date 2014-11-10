Feature: Test the Rate Checker fields default to the correct values
  As a first time visitor to the Rate Checker page
  I want to have fields pre-populated
  So that I can make informed choices when shopping for a mortgage loan

Background:
  Given I navigate to the "Rate Checker" page

@rate_checker
Scenario: Default credit score range
  Then I should see the Credit Score Range displayed as "700 - 720"
 
@rate_checker
Scenario: Default location
  Then I should see "District of Columbia" as the selected location 

@rate_checker  
Scenario: Default Rate Structure
  Then I should see "Fixed" as the selected Rate Structure

@rate_checker  
Scenario: Default Loan Term
  Then I should see "30 Years" as the selected Loan Term

@rate_checker  
Scenario: Default Loan Type
  Then I should see "Conventional" as the selected Loan Type

@rate_checker
Scenario: Default House price
  Then I should see $"200,000" as the House price

@rate_checker
Scenario: Default Down Payment amount
  Then I should see $"20,000" as Down Payment amount

@rate_checker
Scenario: Default Down Payment percent
  Then I should see "10" as Down Payment percent

@rate_checker
Scenario: Default loan amount
  Then I should see "$180,000" as Loan Amount

@rate_checker
Scenario: Default tab
  Then I should see the "I plan to buy in the next couple of months" tab selected
