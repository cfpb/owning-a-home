Feature: verify the Rate Checker tool works according to requirements
  As a first time visitor to the Rate Checker page
  I want to utilize the Rate Checker tool
  So that I can make informed choices when shopping for a mortgage loan
  
@smoke_testing @rc
Scenario: First time visitor should see Alabama by default since location tracking has not been enabled
  Given I navigate to the "Rate Checker" page
  Then I should see the lender rate offered to "Alabama" residents

@smoke_testing @rc   
Scenario: The default credit range score should be displayed as 700 - 720
  Given I navigate to the "Rate Checker" page
  Then I should see the default Credit Score Range displayed as "700 - 720"
 
@smoke_testing @rc  
Scenario: The Location dropdown list is set to Alabama by default
  Given I navigate to the "Rate Checker" page
  Then I should see "Alabama" as the selected location 

@smoke_testing @rc  
Scenario: The Loan Term dropdown list is set to 30 Years by default
  Given I navigate to the "Rate Checker" page
  Then I should see "30 Years" as the selected Loan Term

@smoke_testing @rc  
Scenario: The Rate Structure dropdown list is set to Fixed by default
  Given I navigate to the "Rate Checker" page
  Then I should see "Fixed" as the selected Rate Structure

@smoke_testing @rc  
Scenario: The Loan Type dropdown list is set to Conventional by default
  Given I navigate to the "Rate Checker" page
  Then I should see "Conventional" as the selected Loan Type

@smoke_testing @rc  
Scenario: The House price field shows $200,000 as placeholder
  Given I navigate to the "Rate Checker" page
  Then I should see $"200,000" as the default House price

@smoke_testing @rc  
Scenario: The Down Payment amount field shows $20,000 as placeholder
  Given I navigate to the "Rate Checker" page
  Then I should see $"20,000" as the default Down Payment amount

@smoke_testing @rc  
Scenario: The Down Payment percentage field shows 20% as placeholder
  Given I navigate to the "Rate Checker" page
  Then I should see "10" as the default Down Payment percentage

@smoke_testing @rc  
Scenario: Move slider to the right to verify the credit score range increases
  Given I navigate to the "Rate Checker" page
  When I move the credit score slider to the "right"
  Then I should see the credit score range "increase"

@smoke_testing @rc   
Scenario: Move slider to the right to verify the credit score range increases
  Given I navigate to the "Rate Checker" page
  When I move the credit score slider to the "left"
  Then I should see the credit score range "decrease"

@smoke_testing @rc  
Scenario Outline: Selecting a different state should update the Rate Checker chart with the state selected
  Given I navigate to the "Rate Checker" page
  When I select "<state_name>" from the Location dropdown list
  Then I should see the selected "<state_name>" above the Rate Checker chart

Examples:
  | state_name      |
  | Nevada          |
  | California			|
  | Virginia		    |

@smoke_testing @rc  
Scenario Outline: The loan amount should be calculated as (House Price - Down Payment = Loan Amount)
  Given I navigate to the "Rate Checker" page
  When I enter $"<house_price>" as House Price amount 
    And I enter $"<down_payment_amount>" as Down Payment amount
  Then I should see "<loan_amount>" displayed as Loan Amount

Examples:
  | house_price   | down_payment_amount  | loan_amount   	|
  | 100,000       | 20,000 		           | $80,000 		    |
  | 250,000				| 42,500 		           | $207,500 	  	|
  | 780,000			  | 68,640 		           | $711,360 		  |
  | 1,250,000		  | 187,500 		         | $1,062,500     |

@smoke_testing @rc
Scenario Outline: The down payment amount should be calculated as (House Price * Down Payment Percent = Down Payment Amount)
  Given I navigate to the "Rate Checker" page
  When I enter $"<house_price>" as House Price amount 
    And I enter $"<down_payment_percent>" as Down Payment percent
  Then I should see "<down_payment_amount>" displayed as Down Payment amount

Examples:
  | house_price   | down_payment_percent   | down_payment_amount |
  | 100,000       | 20                     | 20000               |
  | 250,000       | 17                     | 42500               |
  | 780,000       | 9                      | 70200               |
  | 1,250,000     | 15                     | 187500              |

@smoke_testing @rc
Scenario Outline: The down payment percent should be calculated as (Down Payment amount * 100) / House Price = Down Payment percent
  Given I navigate to the "Rate Checker" page
  When I enter $"<house_price>" as House Price amount 
    And I enter $"<down_payment_amount>" as Down Payment amount
  Then I should see "<down_payment_percent>" displayed as Down Payment percentage

Examples:
  | house_price   | down_payment_amount | down_payment_percent   |
  | 100,000       | 15000               | 15                     |
  | 150,000       | 6000                | 4                      |
  | 780,000       | 70200               | 9                      |
  | 1,250,000     | 237500              | 19                     |
