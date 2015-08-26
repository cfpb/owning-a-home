
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver

from pages.base import Base


class Navigation(Base):

    def __init__(self, logger, directory, base_url=r'http://localhost/',
                 driver=None, driver_wait=10, delay_secs=0):
        super(Navigation, self).__init__(logger, directory, base_url,
                                         driver, driver_wait, delay_secs)

    def click_link(self, link_text):

        # this is a temporary fix to catch jump-links on loan options
        # page, since their text is wrapped in a span
        # TODO: consider using ids instead
        xpath_text = "//a[contains(text(),'" + link_text + "')]"
        xpath_span = "//a/span[contains(text(),'" + link_text + "')]/.."
        try:
            element = self.driver.find_element_by_xpath(xpath_text)
        except NoSuchElementException:
            element = self.driver.find_element_by_xpath(xpath_span)

        # scroll the element into view so it can be
        # observed with SauceLabs screencast
        script = "arguments[0].scrollIntoView(true);"
        self.driver.execute_script(script, element)

        # element.click()

        try:
            element.click()
        except WebDriverException:
            action = webdriver.ActionChains(self.driver)\
                .move_to_element_with_offset(element, 0, 20).click()
            action.perform()

    def click_link_with_id(self, link_id):
        element = self.driver.find_element_by_id(link_id)

         # scroll the element into view so it can be
        # observed with SauceLabs screencast
        script = "arguments[0].scrollIntoView(true);"
        self.driver.execute_script(script, element)
        element.click()