
from selenium.common.exceptions import NoSuchElementException
from selenium import webdriver

from pages.base import Base


class LoanTypes(Base):

    def __init__(self, logger, directory, base_url=r'http://localhost/',
                 driver=None, driver_wait=-1, delay_secs=0):
        super(LoanTypes, self).__init__(logger, directory, base_url,
                                        driver, driver_wait, delay_secs)
