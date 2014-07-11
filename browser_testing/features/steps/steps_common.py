from behave import given, when, then
from hamcrest.core import assert_that

from pages.home import Home
from pages.base import Base


# RELATIVE URL'S
RELATIVE_URL_HOME = 'index.html'
RELATIVE_URL_LC = 'loan-comparison.html'
RELATIVE_URL_LT = 'loan-types.html'
RELATIVE_URL_RC = 'rate-checker.html'


@given(u'I navigate to the "{page_name}" page')
def step(context, page_name):
    if (page_name == 'Owning a Home'):
        context.base.go(RELATIVE_URL_HOME)
    elif (page_name == 'Loan Comparison'):
        context.base.go(RELATIVE_URL_LC)
    elif (page_name == 'Loan Types'):
        context.base.go(RELATIVE_URL_LT)
    elif (page_name == 'Rate Checker'):
        context.base.go(RELATIVE_URL_RC)


@given(u'I navigate to the Demo OAH page')
def step(context):
    context.base.go()
