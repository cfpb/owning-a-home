# coding: utf-8
from behave import given, when, then
from hamcrest.core import assert_that, equal_to

from pages.base import Base
from pages.loan_comparison import LoanComparison


# LOAN COLUMNS
@then('I should see the "{loan_column}" column')
def step(context, loan_column):
    is_present = context.loan_comparison.is_column_present(loan_column)
    assert_that(is_present, equal_to(True))


@then('I should NOT see the "{loan_column}" column')
def step(context, loan_column):
    is_present = context.loan_comparison.is_column_present(loan_column)
    assert_that(is_present, equal_to(False))


# ADD LOAN
@when('I click Add another loan')
@when('I click Add another loan again')
def step(context):
    context.loan_comparison.click_add_another_loan()


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
@then(u'I should see "{expected_amount}" as default Loan Amount for "{loan_column}"')
def step_impl(context, expected_amount, loan_column):
    displayed_amount = context.loan_comparison.get_loan_amount(loan_column)
    assert_that(displayed_amount, equal_to(expected_amount))


# HOUSE PRICE
@then(u'I should see "{expected_price}" as default House Price for "{loan_column}"')
def step(context, expected_price, loan_column):
    displayed_amount = context.loan_comparison.get_house_price(loan_column)
    assert_that(displayed_amount, equal_to(expected_price))


# DOWN PAYMENT PERCENT
@then(u'I should see "{expected_value}" as default Down Payment percent for "{loan_column}"')
def step(context, expected_value, loan_column):
    actual_value = context.loan_comparison.get_down_payment_percent(loan_column)
    assert_that(actual_value, equal_to(expected_value))


# DOWN PAYMENT AMOUNT
@then(u'I should see "{expected_value}" as default Down Payment amount for "{loan_column}"')
def step(context, expected_value, loan_column):
    actual_value = context.loan_comparison.get_down_payment_amount(loan_column)
    assert_that(actual_value, equal_to(expected_value))


# RATE STRUCTURE
@then(u'I should see "{expected_value}" as default Rate Structure for "{loan_column}"')
def step(context, expected_value, loan_column):
    actual_value = context.loan_comparison.get_rate_structure(loan_column)
    assert_that(actual_value, equal_to(expected_value))


# LOAN TERM
@then(u'I should see "{expected_value}" as default Loan Term for "{loan_column}"')
def step(context, expected_value, loan_column):
    actual_value = context.loan_comparison.get_loan_term(loan_column)
    assert_that(actual_value, equal_to(expected_value))


# LOAN TYPE
@then(u'I should see "{expected_value}" as default Loan Type for "{loan_column}"')
def step(context, expected_value, loan_column):
    actual_value = context.loan_comparison.get_selected_loan_type(loan_column)
    assert_that(actual_value, equal_to(expected_value))


# ARM TYPE
@then(u'I should see "{expected_value}" as default ARM Type for "{loan_column}"')
def step(context, expected_value, loan_column):
    actual_value = context.loan_comparison.get_arm_type(loan_column)
    assert_that(actual_value, equal_to(expected_value))


# DISCOUNT POINTS AND CREDITS
@then(u'I should see "{expected_points}" as default Discount point and credits for "{loan_column}"')
def step(context, expected_points, loan_column):
    actual_points = context.loan_comparison.get_selected_points(loan_column)
    assert_that(actual_points, equal_to(expected_points))


# INTEREST RATE
@then(u'I should see "{expected_value}" as default Interest Rate for "{loan_column}"')
def step(context, expected_value, loan_column):
    actual_value = context.loan_comparison.get_interest_rate(loan_column)
    assert_that(actual_value, equal_to(expected_value))
