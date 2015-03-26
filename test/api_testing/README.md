# API tests

## Running API tests


Before running tests, you will need to set up a Python virtual environment, install dependencies, and create an environment.cfg file.

- $ cd test/api_testing/
- $ mkvirtualenv oah-tests
- $ pip install -r requests

Rename test/api_testing/features/example-environment.cfg to environtment.cfg and edit the file to point base_url to the environment you wish to test

- $ workon oah-tests
- $ behave -k

Run behave -k -t=~prod_only to omit production environment tests