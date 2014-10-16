from behave import given, when, then
from hamcrest.core import assert_that
from hamcrest.core.core.isequal import equal_to
from hamcrest.library.number.ordering_comparison import greater_than, less_than
from hamcrest.library.text.stringcontains import contains_string

from pages.rate_checker import RateChecker
from pages.base import Base
from pages.screenshot import Screenshot


# HOUSE PRICE
@when(u'I enter $"{house_price}" as House Price amount')
@when(u'I change the House Price amount to $"{house_price}"')
def step(context, house_price):
    context.rate_checker.set_house_price(house_price)


@then(u'I should see $"{house_price}" as the House price')
def step(context, house_price):
    current_Amount = context.rate_checker.get_house_price()
    assert_that(current_Amount, equal_to(house_price))


# DOWN PAYMENT PERCENT
@given(u'I enter "{down_payment}" as Down Payment percent')
@when(u'I enter "{down_payment}" as Down Payment percent')
@when(u'I change the Down Payment percent to "{down_payment}"')
def step(context, down_payment):
    context.rate_checker.set_down_payment_percent(down_payment)


@then(u'I should see "{dp_percent}" as Down Payment percent')
def step(context, dp_percent):
    current_Percent = context.rate_checker.get_down_payment_percent()
    assert_that(current_Percent, equal_to(dp_percent))


# DOWN PAYMENT AMOUNT
@when(u'I enter $"{dp_amount}" as Down Payment amount')
@when(u'I change the Down Payment amount to $"{dp_amount}"')
def step(context, dp_amount):
    context.rate_checker.set_down_payment_amount(dp_amount)


@then(u'I should see $"{dp_amount}" as Down Payment amount')
def step(context, dp_amount):
    current_Amount = context.rate_checker.get_down_payment_amount()
    assert_that(current_Amount, equal_to(dp_amount))


# LOAN AMOUNT
@then(u'I should see "{expected_loan_amount}" as Loan Amount')
def step(context, expected_loan_amount):
    actual_loan_amount = context.rate_checker.get_loan_amount()
    assert_that(actual_loan_amount, equal_to(expected_loan_amount))
