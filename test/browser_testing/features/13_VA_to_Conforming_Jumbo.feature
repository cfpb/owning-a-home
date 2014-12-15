Feature: Test 13: VA to Conforming Jumbo - Purpose: check for correct behavior when you trigger a VA HB loan, but that is not available, and you get kicked out to conforming jumbo.

Background:
	Given I navigate to the "Rate Checker" page


@high_balance
Scenario Outline:
	When I select "<state_name>" as State
		And I select "VA" Loan Type
		And I enter $"500,000" as House Price amount
	Then I should see the chart faded out to indicate the data is out of date 
		And I should see a County alert "Based on your loan amount, you may not be eligible for a regular VA loan. Please enter your county so we can find the right loan type for you and get you the most accurate rates."
		And I should see the County field highlighted 

Examples:
	| state_name 	| county_name 		| VA_max_loan_amount 	| 
	| Maryland 		| Baltimore County 	| $417,000 			 	|
	| Virginia 		| Fairfax County 	| $417,000              |


@high_balance
Scenario Outline:
	When I select "<state_name>" as State
		And I select "VA" Loan Type
		And I enter $"500,000" as House Price amount
		And I select <county_name> County
	Then I should see the chart active with new data
		And I should see "Conforming jumbo" as the selected Loan Type
		And I should see the Loan Type field highlighted
		And I should see an HB alert "While VA loans do not have strict loan limits, most lenders are unlikely to make a VA loan more than <VA_max_loan_amount> in your county. Your only option may be a conforming jumbo loan."
		But I should NOT see a County alert "Based on your loan amount, you may not be eligible for a regular VA loan. Please enter your county so we can find the right loan type for you and get you the most accurate rates."

Examples:
	| state_name 	| county_name 		| VA_max_loan_amount 	| 
	| Maryland 		| Baltimore County 	| $417,000 			 	|
	| Virginia 		| Fairfax County 	| $417,000              |
