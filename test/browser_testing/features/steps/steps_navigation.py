# coding: utf-8
from behave import given, when, then
from hamcrest.core import assert_that, equal_to
from hamcrest.library.text.stringcontains import contains_string

from pages.home import Home
from pages.base import Base
from pages.utils import Utils

# XPATH LOCATORS

# RELATIVE URL'S
HOME = 'index.html'
LC = 'loan-comparison'
LO = 'loan-options'
CONV = 'loan-options/conventional-loans'
RC = 'check-rates'
FHA = 'loan-options/FHA-loans'
SPECIAL = 'loan-options/special-loan-programs'


@given(u'I navigate to the "{page_name}" page')
def step(context, page_name):
    if (page_name == 'Owning a Home'):
        context.base.go(HOME)
    elif (page_name == 'Loan Comparison'):
        context.base.go(LC)
    elif (page_name == 'Loan Options'):
        context.base.go(LO)
    elif (page_name == 'Rate Checker'):
        context.base.go(RC)
        # Wait for the chart to load
        context.base.sleep(1)
        assert_that(context.rate_checker.is_chart_loaded(), equal_to(True))
    elif (page_name == 'Conventional Loan'):
        context.base.go(CONV)
    elif (page_name == 'FHA Loan'):
        context.base.go(FHA)
    elif (page_name == 'Special Loan Programs'):
        context.base.go(SPECIAL)
    else:
        raise Exception(page_name + ' is NOT a valid page')


@given(u'I navigate to the OAH Landing page')
def step(context):
    context.base.go()


@when(u'I click on the "{link_name}" link')
def step(context, link_name):
    # Click the requested tab
    context.navigation.click_link(link_name)


@then(u'I should see "{link_name}" displayed in the page title')
def step(context, link_name):
    # Verify that the page title matches the link we clicked
    page_title = context.base.get_page_title()
    assert_that(page_title, contains_string(link_name))


@then(u'I should see the page scroll to the "{page_anchor}" section')
def step(context, page_anchor):
    current_url = context.base.get_current_url()
    assert_that(current_url, contains_string(page_anchor))


@then(u'I should be directed to the internal "{relative_url}" URL')
def step(context, relative_url):
    actual_url = context.base.get_current_url()
    expected_url = context.utils.build_url(context.base_url, relative_url)
    assert_that(actual_url, equal_to(expected_url))


@then(u'I should be directed to the external "{full_url}" URL')
def step(context, full_url):
    actual_url = context.base.get_current_url()
    assert_that(actual_url, contains_string(full_url))


@then(u'I should be directed to the OAH Landing page')
def step(context):
    actual_url = context.base.get_current_url()
    expected_url = context.utils.build_url(context.base_url, '/')
    assert_that(actual_url, equal_to(expected_url))


@then(u'I should see the "{relative_url}" URL with page title {page_title} open in a new tab')
def step(context, relative_url, page_title):
    title = context.base.switch_to_new_tab(relative_url)
    assert_that(title, contains_string(page_title))

@when(u'I click on the Learn more link inside "{section_name}"')
def step(context, section_name):
    # Click the learn more link inside "section_name"
    context.navigation.click_learn_more_link(section_name)

@when(u'I click on the Key Tools "{link_name}" link inside "{section_name}"')
def step(context, link_name, section_name):
    # Click the key tools link inside "section_name"
    context.navigation.click_key_tools_link(link_name, section_name)