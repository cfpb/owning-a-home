
from selenium.common.exceptions import NoSuchElementException
from selenium import webdriver
from selenium.webdriver.support.ui import Select

from pages.base import *

# ELEMENT ID'S
DOWN_PAYMENT_AMOUNT_TBOX    = "down-payment" #DOWN PAYMENT AMOUNT TEXTBOX
DOWN_PAYMENT_PERCENT_TBOX   = "percent-down" #DOWN PAYMENT PERCENTAGE TEXTBOX
HOUSE_PRICE_TBOX            = "house-price" # HOUSE PRICE TEXTBOX 
LOAN_TYPE_DDL               = "loan-type" # LOAN TYPE DROPDOWN LIST
RATE_STRUCTURE_DDL          = "rate-structure" # RATE STRUCTURE DROPDOWN LIST
LOAN_TERM_DDL               = "loan-term" # LOAN TERM DROPDOWN LIST
LOCATION_DDL                = "location" # LOCATION DROPDOWN LIST
LOAN_AMOUNT_LABEL           = "loan-amount-result" # LOAN AMOUNT LABEL

# XPATH LOCATORS
RATE_LOCATION     	        = "//h2/*[@class ='location']"
SLIDER                      = "//div[contains(@class, 'slider') and contains(@id, 'slider')]"
SLIDER_RANGE 		        = "//div[@id = 'slider-range']" # This label displays range as 700 - 720

class RateChecker(Base):      

	
    def __init__(self, logger, base_url=r'http://localhost/', driver=None, driver_wait=-1, delay_secs=0):
        super(RateChecker, self).__init__(logger, base_url, driver, driver_wait, delay_secs)

    def get_chart_location(self):        
        element = self.driver.find_element_by_xpath(RATE_LOCATION)
        return element.text

    def get_credit_score_range(self):
    	element = self.driver.find_element_by_xpath(SLIDER_RANGE)
        # The Credit Score Range is displayed as "720 - 740" so we are only going to return the first 3 characters 
        score_range = element.text[:3]
        # Return the score range as Int to perform greater than/less than operations
        return int(score_range)

    def get_credit_score_text(self):
    	element = self.driver.find_element_by_xpath(SLIDER_RANGE)
        # Return the entire text of the credit score range
        return element.text

    def get_selected_location(self):
        # First Get the selected Index from the Location dropdown list
        element = Select(self.driver.find_element_by_id(LOCATION_DDL))
        option = element.first_selected_option

        # Then Get the corresponding text from the selected Index
        return option.get_attribute('text')

    def get_selected_loan_term(self):
        # First Get the selected Index from the Loan Term dropdown list
        element = Select(self.driver.find_element_by_id(LOAN_TERM_DDL))
        option = element.first_selected_option

        # Then Get the corresponding text from the selected Index
        return option.get_attribute('text') 

    def get_selected_loan_type(self):
        # First Get the selected Index from the Loan Type dropdown list
        element = Select(self.driver.find_element_by_id(LOAN_TYPE_DDL))
        option = element.first_selected_option

        # Then Get the corresponding text from the selected Index
        return option.get_attribute('text')

    def get_selected_rate_structure(self):
        # First Get the selected Index from the Location dropdown list
        element = Select(self.driver.find_element_by_id(RATE_STRUCTURE_DDL))
        option = element.first_selected_option

        # Then Get the corresponding text from the selected Index
        return option.get_attribute('text') 

    def get_default_house_price(self):
        # Get the place holder attribute from the House Price textbox
        element = self.driver.find_element_by_id(HOUSE_PRICE_TBOX)
        house_price  = element.get_attribute("placeholder")
        return house_price 

    def get_default_down_payment_percent(self):
        # Get the place holder attribute from the Down Payment Percentage textbox
        element = self.driver.find_element_by_id(DOWN_PAYMENT_PERCENT_TBOX)
        down_payment_amount  = element.get_attribute("placeholder")
        return down_payment_amount 

    def get_default_down_payment_amount(self):
        # Get the place holder attribute from the Down Payment Amount textbox
        element = self.driver.find_element_by_id(DOWN_PAYMENT_AMOUNT_TBOX)
        down_payment_amount  = element.get_attribute("placeholder")
        return down_payment_amount 

    def get_down_payment_percent(self):
        # Get the value attribute from the Down Payment Percentage textbox
        element = self.driver.find_element_by_id(DOWN_PAYMENT_PERCENT_TBOX)
        down_payment_percentage  = element.get_attribute("value")
        return down_payment_percentage 

    def get_loan_amount(self):
        # Get the text from the Loan Amount label
        element = self.driver.find_element_by_id(LOAN_AMOUNT_LABEL)
        return element.text 

    def set_down_payment(self, down_payment):
        element = self.driver.find_element_by_id(DOWN_PAYMENT_AMOUNT_TBOX)
        element.clear() # Clear any existing text
        element.send_keys(down_payment)
        element.send_keys(Keys.TAB)    

    def set_house_price(self, house_price):
        element = self.driver.find_element_by_id(HOUSE_PRICE_TBOX)
        element.clear() # Clear any existing text
        element.send_keys(house_price)
        element.send_keys(Keys.TAB)

    def set_location(self, state_name):
        select = Select(self.driver.find_element_by_id(LOCATION_DDL))
        select.select_by_visible_text(state_name)

    def move_slider(self, slider_direction):
    	element = self.driver.find_element_by_xpath(SLIDER)
    	actions = ActionChains(self.driver)

    	if(slider_direction=="right"):
    		actions.drag_and_drop_by_offset(element,100,0)
    	elif(slider_direction=="left"):
    		actions.drag_and_drop_by_offset(element,-100,0)
    	
        actions.perform()


