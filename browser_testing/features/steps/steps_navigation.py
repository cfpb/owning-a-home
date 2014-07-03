from behave import given, when, then
from hamcrest.core import assert_that
from hamcrest.library.text.stringcontains import contains_string

from pages.home import Home
from pages.base import Base

# XPATH LOCATORS
OWNING_A_HOME = "//li/a[@href='index.html']"
LOAN_COMPARISON = "//li/a[@href='loan-comparison.html']"
LOAN_TYPES = "//li/a[@href='loan-types.html']"
RATE_CHECKER = "//li/a[@href='rate-checker.html']"


@when(u'I click on the "{link_name}"')
def step(context, link_name):
    # Click the requested tab
    if (link_name == 'Owning a Home'):
        context.navigation.click_tab(OWNING_A_HOME)
    elif (link_name == 'Loan Comparison'):
        context.navigation.click_tab(LOAN_COMPARISON)
    elif (link_name == 'Loan Types'):
        context.navigation.click_tab(LOAN_TYPES)
    elif (link_name == 'Rate Checker'):
        context.navigation.click_tab(RATE_CHECKER)


@then(u'I should see "{link_name}" displayed in the page title')
def step(context, link_name):
    # Verify that the page title matches the link we clicked
    assert_that(context.base.get_page_title(), contains_string(link_name))
