from behave import given, when, then
from hamcrest.core import assert_that, equal_to

from pages.base import Base
from pages.loan_comparison import LoanComparison


# LOAN COMPARISON COLUMNS
@then(u'I should see the "{column_name}" column enabled')
def step(context, column_name):
    column_present = context.loan_comparison.is_column_present(column_name)
    assert_that(column_present, equal_to(True))


@then(u'I should NOT see the "{column_name}" column')
def step(context, column_name):
    column_present = context.loan_comparison.is_column_present(column_name)
    assert_that(column_present, equal_to(False))


# STATE
@then(u'I should see "{state_name}" as default State')
def step(context, state_name):
    selected_state = context.loan_comparison.get_location()
    assert_that(selected_state, equal_to(state_name))


# CREDIT SCORE
@then(u'I should see "{expected_score}" as default Credit Score')
def step(context, expected_score):
    selected_score = context.loan_comparison.get_credit_score()
    assert_that(selected_score, equal_to(expected_score))


# LOAN AMOUNT DISPLAY
@then(u'I should see "{expected_amount}" as default Loan Amount')
def step_impl(context, expected_amount):
    displayed_amount = context.loan_comparison.get_loan_amount()
    assert_that(displayed_amount, equal_to(expected_amount))


# HOUSE PRICE
@then(u'I should see "{expected_price}" as default House Price')
def step(context, expected_price):
    displayed_amount = context.loan_comparison.get_house_price()
    assert_that(displayed_amount, equal_to(expected_price))


# DOWN PAYMENT PERCENT
@then(u'I should see "{expected_value}" as default Down Payment percent')
def step(context, expected_value):
    actual_value = context.loan_comparison.get_down_payment_percent()
    assert_that(actual_value, equal_to(expected_value))


# DOWN PAYMENT AMOUNT
@then(u'I should see "{expected_value}" as default Down Payment amount')
def step(context, expected_value):
    actual_value = context.loan_comparison.get_down_payment_amount()
    assert_that(actual_value, equal_to(expected_value))


# RATE STRUCTURE
@then(u'I should see "{expected_value}" as default Rate Structure')
def step(context, expected_value):
    actual_value = context.loan_comparison.get_rate_structure()
    assert_that(actual_value, equal_to(expected_value))


# LOAN TERM
@then(u'I should see "{expected_value}" as default Loan Term')
def step(context, expected_value):
    actual_value = context.loan_comparison.get_loan_term()
    assert_that(actual_value, equal_to(expected_value))


# LOAN TYPE
@then(u'I should see "{expected_value}" as default Loan Type')
def step(context, expected_value):
    actual_value = context.loan_comparison.get_loan_type()
    assert_that(actual_value, equal_to(expected_value))


# ARM TYPE
@then(u'I should see "{expected_value}" as default ARM Type')
def step(context, expected_value):
    actual_value = context.loan_comparison.get_arm_type()
    assert_that(actual_value, equal_to(expected_value))


# INTEREST RATE
@then(u'I should see "{expected_value}" as default Interest Rate')
def step(context, expected_value):
    actual_value = context.loan_comparison.get_interest_rate()
    assert_that(actual_value, equal_to(expected_value))
