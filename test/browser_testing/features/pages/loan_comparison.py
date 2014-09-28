
from selenium.common.exceptions import NoSuchElementException
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select

from pages.base import Base

# ELEMENT ID'S FOR TEXT BOXES
HOUSE_PRICE_TBOX = "house-price-input-a"
DOWN_PAYMENT_PERCENT_TBOX = "percent-dp-input-a"
DOWN_PAYMENT_AMOUNT_TBOX = "down-payment-input-a"

# ELEMENT ID'S FOR DROP DOWN LISTS
STATE_DDL = "location-a"
CREDIT_SCORE_DDL = "credit-score-select-a"
RATE_STRUCTURE_DDL = "rate-structure-select-a"
LOAN_TERM_DDL = "loan-term-select-a"
LOAN_TYPE_DDL = "loan-type-select-a"
ARM_TYPE_DDL = "arm-type-select-a"
INT_RATE_DDL = "interest-rate-select-a"


class LoanComparison(Base):

    def __init__(self, logger, directory, base_url=r'http://localhost/',
                 driver=None, driver_wait=10, delay_secs=0):
        super(LoanComparison, self).__init__(logger, directory, base_url,
                                             driver, driver_wait, delay_secs)

    def is_column_present(self, name):
        l_wait = 5
        e_xpath = "//h3[@class='comparison-header' and text()='" + name + "']"
        msg = u'Element xpath="%s" not found after %d secs' % (e_xpath, l_wait)
        try:
            e = WebDriverWait(self.driver, l_wait
                              ).until(lambda driver: driver.
                                      find_element_by_xpath(e_xpath), msg)
            return True
        except TimeoutException:
            return False

    # LOCATION
    def get_location(self):
        # Get the selected Index from the Location dropdown list
        element = Select(self.driver.find_element_by_id(STATE_DDL))
        option = element.first_selected_option

        # Then Get the corresponding text from the selected Index
        return option.get_attribute('text')

    # CREDIT SCORE
    def get_credit_score(self):
        # Get the selected Index from the Credit Score dropdown list
        element = Select(self.driver.find_element_by_id(CREDIT_SCORE_DDL))
        option = element.first_selected_option

        # Then Get the corresponding text from the selected Index
        return option.get_attribute('text')

    # LOAN AMOUNT
    def get_loan_amount(self):
        # Get the text from the Loan Amount Label
        e_css = ".input-wrap .loan-amount-display-a"
        element = self.driver.find_element_by_css_selector(e_css)
        return element.text
        element = self.driver.find_element_by_id(HOUSE_PRICE_TBOX)

    def get_house_price(self):
        element = self.driver.find_element_by_id(HOUSE_PRICE_TBOX)
        # If the textbox is empty then return the placeholder amount
        if (element.get_attribute("value") == ''):
            return element.get_attribute("placeholder")
        else:
            # Return the value attribute from the House Price textbox
            return element.get_attribute("value")

    # DOWN PAYMENT PERCENT
    def get_down_payment_percent(self):
        element = self.driver.find_element_by_id(DOWN_PAYMENT_PERCENT_TBOX)

        # If the textbox is empty then return the placeholder amount
        if (element.get_attribute("value") == ''):
            return element.get_attribute("placeholder")
        else:
            # Return the value attribute from the DP percent textbox
            return element.get_attribute("value")

    # DOWN PAYMENT AMOUNT
    def get_down_payment_amount(self):
        element = self.driver.find_element_by_id(DOWN_PAYMENT_AMOUNT_TBOX)

        # If the textbox is empty then return the placeholder amount
        if (element.get_attribute("value") == ''):
            return element.get_attribute("placeholder")
        else:
            # Return the value attribute from the Down Payment amount textbox
            return element.get_attribute("value")

    # RATE STRUCTURE
    def get_rate_structure(self):
        # Get the selected Index from the Rate Structure dropdown list
        element = Select(self.driver.find_element_by_id(RATE_STRUCTURE_DDL))
        option = element.first_selected_option

        # Then Get the corresponding text from the selected Index
        return option.get_attribute('text')

    # LOAN TERM
    def get_loan_term(self):
        # Get the selected Index from the Loan Term dropdown list
        element = Select(self.driver.find_element_by_id(LOAN_TERM_DDL))
        option = element.first_selected_option

        # Then Get the corresponding text from the selected Index
        return option.get_attribute('text')

    # LOAN TYPE
    def get_loan_type(self):
        # Get the selected Index from the Loan Type dropdown list
        element = Select(self.driver.find_element_by_id(LOAN_TYPE_DDL))
        option = element.first_selected_option

        # Then Get the corresponding text from the selected Index
        return option.get_attribute('text')

    # ARM TYPE
    def get_arm_type(self):
        # Get the selected Index from the ARM Type dropdown list
        element = Select(self.driver.find_element_by_id(ARM_TYPE_DDL))
        option = element.first_selected_option

        # Then Get the corresponding text from the selected Index
        return option.get_attribute('text')

    # DISCOUNT POINTS AND CREDITS
    def get_selected_points(self):
        element = self.driver.find_element_by_xpath("//input[@name='discount' and @checked='checked']")
        return element.get_attribute('value')

    # INTEREST RATE
    def get_interest_rate(self):
        # Get the selected Index from the ARM Type dropdown list
        element = Select(self.driver.find_element_by_id(INT_RATE_DDL))
        option = element.first_selected_option

        # Then Get the corresponding text from the selected Index
        return option.get_attribute('text')
