__author__ = 'CFPBLabs'

from datetime import *

default_filename_prefix = u'Screenshot'

class Screenshot(object):

    def __init__(self, website, take_screenshots=True, filename_prefix=default_filename_prefix):
        self.take_screenshots = take_screenshots
        self.website = website
        self.filename_prefix = filename_prefix

    def save(self, filename=''):
        if not self.take_screenshots:
            return

        if filename == '':
            filename = '%s_%s' % (self.filename_prefix, self.build_timestamp())

        self.website.save_screenshot(filename)

    def build_timestamp(self):
        return datetime.now().isoformat()