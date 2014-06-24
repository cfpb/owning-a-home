from pprint import pprint
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import StaleElementReferenceException
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from utils import Utils

import sys
import time

# DEFAULT VALUES
default_driver_wait = 5


class Base(object):
    def __init__(self, logger, results_folder, base_url=r'http://localhost/',
                 driver=None, driver_wait=-1, delay_secs=0):
        if driver is None:
            assert 'Driver is invalid or was not provided.'

        if driver_wait == -1:
            self.driver_wait = default_driver_wait

        self.system_login = ''
        self.logger = logger
        self.utils = Utils(delay_secs)
        self.base_url = base_url
        self.driver = driver
        self.chain = ActionChains(self.driver)
        self.logger = logger
        self.results_folder = results_folder

    def get_page_title(self):
        return (self.driver.title)

    def close_browser(self):
        self.utils.zzz(1)
        self.driver.quit()

    def sleep(self, time):
        self.utils.zzz(float(time))

    def go(self, relative_url=''):
        full_url = self.utils.build_url(self.base_url, relative_url)
        try:
            self.logger.info("Getting %s" % full_url)
            self.driver.get(full_url)
        except Exception:
            print "!!!!!!!!! Unexpected error running %s:" % full_url,
            sys.exc_info()[0]
            print "Currently at %s" % self.driver.current_url
            self.get_screenshot(full_url)
            raise

    def click_tab(self, tab_xpath):
        element = self.driver.find_element_by_xpath(tab_xpath)
        element.click()

    def get_screenshot(self, filename=''):
        if filename == '':
            filename = self.driver.current_url

        filename = "%s" % (filename.replace('/', '_'))
        full_path = '%s/%s.%s' % (self.results_folder, filename, 'png')
        self.logger.info("Saving screenshot to %s" % full_path)
        self.driver.save_screenshot(full_path)
