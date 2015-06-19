# coding: utf-8
from selenium.common.exceptions import NoSuchElementException
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select

from pages.base import Base

import requests

# Navigation header CSS selector
NAVBAR = ".process-nav_header"
LINK_TAG = 'a'


class Journey(Base):

    def __init__(self, logger, directory, base_url=r'http://localhost/',
                 driver=None, driver_wait=10, delay_secs=0):
        super(Journey, self).__init__(logger, directory, base_url,
                                             driver, driver_wait, delay_secs)

    def is_navbar_found(self):
        try:
            self.driver.find_element_by_css_selector( NAVBAR )
            return True
        except NoSuchElementException:
            return False

    def check_link_status_code(self, link):
        try:
            r = requests.head(link)
            return r.status_code > 199 and r.status_code < 400
        except requests.ConnectionError:
            return False

    def check_all_links_on_page(self, base_url):
        results = []
        link_elements = self.driver.find_elements_by_tag_name( LINK_TAG )
        for elem in link_elements:
            link = elem.get_attribute('href')
            is_local = base_url.startswith('http://localhost') or base_url.startswith('http://127.0.0.1')
            if link and not link.startswith('tel') and not self.check_link_status_code(link):
                # because when running tests locally links like localhost/es will return 404
                # and there are too many of them
                if is_local and link.startswith(base_url):
                    results.append(link)

        return results
