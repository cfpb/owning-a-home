import os
import ConfigParser
import logging
import httplib
import base64

from datetime import datetime
from selenium import webdriver

from pages.screenshot import Screenshot
from pages.base import Base
from pages.home import Home
from pages.loan_comparison import Loan_Comparison
from pages.loan_types import Loan_Types
from pages.rate_checker import Rate_Checker


try:
    import json
except ImportError:
    import simplejson as json


def before_all(context):

    # create logger
    logger = logging.getLogger('OAH_browser_tests')
    logger.setLevel(logging.INFO)
    # create console handler and set level to debug
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    # create formatter
    formatter = logging.Formatter(
        '[%(name)s] %(asctime)s - %(levelname)s - %(message)s')
    # add formatter to ch
    ch.setFormatter(formatter)
    # add ch to logger
    logger.addHandler(ch)
    context.logger = logger

    config = ConfigParser.ConfigParser()
    config.readfp(open('features/environment.cfg'))

    if config.has_option('general', 'testing_output'):
        directory = config.get('general', 'testing_output')
    else:
        directory = 'test-results'

    if not os.path.exists(directory):
        os.makedirs(directory)

    if config.has_option('browser_testing', 'delay'):
        delay_secs = config.getint('browser_testing', 'delay')
    else:
        delay_secs = 5

    if config.has_option('browser_testing', 'base_url'):
        base_url = config.get('browser_testing', 'base_url')
    else:
        base_url = 'http://localhost'

    if config.has_option('browser_testing', 'force_logout'):
        context.force_logout = config.get('browser_testing', 'force_logout')
    else:
        context.force_logout = True

    if config.has_option('browser_testing', 'browser'):
        browser = config.get('browser_testing', 'browser')
    else:
        browser = 'Chrome'

    context.browser = browser

    if browser == 'Phantom':
        driver = webdriver.PhantomJS()

    elif browser == 'Sauce':
        logger.info("Using Sauce Labs")
        desired_capabilities = {
            'name': os.getenv('SELENIUM_NAME',
                              'OAH browser tests ') + str(datetime.now()),
            'platform': os.getenv('SELENIUM_PLATFORM', 'WINDOWS 7'),
            'browserName': os.getenv('SELENIUM_BROWSER', 'chrome'),
            'version': int(os.getenv('SELENIUM_VERSION', 33)),
            'max-duration': 7200,
            'record-video': os.getenv('SELENIUM_VIDEO', True),
            'video-upload-on-pass': os.getenv('SELENIUM_VIDEO_UPLOAD_ON_PASS',
                                              True),
            'record-screenshots': os.getenv('SELENIUM_SCREENSHOTS', False),
            'command-timeout': int(os.getenv('SELENIUM_CMD_TIMEOUT', 30)),
            'idle-timeout': int(os.getenv('SELENIUM_IDLE_TIMEOUT', 10)),
            'tunnel-identifier': os.getenv('SELENIUM_TUNNEL'),
        }

        logger.info("Running Sauce with capabilities: %s" %
                    desired_capabilities)

        sauce_config = {"username": os.getenv('SAUCE_USER'),
                        "access-key": os.getenv("SAUCE_KEY")}
        context.sauce_config = sauce_config

        driver = webdriver.Remote(
            desired_capabilities=desired_capabilities,
            command_executor="http://%s:%s@ondemand.saucelabs.com:80/wd/hub" %
            (sauce_config['username'], sauce_config['access-key'])
        )

    else:

        if config.has_option('chrome_driver', 'chromedriver_path'):
            chromedriver_path = config.get('chrome_driver',
                                           'chromedriver_path')
        else:
            chromedriver_path = ''

        driver = webdriver.Chrome(chromedriver_path)

    context.base = Base(logger, directory, base_url, driver, -1, delay_secs)
    context.home = Home(logger, directory, base_url, driver, -1, delay_secs)
    context.loan_comparison = Loan_Comparison(logger, directory,
                                              base_url, driver, -1, delay_secs)
    context.loan_types = Loan_Types(logger, directory,
                                    base_url, driver, -1, delay_secs)
    context.rate_checker = Rate_Checker(logger, directory, base_url,
                                        driver, -1, delay_secs)

    if config.has_option('browser_testing', 'take_screenshots'):
        take_screenshots = config.getboolean('browser_testing',
                                             'take_screenshots')
    else:
        take_screenshots = False

    context.screenshot = Screenshot(context.base, take_screenshots)


def before_feature(context, feature):
    context.logger.info('STARTING FEATURE %s' % feature)
    if context.browser == "Sauce":
        context.logger.info("Link to job: https://saucelabs.com/jobs/%s" %
                            context.website.driver.session_id)
        context.logger.info("SauceOnDemandSessionID=%s job-name=%s" %
                            (context.website.driver.session_id, feature.name))


def before_scenario(context, scenario):
    # Ensure each scenario starts with a full browser window.
    # When opening new windows, PhantomJS uses
    # its default window size of 400x300,
    # which is potentially problematic for responsive sites
    context.base.driver.maximize_window()
    context.logger.info('starting scenario %s with row %s' %
                        (scenario, scenario._row))
    context.logger.info('starting feature %s, scenario %s, with row %s' %
                        (scenario.feature.name, scenario.name, scenario._row))


def after_scenario(context, scenario):
    context.logger.info('finished scenario %s with row %s' %
                        (scenario, scenario._row))


def after_feature(context, feature):
    context.logger.info("Total time spent sleeping is %s" %
                        context.base.utils.time_spent_sleeping)


def after_all(context):
    context.base.close_browser()
    if context.browser == 'Sauce':
        base64string = base64.encodestring('%s:%s' %
                                           (context.sauce_config['username'],
                                            context.sauce_config['access-key']
                                            ))[:-1]

        body_content = json.dumps({"passed": not context.failed})
        context.logger.info("Updating sauce job with %s" % body_content)
        connection = httplib.HTTPConnection("saucelabs.com")
        connection.request('PUT', '/rest/v1/%s/jobs/%s' %
                           (context.sauce_config['username'],
                            context.website.driver.session_id),
                           body_content,
                           headers={"Authorization": "Basic %s" %
                                    base64string})
        result = connection.getresponse()
        context.logger.info(result.read())
        context.logger.info("Sauce update status: %s" % result.status)
