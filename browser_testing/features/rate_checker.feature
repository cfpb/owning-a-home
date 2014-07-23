Feature: verify the Rate Checker tool works according to requirements
  As a first time visitor to the Rate Checker page
  I want to utilize the Rate Checker tool
  So that I can make informed choices when shopping for a mortgage loan
  
@smoke_testing @rc
Scenario: Default location
  Given I navigate to the "Rate Checker" page
  Then I should see the lender rate offered to "District of Columbia" residents

@smoke_testing @rc
Scenario: Default credit score range
  Given I navigate to the "Rate Checker" page
  Then I should see the Credit Score Range displayed as "700 - 720"
 
@smoke_testing @rc
Scenario: Default location
  Given I navigate to the "Rate Checker" page
  Then I should see "District of Columbia" as the selected location 

@smoke_testing @rc  
Scenario: Default Rate Structure
  Given I navigate to the "Rate Checker" page
  Then I should see "Fixed" as the selected Rate Structure

@smoke_testing @rc  
Scenario: Default Loan Term
  Given I navigate to the "Rate Checker" page
  Then I should see "30 Years" as the selected Loan Term

@smoke_testing @rc  
Scenario: Default Loan Type
  Given I navigate to the "Rate Checker" page
  Then I should see "Conventional" as the selected Loan Type

@smoke_testing @rc
Scenario: Default House price
  Given I navigate to the "Rate Checker" page
  Then I should see $"200,000" as the House price

@smoke_testing @rc
Scenario: Default Down Payment amount
  Given I navigate to the "Rate Checker" page
  Then I should see $"20,000" as Down Payment amount

@smoke_testing @rc
Scenario: Default Down Payment percent
  Given I navigate to the "Rate Checker" page
  Then I should see "10" as Down Payment percent

@smoke_testing @rc
Scenario: Default loan amount
  Given I navigate to the "Rate Checker" page
  Then I should see "$180,000" as Loan Amount

@smoke_testing @rc
Scenario: Default tab
  Given I navigate to the "Rate Checker" page
  Then I should see the "I plan to buy in the next couple of months" tab selected

@smoke_testing @rc
Scenario Outline: Click outbound links
  Given I navigate to the "Rate Checker" page
  When I click on the "<link_name>" link in the Rate Checker page
  Then I should see "<page_title>" displayed in the page title

Examples:
  | link_name                               | page_title                                  |
  | Good Faith Estimates                    | What is a Good Faith Estimate?              |
  | points                                  | What are discount points or points?         |
  | closing costs                           | What are closing costs?                     |
  | discount points                         | What are discount points or points?         |
  | rate lock                               | What's a lock-in or a rate lock?            |
  | More mortgage questions on Ask CFPB     | Mortgages                                   |
  | credit report                           | Annual Credit Report.com                    |
  | get them corrected                      | How do I dispute an error on my credit report?  |

@smoke_testing @rc
Scenario Outline: Click outbound links inside tab page
  Given I navigate to the "Rate Checker" page
  When I click on the "I won’t buy for several months" tab in the Rate Checker page
    And I click on the "<link_name>" link in the Rate Checker page
  Then I should see "<page_title>" displayed in the page title

Examples:
  | link_name                               | page_title                                  |
  | Learn more about credit scores          | What is my credit score?                    |
  | Learn about improving your credit score | How do I get and keep a good credit score?  |
  | Learn more about down payments          | What kind of down payment do I need?        |

@smoke_testing @rc
Scenario: Click internal links
  Given I navigate to the "Rate Checker" page
  When I click on the "About our data source" link in the Rate Checker page
  Then I should see the page scroll to the "#about" section

@smoke_testing @rc
Scenario: Decrease credit score range
  Given I navigate to the "Rate Checker" page
  When I move the credit score slider to the "left"
  Then I should see the credit score range "decrease"

@smoke_testing @rc
Scenario: Increase credit score range
  Given I navigate to the "Rate Checker" page
  When I move the credit score slider to the "right"
  Then I should see the credit score range "increase"

@smoke_testing @rc
Scenario: Lowest credit score range alerts
  Given I navigate to the "Rate Checker" page
  When I move the credit score slider to the "lowest" range
  Then I should see the credit score slider handle turns red

@smoke_testing @rc
Scenario: Lowest credit score range alerts
  Given I navigate to the "Rate Checker" page
  When I move the credit score slider to the "lowest" range
  Then I should see an alert for borowers with less than 620 score

@smoke_testing @rc
Scenario Outline: Select different states
  Given I navigate to the "Rate Checker" page
  When I select "<state_name>" from the Location dropdown list
  Then I should see the selected "<state_name>" above the Rate Checker chart

Examples:
  | state_name      |
  | Nevada          |
  | California			|
  | Virginia		    |

@smoke_testing @rc  
Scenario Outline: Calculate loan amount
  Given I navigate to the "Rate Checker" page
  When I enter $"<house_price>" as House Price amount 
    And I enter $"<down_payment_amount>" as Down Payment amount
  Then I should see "<loan_amount>" as Loan Amount

Examples:
  | house_price   | down_payment_amount  | loan_amount   	|
  | 100,000       | 20,000 		           | $80,000 		    |
  | 250,000				| 42,500 		           | $207,500 	  	|
  | 780,000			  | 68,640 		           | $711,360 		  |
  | 1,250,000		  | 187,500 		         | $1,062,500     |

@smoke_testing @rc
Scenario Outline: Calculate down payment amount
  Given I navigate to the "Rate Checker" page
  When I enter $"<house_price>" as House Price amount 
    And I enter "<down_payment_percent>" as Down Payment percent
  Then I should see $"<down_payment_amount>" as Down Payment amount

Examples:
  | house_price   | down_payment_percent   | down_payment_amount |
  | 250,000       | 17                     | 42500               |
  | 100,000       | 20                     | 20000               |
  | 780,000       | 9                      | 70200               |
  | 1,250,000     | 15                     | 187500              |

@smoke_testing @rc
Scenario Outline: Calculate down payment percent
  Given I navigate to the "Rate Checker" page
  When I enter $"<house_price>" as House Price amount 
    And I enter $"<down_payment_amount>" as Down Payment amount
  Then I should see "<down_payment_percent>" as Down Payment percent

Examples:
  | house_price   | down_payment_amount | down_payment_percent   |
  | 100,000       | 15000               | 15                     |
  | 150,000       | 6000                | 4                      |
  | 780,000       | 70200               | 9                      |
  | 1,250,000     | 237500              | 19                     |

@smoke_testing @rc
Scenario Outline: Modify down payment percent
  Given I navigate to the "Rate Checker" page
  When I enter $"<house_price>" as House Price amount
    And I enter "<initial_percent>" as Down Payment percent
    And I change the Down Payment percent to "<modified_percent>"
  Then I should see $"<down_payment_amount>" as Down Payment amount

Examples:
  | house_price   | initial_percent   | modified_percent  | down_payment_amount | 
  | 100,000       | 10                | 20                | 20000               |
  | 250,000       | 30                | 15                | 37500               |

@smoke_testing @rc
Scenario Outline: Modify down payment amount
  Given I navigate to the "Rate Checker" page
  When I enter $"<house_price>" as House Price amount
    And I enter "<initial_percent>" as Down Payment percent
    And I change the Down Payment amount to $"<modified_dp_amount>"
  Then I should see "<modified_percent>" as Down Payment percent

Examples:
  | house_price   | initial_percent   | modified_dp_amount | modified_percent  | 
  | 100,000       | 10                | 9000               | 9                 |
  | 250,000       | 15                | 40000              | 16                |

@smoke_testing @rc
Scenario Outline: Modify Down Payment amount then modify the House Price
  Given I navigate to the "Rate Checker" page
  When I enter $"<house_price>" as House Price amount
    And I enter "<initial_percent>" as Down Payment percent
    And I change the Down Payment amount to $"<modified_dp_amount>"
    And I change the House Price amount to $"<modified_house_price>"
  Then I should see "<modified_percent>" as Down Payment percent

Examples:
  | house_price   | initial_percent   | modified_dp_amount | modified_house_price | modified_percent  | 
  | 100,000       | 10                | 9000               | 175000               | 5                 |
  | 250,000       | 12                | 45000              | 275000               | 16                |

@smoke_testing @rc
Scenario Outline: Modify Down Payment percent then modify the House Price
  Given I navigate to the "Rate Checker" page
  When I enter $"<house_price>" as House Price amount
    And I enter "<initial_percent>" as Down Payment percent
    And I change the Down Payment percent to "<modified_percent>"
    And I change the House Price amount to $"<modified_house_price>"
  Then I should see $"<modified_dp_amount>" as Down Payment amount

Examples:
  | house_price   | initial_percent   | modified_dp_amount | modified_house_price | modified_percent  | 
  | 100000        | 10                | 35000              | 175000               | 20                |
  | 250000        | 12                | 36000              | 225000               | 16                |

@smoke_testing @rc
Scenario: Select the ARM Type
  Given I navigate to the "Rate Checker" page
  When I select "Adjustable" Rate Structure
  Then I should see "3/1" as the selected ARM Type

@smoke_testing @rc
Scenario Outline: Select 30 and 15 year Fixed Rate loans
  Given I navigate to the "Rate Checker" page
  When I select "Fixed" Rate Structure
    And I select "<total_number> Years" Loan Term
  Then I should see "District of Columbia" as the selected location
    And I should see the "Primary" Interest cost over <total_number> years
    And I should see the "Secondary" Interest cost over <total_number> years

Examples:
  | total_number |
  | 30           |
  | 15           |

@smoke_testing @rc1
Scenario Outline: Attempt to enter invalid characters as House Price
  Given I navigate to the "Rate Checker" page
  When I enter $"<invalid_characters>" as House Price amount
  Then I should see $"<hp_amount>" as the House price


Examples:
  | invalid_characters  | hp_amount | 
  | zzzz                | 200,000   |
  | 1@@2                | 12        |

@rc
Scenario: Test all dropdown lists in the Rate Checker page
  Given I navigate to the "Rate Checker" page
  When I select "Adjustable" Rate Structure
    And I select "7/1" ARM Type
    And I select "Fixed" Rate Structure
    And I select "15 Years" Loan Term
    And I select "FHA" Loan Type
