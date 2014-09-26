Feature: verify the Rate Checker tool works according to requirements
  As a first time visitor to the Rate Checker page
  I want to utilize the Rate Checker tool
  So that I can make informed choices when shopping for a mortgage loan

Background:
  Given I navigate to the "Rate Checker" page

@smoke_testing @rc
Scenario Outline: Select different states
  When I select "<state_name>" from the Location dropdown list
  Then I should see the selected "<state_name>" above the Rate Checker chart

Examples:
  | state_name      |
  | Nevada          |
  | California			|
  | Virginia		    |

@smoke_testing @rc  
Scenario Outline: Calculate loan amount
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
  When I select "Adjustable" Rate Structure
  Then I should see "3/1" as the selected ARM Type

@smoke_testing @rc
Scenario Outline: Select 30 and 15 year Fixed Rate loans
  When I select "Fixed" Rate Structure
    And I select "<total_number> Years" Loan Term
  Then I should see "District of Columbia" as the selected location
    And I should see the "Primary" Interest cost over <total_number> years
    And I should see the "Secondary" Interest cost over <total_number> years

Examples:
  | total_number |
  | 30           |
  | 15           |

@smoke_testing @rc
Scenario Outline: Attempt to enter invalid characters as House Price
  When I enter $"<invalid_characters>" as House Price amount
  Then I should see $"<hp_amount>" as the House price


Examples:
  | invalid_characters  | hp_amount | 
  | zzzz                | 200,000   |
  | 1@@2                | 12        |

@rc
Scenario: Test all dropdown lists in the Rate Checker page
  When I select "Adjustable" Rate Structure
    And I select "7/1" ARM Type
    And I select "Fixed" Rate Structure
    And I select "15 Years" Loan Term
    And I select "FHA" Loan Type
