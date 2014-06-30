import time


class Utils(object):

    def __init__(self, default_delay_secs=0):
        self.default_delay_secs = default_delay_secs
        self.time_spent_sleeping = 0

    def zzz(self, secs=0):
        if secs > 0:
            print("ZZZZZZZZZing for %s secs" % secs)
            time.sleep(secs)
            self.time_spent_sleeping += secs
        elif self.default_delay_secs > 0:
            print("ZZZZZZZZZing for %s secs" % self.default_delay_secs)
            time.sleep(self.default_delay_secs)
            self.time_spent_sleeping += self.default_delay_secs

    def build_url(self, base_url, relative_url=''):
        if relative_url == '':
            return base_url.strip()
        elif relative_url.startswith('/'):
            return '%s%s'.strip() % (base_url, relative_url)
        else:
            return '%s/%s'.strip() % (base_url, relative_url)

    def strip_trailing_slash(self, url):
        if url.endswith("/"):
            return url[:-1]
        return url

    def urls_match(self, url1, url2):
        return (self.strip_trailing_slash(url1) ==
                self.strip_trailing_slash(url2))

    def build_login(self, user_nickname):
        # ToDo: retrieve login by 'nickname'
        suffix = '@agency.gov'
        username = user_nickname

        if user_nickname == 'invalid':
            username = 'bad.login'

        return '%s%s' % (username, suffix)

    def build_password(self, user_nickname):
        # ToDo: retrieve password by 'nickname'
        if user_nickname == 'test1':
            return '1'
        elif user_nickname == 'test2':
            return '2'
        elif user_nickname == 'test3':
            return '3'
        elif user_nickname == 'admin':
            return '4'
        else:
            return 'bad.password'

    def convert_nickname_to_id(self, nickname):
        id = ''

        if nickname == 'search':
            id = 'q'
        elif nickname == 'card issuer':
            id = 'issuer_select_chzn'

        return id
