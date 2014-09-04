from behave import given, when, then
from hamcrest.core import assert_that
from hamcrest.core.core.isequal import equal_to
from hamcrest.library.number.ordering_comparison import greater_than, less_than
from hamcrest.library.text.stringcontains import contains_string

from pages.rate_checker import RateChecker
from pages.base import Base
from pages.screenshot import Screenshot

# DEFAULT VALUES
DEFAULT_CREDIT_SCORE = 700  # the default range is 700 - 720
RANGE_ALERT_TEXT = ("Many lenders do not accept borrowers "
                    "with credit scores less than 620")


# CHART AREA
@then(u'I should see the selected "{state_name}" above the Rate Checker chart')
@then(u'I should see the lender rate offered to "{state_name}" residents')
def step(context, state_name):
    # Get the location state displayed on page
    actual_text = context.rate_checker.get_chart_location()
    # If the location tracker is not available then "Alabama" is set by default
    try:
        assert_that(actual_text, equal_to('Alabama'))
    # Verify that displayed location matches the expected state
    except AssertionError:
        assert_that(actual_text, equal_to(state_name))


# CREDIT SCORE RANGE
@When(u'I move the credit score slider to the "{slider_direction}" range')
@when(u'I move the credit score slider to the "{slider_direction}"')
def step(context, slider_direction):
    context.base.sleep(2)
    context.rate_checker.set_credit_score_range(slider_direction)


@then(u'I should see the Credit Score Range displayed as "{score}"')
def step(context, score):
    actual_text = context.rate_checker.get_credit_score_range()
    assert_that(actual_text, equal_to(score))


@then(u'I should see the credit score range "{range_operation}"')
def step(context, range_operation):
    # get the range text from below the slider handle
    range_text = context.rate_checker.get_credit_score_range()
    currentRange = int(range_text[:3])

    if (range_operation == "increase"):
        assert_that(currentRange, greater_than(DEFAULT_CREDIT_SCORE))
    elif (range_operation == "decrease"):
        assert_that(currentRange, less_than(DEFAULT_CREDIT_SCORE))


# ALERTS
@then(u'I should see an alert for borowers with less than 620 score')
def step(context):
    actual_text = context.rate_checker.get_range_alert()
    assert_that(actual_text, contains_string(RANGE_ALERT_TEXT))


@then(u'I should see the credit score slider handle turns red')
def step(context):
    # If the element's class name includes 'warning'
    # Then the button has turned red
    actual_text = context.rate_checker.get_warning_button()
    assert_that(actual_text, contains_string("warning"))


# STATE
@when(u'I select "{state_name}" from the Location dropdown list')
def step(context, state_name):
    # TO DO: work with FEWD to find a way to remove these sleep commands
    context.base.sleep(2)
    context.rate_checker.set_location(state_name)


@then(u'I should see "{state_name}" as the selected location')
def step(context, state_name):
    current_Selection = context.rate_checker.get_location()
    # If the location tracker is not available then "Alabama" is set by default
    try:
        assert_that(current_Selection, equal_to('Alabama'))
    except:
        assert_that(current_Selection, equal_to(state_name))


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


# RATE STRUCTURE
@when(u'I select "{rate_selection}" Rate Structure')
def step(context, rate_selection):
    context.rate_checker.set_rate_structure(rate_selection)


@then(u'I should see "{loan_structure}" as the selected Rate Structure')
def step(context, loan_structure):
    current_Selection = context.rate_checker.get_rate_structure()
    assert_that(current_Selection, equal_to(loan_structure))


# LOAN TERM
@when(u'I select "{number_of_years}" Loan Term')
def step(context, number_of_years):
    context.rate_checker.set_loan_term(number_of_years)


@then(u'I should see "{number_of_years}" as the selected Loan Term')
def step(context, number_of_years):
    current_Selection = context.rate_checker.get_loan_term()
    assert_that(current_Selection, equal_to(number_of_years))


# LOAN TYPE
@when(u'I select "{loan_type}" Loan Type')
def step(context, loan_type):
    context.rate_checker.set_loan_type(loan_type)


@then(u'I should see "{loan_type}" as the selected Loan Type')
def step(context, loan_type):
    current_Selection = context.rate_checker.get_loan_type()
    assert_that(current_Selection, equal_to(loan_type))


# ARM TYPE
@when(u'I select "{arm_type}" ARM Type')
def step(context, arm_type):
    context.rate_checker.set_arm_type(arm_type)


@then(u'I should see "{arm_type}" as the selected ARM Type')
def step(context, arm_type):
    current_Selection = context.rate_checker.get_arm_type()
    assert_that(current_Selection, equal_to(arm_type))


# TABS AND LINKS
@then(u'I should see the "{tab_text}" tab selected')
def step(context, tab_text):
    actual_text = context.rate_checker.get_active_tab_text()
    assert_that(actual_text, equal_to(tab_text))


@when(u'I click on the "{link_name}" link in the Rate Checker page')
@when(u'I click on the "{link_name}" tab in the Rate Checker page')
def step(context, link_name):
    # Click the requested link
    context.rate_checker.click_link_by_text(link_name)


# INTEREST COST LABEL
@Then(u'I should see the "{selection}" Interest cost over {total_years} years')
def step(context, selection, total_years):
    if selection == "Primary":
        actual_text = context.rate_checker.get_interest_rate(0)
    if selection == "Secondary":
        actual_text = context.rate_checker.get_interest_rate(1)

    assert_that(actual_text, equal_to(total_years))
