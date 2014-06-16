from behave import given, when, then
from hamcrest import *
from pages.rate_checker import *
from pages.base import *

# DEFAULT VALUES
__author__ = 'CFPBLabs'
DEFAULT_CREDIT_SCORE = 700 #the default range is 700 - 720

@when(u'I move the credit score slider to the "{slider_direction}"')
def step(context, slider_direction):
	context.rate_checker.move_slider(slider_direction)

@when(u'I select "{state_name}" from the Location dropdown list')
def step(context, state_name):
	context.base.sleep(5) # UGLY CODE # Wait for Google location tracker to update your location
	context.rate_checker.set_location(state_name)
	context.base.sleep(5) # UGLY CODE #

@when(u'I enter $"{house_price}" as House Price amount')
def step(context, house_price):
	context.rate_checker.set_house_price(house_price)

@when(u'I enter $"{down_payment}" as Down Payment amount')
def step(context, down_payment):
	context.rate_checker.set_down_payment(down_payment)

@then(u'I should see "{expected_loan_amount}" displayed as Loan Amount')
def step(context, expected_loan_amount):
	actual_loan_amount = context.rate_checker.get_loan_amount()
	assert_that(actual_loan_amount, equal_to(expected_loan_amount))

@then(u'I should see the selected "{state_name}" above the Rate Checker chart')
@then(u'I should see the lender rate offered to "{state_name}" residents')
def step(context, state_name):
	# Get the location state displayed on page
	actual_text = context.rate_checker.get_chart_location()
	# Verify that displayed location matches the expected state
	assert_that(actual_text, equal_to(state_name))

@then(u'I should see the credit score range "{range_operation}"')
def step(context, range_operation):
	# get the range AFTER we move the slider
	currentRange = context.rate_checker.get_credit_score_range()

	if (range_operation == "increase"):
		assert_that(currentRange, greater_than(DEFAULT_CREDIT_SCORE))
	elif (range_operation == "decrease"):
		assert_that(currentRange, less_than(DEFAULT_CREDIT_SCORE))

@then(u'I should see the default Credit Score Range displayed as "{default_text}"')
def step(context, default_text):
  	actual_text = context.rate_checker.get_credit_score_text()
  	assert_that(actual_text, equal_to(default_text))

@then(u'I should see "{state_name}" as the selected location')
def step(context, state_name):
 	current_Selection = context.rate_checker.get_selected_location() 
 	assert_that(current_Selection, equal_to(state_name))

@then(u'I should see "{number_of_years}" as the selected Loan Term')
def step(context, number_of_years):
 	current_Selection = context.rate_checker.get_selected_loan_term() 
 	assert_that(current_Selection, equal_to(number_of_years))

@then(u'I should see "{loan_structure}" as the selected Rate Structure')
def step(context, loan_structure):
	current_Selection = context.rate_checker.get_selected_rate_structure() 
 	assert_that(current_Selection, equal_to(loan_structure))

@then(u'I should see "{loan_type}" as the selected Loan Type')
def step(context, loan_type):
	current_Selection = context.rate_checker.get_selected_loan_type() 
 	assert_that(current_Selection, equal_to(loan_type))



@then(u'I should see "{down_payment_percent}" displayed as Down Payment percentage')
def step(context, down_payment_percent):
	current_Percent = context.rate_checker.get_down_payment_percent() 
 	assert_that(current_Percent, equal_to(down_payment_percent))

@then(u'I should see $"{down_payment}" as the default Down Payment amount')
def step(context, down_payment):
	current_Amount = context.rate_checker.get_default_down_payment_amount() 
 	assert_that(current_Amount, equal_to(down_payment_percent))
 	
@then(u'I should see "{10}" as the default Down Payment percentage')
def step(context, down_payment):
	current_Percent = context.rate_checker.get_default_down_payment_percent() 
 	assert_that(current_Percent, equal_to(down_payment))

@then(u'I should see $"{house_price}" as the default House price')
def step(context, house_price):
	current_Amount = context.rate_checker.get_default_house_price() 
 	assert_that(current_Amount, equal_to(house_price))
