Feature: Test the rate checker API 
  As an API client
  I want to query the Rate Checker API
  So that I can ensure that the data is returned properly

@smoke_testing
Scenario Outline: Verify the API response includes a timestamp
        Given I select "<house_price>" as House Price
          And I select "<loan_amount>" as Loan Amount
          And I select my minimum credit score as "<minfico>" 
          And I select my maximum credit score as "<maxfico>"
          And I select "<state>" as State
          And I select "<rate_structure>" as Rate Structure
          And I select "<loan_term>" as Loan Term
          And I select "<loan_type>" as Loan Type
          And I select "<arm_type>" as ARM Type 
        When I send the request
        Then the response should include a timestamp field

  Examples:
  | house_price   | loan_amount | minfico | maxfico | state | rate_structure | loan_term | loan_type | arm_type |
  | 200000        | 180000      | 700     | 720     | AL    | fixed          | 30        | conf      | 3-1      |

@smoke_testing
Scenario Outline: Verify the API response includes a timestamp
        Given I select "<house_price>" as House Price
          And I select "<loan_amount>" as Loan Amount
          And I select my minimum credit score as "<minfico>" 
          And I select my maximum credit score as "<maxfico>"
          And I select "<state>" as State
          And I select "<rate_structure>" as Rate Structure
          And I select "<loan_term>" as Loan Term
          And I select "<loan_type>" as Loan Type
          And I select "<arm_type>" as ARM Type 
        When I send the request
        Then the response should include a data field

  Examples:
  | house_price   | loan_amount | minfico | maxfico | state | rate_structure | loan_term | loan_type | arm_type |
  | 200000        | 180000      | 700     | 720     | AL    | fixed          | 30        | conf      | 3-1      |
