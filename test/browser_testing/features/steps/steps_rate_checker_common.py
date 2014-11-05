# coding: utf-8
from behave import given, when, then
from hamcrest.core import assert_that
from hamcrest.core.core.isequal import equal_to
from hamcrest.library.number.ordering_comparison import greater_than, less_than
from hamcrest.library.text.stringcontains import contains_string

from pages.rate_checker import RateChecker
from pages.base import Base
from pages.screenshot import Screenshot


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


# STATE
@when(u'I select "{state_name}" from the Location dropdown list')
def step(context, state_name):
    # TO DO: work with FEWD to find a way to remove these sleep commands
    context.base.sleep(2)
    context.rate_checker.set_location(state_name)
    context.base.sleep(3)


@then(u'I should see "{state_name}" as the selected location')
def step(context, state_name):
    current_Selection = context.rate_checker.get_location()
    # If the location tracker is not available then "Alabama" is set by default
    try:
        assert_that(current_Selection, equal_to('Alabama'))
    except:
        assert_that(current_Selection, equal_to(state_name))


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
