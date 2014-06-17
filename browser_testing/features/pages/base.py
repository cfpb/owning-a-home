from pprint import pprint
from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from utils import *
import sys

# DEFAULT VALUES
__author__ = 'CFPBLabs'
default_driver_wait = 5

class Base(object):
    def __init__(self, logger, base_url=r'http://localhost/', driver=None, driver_wait=-1, delay_secs=0):
        if driver is None:
            assert 'Driver is invalid or was not provided.'

        if driver_wait == -1:
            self.driver_wait = default_driver_wait

        self.system_login = ''
        self.logger = logger
        self.utils = Utils(delay_secs)
        self.base_url = base_url
        self.driver = driver
        #self.driver.implicitly_wait(self.driver_wait)
        # self.driver.set_page_load_timeout(30) # Why does this cause this exception: selenium.common.exceptions.WebDriverException: Message: '{"status":405,"value":["GET","HEAD","DELETE"]}'
        #self.driver.set_script_timeout(self.driver_wait)
        self.chain = ActionChains(self.driver)
        self.logger = logger
        #self.menu_id_map = {'PARTICIPATE':'participate', 'INSIDE THE CFPB':'inside', 'GET ASSISTANCE':'assistance', 'LAW & REGULATION':'regulation', 'SUBMIT A COMPLAINT':'alert'}
        self.current_menu = None

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
            print "!!!!!!!!! Unexpected error running %s:" % full_url, sys.exc_info()[0]
            print "Currently at %s" % self.get_url()
            self.save_screenshot(full_url)
            self.save_source(full_url)
            raise

    def click_tab(self, tab_xpath):
        element = self.driver.find_element_by_xpath(tab_xpath)
        element.click()

