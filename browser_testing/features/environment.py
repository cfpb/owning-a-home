import os
import ConfigParser
import logging
import httplib
import base64
from datetime import *
from selenium import webdriver

from pages.screenshot import *
from pages.base import *
from pages.home import *
from pages.loan_comparison import *
from pages.loan_types import *
from pages.rate_checker import *


try:
    import json
except ImportError:
    import simplejson as json


__author__ = 'CFPBLabs'


def before_all(context):

    logger = logging.getLogger('cfgov_browser_tests')
    logger.setLevel(logging.INFO)
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    formatter = logging.Formatter('[%(name)s] %(asctime)s - %(levelname)s - %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)
    context.logger = logger


    config = ConfigParser.ConfigParser()
    ok = config.read('features/environment.cfg')
    if len(ok) == 0:
        raise Exception("Could not open file features/environment.cfg")

    directory = config.get('general', 'testing_output')
    if not os.path.exists(directory):
        os.makedirs(directory)

    delay_secs = 5
    if config.has_option("browser_testing", "delay"):
        delay_secs = config.getint("browser_testing", "delay")

    base_url = 'http://localhost'
    if config.has_option('browser_testing', 'base_url'):
        base_url = config.get('browser_testing', 'base_url')

    context.force_logout = True
    if config.has_option('browser_testing', 'force_logout'):
        context.force_logout = config.get('browser_testing', 'force_logout')

    browser = 'Chrome'
    if config.has_option('browser_testing', 'browser'):
        browser = config.get('browser_testing', 'browser')
    context.browser = browser

    if browser == 'Phantom':
        driver = webdriver.PhantomJS()

    elif browser == 'Sauce':
        logger.info("Using Sauce Labs")
        desired_capabilities = {
            'name': 'consumerfinance.gov browser tests %s' % datetime.now(),
            'platform': os.getenv('SELENIUM_PLATFORM', 'WINDOWS 7'),
            'browserName': os.getenv('SELENIUM_BROWSER', 'chrome'),
            'version': int(os.getenv('SELENIUM_VERSION', 33)),
            'max-duration': 7200,
            'record-video': os.getenv('SELENIUM_VIDEO', True),
            'video-upload-on-pass': os.getenv('SELENIUM_VIDEO_UPLOAD_ON_PASS', False),
            'record-screenshots': os.getenv('SELENIUM_SCREENSHOTS', False),
            'command-timeout': int(os.getenv('SELENIUM_CMD_TIMEOUT', 30)),
            'idle-timeout': int(os.getenv('SELENIUM_IDLE_TIMEOUT', 10)),
            'tunnel-identifier': os.getenv('SELENIUM_TUNNEL'),
        }

        logger.info("Running Sauce with capabilities: %s" % desired_capabilities)

        sauce_config = {"username": "cfpb", "access-key": "78acb02f-76fb-4ed0-a05c-053b696738d5"}
        context.sauce_config = sauce_config

        driver = webdriver.Remote(
            desired_capabilities=desired_capabilities,
            command_executor="http://%s:%s@ondemand.saucelabs.com:80/wd/hub" % (sauce_config['username'], sauce_config['access-key'])
        )

    else:
        chromedriver_path = ''

        if config.has_option('chrome_driver', 'chromedriver_path'):
            chromedriver_path = config.get('chrome_driver', 'chromedriver_path')

        driver = webdriver.Chrome(chromedriver_path)

     # create logger
    logger = logging.getLogger('cfgov_browser_tests')
    logger.setLevel(logging.INFO)
    # create console handler and set level to debug
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    # create formatter
    formatter = logging.Formatter('[%(name)s] %(asctime)s - %(levelname)s - %(message)s')
    # add formatter to ch
    ch.setFormatter(formatter)
    # add ch to logger
    logger.addHandler(ch)

    context.logger = logger

   # create logger
    logger = logging.getLogger('consumerfinance')
    logger.setLevel(logging.INFO)
    # create console handler and set level to debug
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    # create formatter
    formatter = logging.Formatter('[%(name)s] %(asctime)s - %(levelname)s - %(message)s')
    # add formatter to ch
    ch.setFormatter(formatter)
    # add ch to logger
    logger.addHandler(ch)
    context.logger = logger

    context.base = Base(logger, base_url, driver, -1, delay_secs)
    context.home = Home(logger, base_url, driver, -1, delay_secs)
    context.loan_comparison = LoanComparison(logger, base_url, driver, -1, delay_secs)
    context.loan_types = LoanTypes(logger, base_url, driver, -1, delay_secs)
    context.rate_checker = RateChecker(logger, base_url, driver, -1, delay_secs)
    
    take_screenshots = False
    if config.has_option('browser_testing', 'take_screenshots'):
        take_screenshots = config.getboolean('browser_testing', 'take_screenshots')

    context.screenshot = Screenshot(context.base, take_screenshots)

def before_feature(context, feature):
    context.logger.info('STARTING FEATURE %s' % feature)
    if context.browser == "Sauce":
        context.logger.info("Link to job: https://saucelabs.com/jobs/%s" % context.website.driver.session_id)
        context.logger.info("SauceOnDemandSessionID=%s job-name=%s" % (context.website.driver.session_id, feature.name))

    # WHY, OH WHY?
    # Because we see constant flakiness when connecting to Sauce, and it's usually on start of a feature.
    # So we try to clear out cobwebs before each feature
    # I'm not using website.go() here because that has some other interesting bits in it, and I want raw connection here
    # try:
    #     context.logger.info("before_feature cobweb clear: Getting %s" % context.website.base_url)
    #     context.website.driver.get(context.website.base_url)
    #     context.website.utils.zzz(.5)
    #     context.website.wait().until(EC.title_contains("Consumer"), "Should have seen Consumer in title")
    # except Exception:
    #     # If this still fails... well, then something's wrong, and we'll let that error pass through
    #     context.logger.info("before_feature cobweb clear: FAILED. Trying one more time...")
    #     context.website.driver.get(context.website.base_url)


def before_scenario(context, scenario):
    # Ensure each scenario starts with a full browser window. When opening new windows,
    # PhantomJS uses its default window size of 400x300, which is potentially problematic for responsive sites
    context.base.driver.maximize_window()
    context.logger.info('starting scenario %s with row %s' % (scenario, scenario._row))
    context.logger.info('starting feature %s, scenario %s, with row %s' % (scenario.feature.name, scenario.name, scenario._row))


def after_scenario(context, scenario):
    context.logger.info('finished scenario %s with row %s' % (scenario, scenario._row))


def after_feature(context, feature):
    context.logger.info("Total time spent sleeping is %s" % context.base.utils.time_spent_sleeping)

def after_all(context):
    context.base.close_browser()
    if context.browser == 'Sauce':
        base64string = base64.encodestring('%s:%s' % (context.sauce_config['username'], context.sauce_config['access-key']))[:-1]

        body_content = json.dumps({"passed": not context.failed})
        context.logger.info("Updating sauce job with %s" % body_content)
        connection =  httplib.HTTPConnection("saucelabs.com")
        connection.request('PUT', '/rest/v1/%s/jobs/%s' % (context.sauce_config['username'], context.website.driver.session_id),
                           body_content,
                           headers={"Authorization": "Basic %s" % base64string})
        result = connection.getresponse()
        context.logger.info(result.read())
        context.logger.info("Sauce update status: %s" % result.status)

