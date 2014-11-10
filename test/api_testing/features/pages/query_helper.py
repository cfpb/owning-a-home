import string
import logging


class QueryHelper(object):
    def __init__(self, logger, base_url):
        self.logger = logger
        self.base_url = base_url

        self.house_price = u''
        self.loan_amount = u''
        self.minfico = u''
        self.maxfico = u''
        self.state = u''
        self.rate_structure = u''
        self.loan_term = u''
        self.loan_type = u''
        self.arm_type = u''

    def build(self):

        if (self.house_price == "missing"):
            query_string = {'loan_amount': self.loan_amount,
                            'minfico': self.minfico,
                            'maxfico': self.maxfico,
                            'state': self.state,
                            'rate_structure': self.rate_structure,
                            'loan_term': self.loan_term,
                            'loan_type': self.loan_type,
                            'arm_type': self.arm_type}

        elif (self.loan_amount == "missing"):
            query_string = {'price': self.house_price,
                            'minfico': self.minfico,
                            'maxfico': self.maxfico,
                            'state': self.state,
                            'rate_structure': self.rate_structure,
                            'loan_term': self.loan_term,
                            'loan_type': self.loan_type,
                            'arm_type': self.arm_type}

        elif (self.minfico == "missing"):
            query_string = {'price': self.house_price,
                            'loan_amount': self.loan_amount,
                            'maxfico': self.maxfico,
                            'state': self.state,
                            'rate_structure': self.rate_structure,
                            'loan_term': self.loan_term,
                            'loan_type': self.loan_type,
                            'arm_type': self.arm_type}

        elif (self.maxfico == "missing"):
            query_string = {'price': self.house_price,
                            'loan_amount': self.loan_amount,
                            'minfico': self.minfico,
                            'state': self.state,
                            'rate_structure': self.rate_structure,
                            'loan_term': self.loan_term,
                            'loan_type': self.loan_type,
                            'arm_type': self.arm_type}

        elif (self.state == "missing"):
            query_string = {'price': self.house_price,
                            'loan_amount': self.loan_amount,
                            'minfico': self.minfico,
                            'maxfico': self.maxfico,
                            'rate_structure': self.rate_structure,
                            'loan_term': self.loan_term,
                            'loan_type': self.loan_type,
                            'arm_type': self.arm_type}

        elif (self.rate_structure == "missing"):
            query_string = {'price': self.house_price,
                            'loan_amount': self.loan_amount,
                            'minfico': self.minfico,
                            'maxfico': self.maxfico,
                            'state': self.state,
                            'loan_term': self.loan_term,
                            'loan_type': self.loan_type,
                            'arm_type': self.arm_type}

        elif (self.loan_term == "missing"):
            query_string = {'price': self.house_price,
                            'loan_amount': self.loan_amount,
                            'minfico': self.minfico,
                            'maxfico': self.maxfico,
                            'state': self.state,
                            'rate_structure': self.rate_structure,
                            'loan_type': self.loan_type,
                            'arm_type': self.arm_type}

        elif (self.loan_type == "missing"):
            query_string = {'price': self.house_price,
                            'loan_amount': self.loan_amount,
                            'minfico': self.minfico,
                            'maxfico': self.maxfico,
                            'state': self.state,
                            'rate_structure': self.rate_structure,
                            'loan_term': self.loan_term,
                            'arm_type': self.arm_type}

        elif (self.arm_type == "missing"):
            query_string = {'price': self.house_price,
                            'loan_amount': self.loan_amount,
                            'minfico': self.minfico,
                            'maxfico': self.maxfico,
                            'state': self.state,
                            'rate_structure': self.rate_structure,
                            'loan_term': self.loan_term,
                            'loan_type': self.loan_type}

        else:
            query_string = {'price': self.house_price,
                            'loan_amount': self.loan_amount,
                            'minfico': self.minfico,
                            'maxfico': self.maxfico,
                            'state': self.state,
                            'rate_structure': self.rate_structure,
                            'loan_term': self.loan_term,
                            'loan_type': self.loan_type,
                            'arm_type': self.arm_type}

        return query_string
