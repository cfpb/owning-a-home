# coding: utf-8
from selenium.common.exceptions import NoSuchElementException
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select

from pages.base import Base

# ELEMENT CSS SELECTOR
ADD_LOAN_BTN = ".add-btn .btn.btn-secondary"

LOAN_COLUMN_A = "#lc-input-a"
LOAN_COLUMN_B = "#lc-input-b"
LOAN_COLUMN_C = "#lc-input-c"

LOAN_AMOUNT_A = ".input-wrap .loan-amount-display-a"
LOAN_AMOUNT_B = ".input-wrap .loan-amount-display-b"
LOAN_AMOUNT_C = ".input-wrap .loan-amount-display-c"

POINTS_A = "#points-a input"
POINTS_B = "#points-b input"
POINTS_C = "#points-c input"

# ELEMENT ID'S FOR TEXT BOXES
HOUSE_PRICE_A = "house-price-input-a"
HOUSE_PRICE_B = "house-price-input-b"
HOUSE_PRICE_C = "house-price-input-c"
DOWN_PAYMENT_PERCENT_A = "percent-dp-input-a"
DOWN_PAYMENT_PERCENT_B = "percent-dp-input-b"
DOWN_PAYMENT_PERCENT_C = "percent-dp-input-c"
DOWN_PAYMENT_AMOUNT_A = "down-payment-input-a"
DOWN_PAYMENT_AMOUNT_B = "down-payment-input-b"
DOWN_PAYMENT_AMOUNT_C = "down-payment-input-c"

# ELEMENT ID'S FOR DROP DOWN LISTS
STATE = "location"

CREDIT_SCORE = "credit-score-select"

RATE_STRUCTURE_A = "rate-structure-select-a"
RATE_STRUCTURE_B = "rate-structure-select-b"
RATE_STRUCTURE_C = "rate-structure-select-c"

LOAN_TERM_A = "loan-term-select-a"
LOAN_TERM_B = "loan-term-select-b"
LOAN_TERM_C = "loan-term-select-c"

LOAN_TYPE_A = "loan-type-select-a"
LOAN_TYPE_B = "loan-type-select-b"
LOAN_TYPE_C = "loan-type-select-c"

ARM_TYPE_A = "arm-type-select-a"
ARM_TYPE_B = "arm-type-select-b"
ARM_TYPE_C = "arm-type-select-c"

INT_RATE_A = "interest-rate-select-a"
INT_RATE_B = "interest-rate-select-b"
INT_RATE_C = "interest-rate-select-c"


class LoanComparison(Base):

    def __init__(self, logger, directory, base_url=r'http://localhost/',
                 driver=None, driver_wait=10, delay_secs=0):
        super(LoanComparison, self).__init__(logger, directory, base_url,
                                             driver, driver_wait, delay_secs)

    def is_column_present(self, loan_column):
        if (loan_column == 'Loan A'):
            e_css = LOAN_COLUMN_A
        elif (loan_column == 'Loan B'):
            e_css = LOAN_COLUMN_B
        elif (loan_column == 'Loan C'):
            e_css = LOAN_COLUMN_C
        else:
            return (loan_column + " is NOT valid")

        try:
            self.driver.find_element_by_css_selector(e_css)
            return True
        except NoSuchElementException:
            return False

    def click_add_another_loan(self):
        element = self.driver.find_element_by_css_selector(ADD_LOAN_BTN)
        element.click()

    # LOCATION
    def get_location(self):
        # Get the selected Index from the Location dropdown list
        element = Select(self.driver.find_element_by_id(STATE))
        
        option = element.first_selected_option

        # Then Get the corresponding text from the selected Index
        return option.get_attribute('text')

    # CREDIT SCORE
    def get_credit_score(self):
        # Get the selected Index from the Credit Score dropdown list
        element = Select(self.driver.find_element_by_id(CREDIT_SCORE))

        option = element.first_selected_option

        # Then Get the corresponding text from the selected Index
        return option.get_attribute('text')

    # LOAN AMOUNT
    def get_loan_amount(self, loan_column):
        # Get the text from the Loan Amount Label
        if (loan_column == 'Loan A'):
            element = self.driver.find_element_by_css_selector(LOAN_AMOUNT_A)
        elif (loan_column == 'Loan B'):
            element = self.driver.find_element_by_css_selector(LOAN_AMOUNT_B)
        elif (loan_column == 'Loan C'):
            element = self.driver.find_element_by_css_selector(LOAN_AMOUNT_C)
        else:
            return (loan_column + " is NOT valid")

        return element.text

    def get_house_price(self, loan_column):
        if (loan_column == 'Loan A'):
            element = self.driver.find_element_by_id(HOUSE_PRICE_A)
        elif (loan_column == 'Loan B'):
            element = self.driver.find_element_by_id(HOUSE_PRICE_B)
        elif (loan_column == 'Loan C'):
            element = self.driver.find_element_by_id(HOUSE_PRICE_C)
        else:
            return (loan_column + " is NOT valid")

        # If the textbox is empty then return the placeholder amount
        if (element.get_attribute("value") == ''):
            return element.get_attribute("placeholder")
        else:
            # Return the value attribute from the House Price textbox
            return element.get_attribute("value")

    # DOWN PAYMENT PERCENT
    def get_down_payment_percent(self, loan_column):
        if (loan_column == 'Loan A'):
            element = self.driver.find_element_by_id(DOWN_PAYMENT_PERCENT_A)
        elif (loan_column == 'Loan B'):
            element = self.driver.find_element_by_id(DOWN_PAYMENT_PERCENT_B)
        elif (loan_column == 'Loan C'):
            element = self.driver.find_element_by_id(DOWN_PAYMENT_PERCENT_C)
        else:
            return (loan_column + " is NOT valid")

        # If the textbox is empty then return the placeholder amount
        if (element.get_attribute("value") == ''):
            return element.get_attribute("placeholder")
        else:
            # Return the value attribute from the DP percent textbox
            return element.get_attribute("value")

    # DOWN PAYMENT AMOUNT
    def get_down_payment_amount(self, loan_column):
        if (loan_column == 'Loan A'):
            element = self.driver.find_element_by_id(DOWN_PAYMENT_AMOUNT_A)
        elif (loan_column == 'Loan B'):
            element = self.driver.find_element_by_id(DOWN_PAYMENT_AMOUNT_B)
        elif (loan_column == 'Loan C'):
            element = self.driver.find_element_by_id(DOWN_PAYMENT_AMOUNT_C)
        else:
            return (loan_column + " is NOT valid")

        # If the textbox is empty then return the placeholder amount
        if (element.get_attribute("value") == ''):
            return element.get_attribute("placeholder")
        else:
            # Return the value attribute from the Down Payment amount textbox
            return element.get_attribute("value")

    # RATE STRUCTURE
    def get_rate_structure(self, loan_column):
        # Get the selected Index from the Rate Structure dropdown list
        if (loan_column == 'Loan A'):
            element = Select(self.driver.find_element_by_id(RATE_STRUCTURE_A))
        elif (loan_column == 'Loan B'):
            element = Select(self.driver.find_element_by_id(RATE_STRUCTURE_B))
        elif (loan_column == 'Loan C'):
            element = Select(self.driver.find_element_by_id(RATE_STRUCTURE_C))
        else:
            return (loan_column + " is NOT valid")

        option = element.first_selected_option

        # Then Get the corresponding text from the selected Index
        return option.get_attribute('text')

    # LOAN TERM
    def get_loan_term(self, loan_column):
        # Get the selected Index from the Loan Term dropdown list
        if (loan_column == 'Loan A'):
            element = Select(self.driver.find_element_by_id(LOAN_TERM_A))
        elif (loan_column == 'Loan B'):
            element = Select(self.driver.find_element_by_id(LOAN_TERM_B))
        elif (loan_column == 'Loan C'):
            element = Select(self.driver.find_element_by_id(LOAN_TERM_C))
        else:
            return (loan_column + " is NOT valid")

        option = element.first_selected_option

        # Then Get the corresponding text from the selected Index
        return option.get_attribute('text')

    # LOAN TYPE
    def get_selected_loan_type(self, loan_column):
        # Get the selected Index from the Loan Type dropdown list
        if (loan_column == 'Loan A'):
            element = Select(self.driver.find_element_by_id(LOAN_TYPE_A))
        elif (loan_column == 'Loan B'):
            element = Select(self.driver.find_element_by_id(LOAN_TYPE_B))
        elif (loan_column == 'Loan C'):
            element = Select(self.driver.find_element_by_id(LOAN_TYPE_C))
        else:
            return (loan_column + " is NOT valid")

        option = element.first_selected_option

        # Then Get the corresponding text from the selected Index
        return option.get_attribute('text')

    # ARM TYPE
    def get_arm_type(self, loan_column):
        # Get the selected Index from the ARM Type dropdown list
        if (loan_column == 'Loan A'):
            element = Select(self.driver.find_element_by_id(ARM_TYPE_A))
        elif (loan_column == 'Loan B'):
            element = Select(self.driver.find_element_by_id(ARM_TYPE_B))
        elif (loan_column == 'Loan C'):
            element = Select(self.driver.find_element_by_id(ARM_TYPE_C))
        else:
            return (loan_column + " is NOT valid")

        option = element.first_selected_option
        # Then Get the corresponding text from the selected Index
        return option.get_attribute('text')

    # DISCOUNT POINTS AND CREDITS
    def get_selected_points(self, loan_column):
        if (loan_column == 'Loan A'):
            elements = self.driver.find_elements_by_css_selector(POINTS_A)
        elif (loan_column == 'Loan B'):
            elements = self.driver.find_elements_by_css_selector(POINTS_B)
        elif (loan_column == 'Loan C'):
            elements = self.driver.find_elements_by_css_selector(POINTS_C)
        else:
            return (loan_column + " is NOT valid")

        # First find the selected radio button
        for element in elements:
            if(element.get_attribute('checked') == 'true'):
                selected_points = element.get_attribute('value')
                break
        # Then return the value of the selected radio button
        return selected_points

    # INTEREST RATE
    def get_interest_rate(self, loan_column):
        # Get the selected Index from the ARM Type dropdown list
        if (loan_column == 'Loan A'):
            element = Select(self.driver.find_element_by_id(INT_RATE_A))
        elif (loan_column == 'Loan B'):
            element = Select(self.driver.find_element_by_id(INT_RATE_B))
        elif (loan_column == 'Loan C'):
            element = Select(self.driver.find_element_by_id(INT_RATE_C))
        else:
            return (loan_column + " is NOT valid")

        option = element.first_selected_option
        # Then Get the corresponding text from the selected Index
        return option.get_attribute('text')
