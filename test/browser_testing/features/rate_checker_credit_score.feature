Feature: Test the "Credit score range" slider
  As a first time visitor to the Rate Checker page
  I want to utilize the Rate Checker tool
  So that I can make informed choices when shopping for a mortgage loan

Background:
  Given I navigate to the "Rate Checker" page

@smoke_testing @credit_score
Scenario: Decrease credit score range
  When I move the credit score slider to the "left"
  Then I should see the credit score range "decrease"

@smoke_testing @credit_score
Scenario: Increase credit score range
  When I move the credit score slider to the "right"
  Then I should see the credit score range "increase"

@smoke_testing @credit_score1
Scenario: Lowest credit score range alerts
  When I move the credit score slider to the "lowest" range
  Then I should see the credit score slider handle turns red
  	And I should see an alert for borowers with less than 620 score

@smoke_testing @credit_score1
Scenario: Lowest credit score range alerts
  When I move the credit score slider to the "lowest" range
  	And I move the credit score slider to the "right"
  Then I should NOT see an alert for borowers with less than 620 score
