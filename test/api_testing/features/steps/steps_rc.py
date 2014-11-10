from behave import given, when, then
from hamcrest.core import assert_that, equal_to
from hamcrest.library.number.ordering_comparison import greater_than
import requests
import json
import logging

from hamcrest.library.text.stringcontains import contains_string


@given(u'I select "{house_price}" as House Price')
def step(context, house_price):
    context.query.house_price = house_price


@given(u'I omit the "{param_name}" field')
def step(context, param_name):
    if(param_name == "House Price"):
        context.query.house_price = "missing"
    elif(param_name == "Loan Amount"):
        context.query.loan_amount = "missing"
    elif(param_name == "Minimum Credit Score"):
        context.query.minfico = "missing"
    elif(param_name == "Maximum Credit Score"):
        context.query.maxfico = "missing"
    elif(param_name == "State"):
        context.query.state = "missing"
    elif(param_name == "Rate Structure"):
        context.query.rate_structure = "missing"
    elif(param_name == "Loan Term"):
        context.query.loan_term = "missing"
    elif(param_name == "Loan Type"):
        context.query.loan_type = "missing"
    elif(param_name == "ARM Type"):
        context.query.arm_type = "missing"


@given(u'I select "{loan_amount}" as Loan Amount')
def step(context, loan_amount):
    context.query.loan_amount = loan_amount


@given(u'I select my minimum credit score as "{minfico}"')
def step(context, minfico):
    context.query.minfico = minfico


@given(u'I select my maximum credit score as "{maxfico}"')
def step(context, maxfico):
    context.query.maxfico = maxfico


@given(u'I select "{state}" as State')
def step(context, state):
    context.query.state = state


@given(u'I select "{rate_structure}" as Rate Structure')
def step(context, rate_structure):
    context.query.rate_structure = rate_structure


@given(u'I select "{loan_term}" as Loan Term')
def step(context, loan_term):
    context.query.loan_term = loan_term


@given(u'I select "{loan_type}" as Loan Type')
def step(context, loan_type):
    context.query.loan_type = loan_type


@given(u'I select "{arm_type}" as ARM Type')
def step(context, arm_type):
    context.query.arm_type = arm_type


@when(u'I send the request')
def step(context):
    query_string = context.query.build()
    context.logger.debug("Query string is: %s" % query_string)

    context.response = requests.get(context.base_url, params=query_string)
    context.logger.debug("URL is : %s" % context.response.url)


@then(u'the response should include a timestamp field')
def step(context):
    context.json_data = json.loads(context.response.text)
    context.logger.debug("timestamp is: %s" % context.json_data['timestamp'])
    assert_that(len(context.json_data[u'timestamp']), greater_than(0))


@then(u'the response should include a data field')
def step(context):
    context.json_data = json.loads(context.response.text)
    context.logger.debug("JSON data is: %s" % context.json_data['data'])

    assert_that(len(context.json_data[u'data']), greater_than(0))


@then(u'The response should state that required parameter "{param_name}" is missing')
def step(context, param_name):
    expected_reponse = "Required parameter '" + param_name + "' is missing"
    context.json_data = json.loads(context.response.text)

    context.logger.debug("JSON detail is: %s" % context.json_data['detail'])
    context.logger.debug("JSON text is: %s" % context.response.text)

    assert_that(context.json_data['detail'], equal_to(expected_reponse))
