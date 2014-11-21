Feature: Feature: Test the FHA-HB warnings and selections
  As a first time visitor to the Rate Checker page
  I want to see FHA High Balance alerts
  So that I can make informed choices when shopping for an FHA loan

@high_balance
Scenario Outline: Trigger the County warning - Purpose: This test looks for correct behavior in triggering an FHA high-balance situation.
  Given I navigate to the "Rate Checker" page
	And I select "<state_name>" from the Location dropdown list
	And I enter $"350,000" as House Price amount
  When I select "FHA" Loan Type
  Then I should see a County alert "Based on your loan amount, you may not be eligible for a regular FHA loan. Please enter your county so we can find the right loan type for you and get you the most accurate rates."
    #And I should see the chart faded out to indicate the data is out of date

Examples:
	| state_name 	| 
	| Georgia 		| 
	| Illinois 		|
	| Maryland 		|
	| New Jersey 	| 
	| Oregon 		| 
	| Pennsylvania 	|
	| Virginia 		|
	| Wisconsin     |

@high_balance
Scenario Outline: Triggering FHA High Balance loan warning - Purpose: This test looks for correct behavior in triggering an FHA high-balance situation.
  Given I navigate to the "Rate Checker" page
	And I select "<state_name>" from the Location dropdown list
	And I enter $"350,000" as House Price amount
  	And I select "FHA" Loan Type
  When I select <county_name> County
  Then I should NOT see a County alert "Based on your loan amount, you may not be eligible for a regular FHA loan. Please enter your county so we can find the right loan type for you and get you the most accurate rates."
	And I should see "FHA-HB" as the selected Loan Type
	And I should see an HB alert "When you borrow between $271,050 and <FHA_max_loan_amount> in your county, you are eligible for a high-balance FHA loan"
	#And the chart should be active with new data.

Examples:
	| state_name 	| county_name 		| FHA_max_loan_amount   |
	| Georgia 		| Cobb County 		| $320,850 		    	|
	| Illinois 		| Kane County 		| $365,700 				|
	| Maryland 		| Baltimore city 	| $494,500 				|
	| New Jersey 	| Monmouth County 	| $625,500 				|
	| Oregon 		| Hood River County | $371,450 				|
	| Pennsylvania 	| Lehigh County 	| $372,600 				|
	| Virginia 		| Amelia County 	| $535,900 				|
	| Wisconsin 	| St. Croix County 	| $318,550              |

@high_balance
Scenario Outline: Triggering a Conventional loan when FHA high balance is not available
# This test currently fails, pending work on issue #625
  Given I navigate to the "Rate Checker" page
    And I select "<state_name>" from the Location dropdown list
	And I enter $"350,000" as House Price amount
	And I select "FHA" Loan Type
  When I select <county_name> County
  Then I should see an HB alert "You are not eligible for an FHA loan when you borrow more than <FHA_max_loan_amount> in your county. You are eligible for a conventional loan."
	#And I should see the chart faded out to indicate the data is out of date
    #And I should see "Conventional" as the selected Loan Type
	#And the chart should be active with new data.

Examples:
| state_name | county_name 		 | FHA_max_loan_amount |
| Alabama 	 | Bibb County 		 | $271,050 		   |
| Arizona    | Apache County 	 | $271,050            |
| Colorado   | Morgan County 	 | $271,050 		   |
| Florida    | Okeechobee County | $271,050            |
| Indiana 	 | Monroe County 	 | $271,050 		   |
| Utah 		 | Salt Lake County  | $300,150            |
| Kansas 	 | Johnson County    | $278,300 		   |
| Montana 	 | Missoula County   | $282,900            |

@jumbo
Scenario Outline: Trigger jumbo loan
  Given I navigate to the "Rate Checker" page
    And I select "<state_name>" from the Location dropdown list
	And I select "FHA" Loan Type
	And I enter $"500,000" as House Price amount
  When I select <county_name> County
  Then I should see "Conforming Jumbo" as the selected Loan Type
  And I should see an HB alert "You are not eligible for an FHA loan when you borrow more than <FHA_max_loan_amount> in your county. You are eligible for a conforming jumbo loan."
     #And the chart should be active with new data.

Examples:
| state_name | county_name            | FHA_max_loan_amount |
| Hawaii     | Hawaii County          | $368,000            |
| Utah       | Toolele County         | $300,150            |
| Alaska     | Anchorage Municipality | $355,350            |
