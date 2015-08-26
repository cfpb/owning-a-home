# coding: utf-8
from behave import given, when, then
from hamcrest.core import assert_that, equal_to
from hamcrest.library.text.stringcontains import contains_string
from decorators import *

from pages.home import Home
from pages.base import Base
from pages.utils import Utils

@then(u'Links are working without 404 errors')
def links_working_without_404s(context):
    assert_that( context.base.check_links_for_404s(context.base_url),
                equal_to([]),
                'Broken links on <%s>' % context.base.get_current_url() )
