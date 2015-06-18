# coding: utf-8
from behave import given, when, then
from hamcrest.core import assert_that, equal_to
from hamcrest.library.text.stringcontains import contains_string
from decorators import *

from pages.home import Home
from pages.base import Base
from pages.utils import Utils
from pages.journey import Journey


@then(u'I see page loaded')
def navbar_is_loaded(context):
    assert_that( context.journey.is_navbar_found(), equal_to(True), 'Navbar found')

@then(u'All local links are working')
def local_links_working(context):
    # "local" link is one that points to /process/XXX
    assert_that( context.journey.check_all_links_on_page(context.base_url + '/process'),
                equal_to([]),
                'Broken links on <%s>' % context.base.get_current_url() )
