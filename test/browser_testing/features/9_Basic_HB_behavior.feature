Feature: Test 9: Basic HB behavior with VA, HP first - Extra high balance behavior with VA - Purpose: check for correct behavior when you trigger a VA HB loan, changing your HP first

Background:
  Given I navigate to the "Rate Checker" page

@high_balance
Scenario Outline:
	When I select "<state_name>" as State
		And I enter $"500,000" as House Price amount
	Then I should see the chart faded out to indicate the data is out of date
		And I should see a County alert "Based on your loan amount, you may not be eligible for a regular (conforming) conventional loan. Please enter your county so we can find the right loan type for you and get you the most accurate rates."
		And I should see the County field highlighted

Examples:
| state_name 		| 
| California 		|
| Colorado 			|
| Florida 			|
| Idaho 			|
| Maryland 			|
| North Carolina 	|
| Virginia 			|
| Washington        |

@high_balance
Scenario Outline:
	When I select "<state_name>" as State
		And I enter $"500,000" as House Price amount
		And I change to "VA" Loan Type
	Then I should see the chart faded out to indicate the data is out of date
		And I should see a County alert "Based on your loan amount, you may not be eligible for a regular VA loan. Please enter your county so we can find the right loan type for you and get you the most accurate rates."
		And I should see the County field highlighted

Examples:
| state_name 		| 
| California 		|
| Colorado 			|
| Florida 			|
| Idaho 			|
| Maryland 			|
| North Carolina 	|
| Virginia 			|
| Washington        |


@high_balance
Scenario Outline:
	When I select "<state_name>" as State
		And I enter $"500,000" as House Price amount
		And I change to "VA" Loan Type
		And I select <county_name> County
	Then I should see the chart active with new data
		And I should see "VA high-balance" as the selected Loan Type
		And I should see the Loan Type field highlighted
		And I should see an HB alert "When you borrow between $417,000 and <VA_max_loan_amount> in your county, you may be eligible for a high-balance VA loan."
		But I should NOT see the County field highlighted
		But I should NOT see a County alert "Based on your loan amount, you may not be eligible for a regular FHA loan. Please enter your county so we can find the right loan type for you and get you the most accurate rates."

Examples:
| state_name 		| county_name 			| VA_max_loan_amount 	|
| California 		| Mono County 			| $529,000 				|
| Colorado 			| San Miguel County 	| $625,500 				|
| Florida 			| Monroe County 		| $529,000				|
| Idaho 			| Blaine County 		| $625,500 				|
| Maryland 			| Anne Arundel County 	| $500,000 				|
| North Carolina 	| Gates County 			| $458,850 				|
| Virginia 			| Norfolk city 			| $458,850 				|
| Washington 		| Snohomish County 		| $506,000              |

Scenario Outline:
	When I select "<state_name>" as State
		And I select "VA" Loan Type
		And I enter $"700,000" as House Price amount
	Then I should see the chart faded out to indicate the data is out of date
		And I should see a County alert "Based on your loan amount, you may not be eligible for a regular VA loan. Please enter your county so we can find the right loan type for you and get you the most accurate rates."
		And I should see the County field highlighted

Examples:
	| state_name 	| county_name 				| VA_max_loan_amount 	| 
	| California 	| Alameda County 			| $1,050,000 			|
	| California 	| San Francisco County 		| $1,050,000 			|
	| Colorado 		| Garfield County 			| $781,250 				|
	| Hawaii 		| Honolulu County 			| $721,050 				|
	| Maryland 		| Prince George's County 	| $692,500 				|
	| New Jersey 	| Hudson County 			| $978,750 				|
	| New York 		| Kings County 				| $978,050 				|
	| Virginia 		| Culpeper County 			| $692,500 				|
	| West Virginia | Jefferson County 			| $692,500              |

@county
Scenario Outline:
	When I select "<state_name>" as State
		And I select "VA" Loan Type
		And I enter $"700,000" as House Price amount
		And I select <county_name> County
	Then I should see the chart active with new data
		And I should see "VA high-balance" as the selected Loan Type
		And I should see the Loan Type field highlighted
		And I should see an HB alert "When you borrow between $417,000 and <VA_max_loan_amount> in your county, you may be eligible for a high-balance VA loan."
		But I should NOT see the County field highlighted
		But I should NOT see a County alert "Based on your loan amount, you may not be eligible for a regular VA loan. Please enter your county so we can find the right loan type for you and get you the most accurate rates."

Examples:
	| state_name 	| county_name 				| VA_max_loan_amount 	| 
	| California 	| Alameda County 			| $1,050,000 			|
	| California 	| San Francisco County 		| $1,050,000 			|
	| Colorado 		| Garfield County 			| $781,250 				|
	| Hawaii 		| Honolulu County 			| $721,050 				|
	| Maryland 		| Prince George's County 	| $692,500 				|
	| New Jersey 	| Hudson County 			| $978,750 				|
	| New York 		| Kings County 				| $978,750 				|
	| Virginia 		| Culpeper County 			| $692,500 				|
	| West Virginia | Jefferson County 			| $692,500 				|
