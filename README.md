# Owning a Home

[![Build Status](https://travis-ci.org/cfpb/owning-a-home.svg?branch=master)](https://travis-ci.org/cfpb/owning-a-home) [![Coverage Status](https://coveralls.io/repos/cfpb/owning-a-home/badge.svg)](https://coveralls.io/r/cfpb/owning-a-home)

"Owning a Home" is an interactive, online toolkit designed to help consumers as they shop for a mortgage. The suite of tools gives consumers the information and confidence they need to get the best deal. It takes the consumer from the very start of the home-buying process, with a guide to loan options, terminology, and costs, through to the closing table with a closing checklist.

## This project is a work in progress
Nothing presented in the issues or in this repo is a final product unless it is marked as such or appears on www.consumerfinance.gov/owning-a-home. Some copy or formulas may be replaced with dummy text to ensure that we follow any and all privacy and security procedures at the CFPB. All the designs, layouts, and evolution of our decision making process are accurate.

## We want your feedback, but will not be able to respond to everyone
We are working under an agile framework, and plan to use this repo to publish, receive feedback, and iterate on that feedback as often as possible. Our goal is to see user trends and reactions to our work. We want as much feedback as possible to help us make informed decisions so that we can make this tool better. Unfortunately, we will not be able to respond to every piece of feedback or comment we receive, but intend to respond with our progress through the evolution of the tool.

## Dependencies

- Unix-based OS (including Macs). Windows is not supported at this time.
- [Virtualenv](https://virtualenv.pypa.io/en/latest/) and [Virtualenvwrapper](https://virtualenvwrapper.readthedocs.org/en/latest/#), Python modules that keep dependencies  project specific and in their own virtual environments.
- [Autoenv](https://github.com/kennethreitz/autoenv)
- [Sheer](https://github.com/cfpb/sheer)
- [Elasticsearch](http://www.elasticsearch.org/)
- [Node](http://nodejs.org/)
- [Grunt](http://gruntjs.com/)
- [Bower](http://bower.io/)
- [Browserify](http://browserify.org/)
- [Capital Framework](http://cfpb.github.io/capital-framework/)
- [LESS](http://lesscss.org/)

### Virtualenv & Virtualenvwrapper Python modules

If you already have these modules installed, [skip ahead to Sheer](#sheer-elasticsearch).

1. Run:
	```
	$ pip install virtualenv virtualenvwrapper
	```

### Autoenv module

If you already have [Autoenv](https://github.com/kennethreitz/autoenv) installed, [skip ahead to Sheer](#sheer-elasticsearch).

1. Run:
	```
	$ pip install autoenv
	```


### Sheer & Elasticsearch

[Sheer](https://github.com/cfpb/sheer) is "A Jekyll-inspired, elasticsearch-powered, CMS-less publishing tool." It requires [Elasticsearch](http://www.elasticsearch.org/).

1. Install [Elasticsearch](http://www.elasticsearch.org/) however you'd like. (We use [homebrew](http://brew.sh/).):
	```
	$ brew install elasticsearch
	```

2. Clone the sheer GitHub project to wherever you keep your projects (not inside Owning a Home):
	```
	$ git clone https://github.com/cfpb/sheer.git
	```

3. Create a virtualenv for sheer, which you'll name `OAH`:
	```
	$ mkvirtualenv OAH
	```

	The new virtualenv will activate right away. To activate it later on (say, in a new terminal session) use the command `workon OAH`. You'll know you have a virtual environment activated if you see the name of it in parentheses before your terminal prompt. Ex:
	```
	(OAH)username$
	```
	
	If the virtualenv did not activate right away, run this command from the directory above where the OAH directory lives:
	```
	$ source OAH/bin/activate
	```
	
	To deactivate, use the command `deactivate`.

4. Install sheer into the virtualenv with the `-e` flag (which allows you to make changes to sheer itself). The path to sheer is the root directory of the GitHub repository you checked out (cloned) earlier, which likely will be `./sheer`:
	```
	$ pip install -e ~/path/to/sheer
	```

5. Install sheer's python requirements:
	```
	$ pip install -r ~/path/to/sheer/requirements.txt
	```

6. You should now be able to run the sheer command:
	```
	$ sheer
	usage: sheer [-h] [--debug] {inspect,index,serve} …
	sheer: error: too few arguments
	```

7. Populate Elasticsearch with content:
  ```
  $ [WORDPRESS=http://wordpress.uri] sheer index [--reindex]
  ```
  Make sure to be in the site's root folder and that Elasticsearch is running. The above
  command will read all OaH content and save it in Elasticseach. [More information](#wordpress-indexing).

If you run into problems or have any questions about Sheer, check out [Sheer on Github](https://github.com/cfpb/sheer) and the [Sheer Issue Tracker](https://github.com/cfpb/sheer/issues).

### Node, Grunt, Bower, Browserify

1. Install [node.js](http://nodejs.org/), either v0.12 or io.js. If you're using the default version that comes with Mac OSX, you'll need to upgrade - first [install NVM](https://github.com/creationix/nvm).
1. If you installed with NVM, then you can install and set io.js as your default node version:
	```
	$ nvm install iojs
	$ nvm alias default iojs
	```
2. Install [Grunt](http://gruntjs.com/), [Bower](http://bower.io/) and [Browserify](http://browserify.org/):
	```
	$ npm install -g grunt-cli bower browserify
	```

3. Navigate to the cloned `owning-a-home` directory and install the project's node dependencies:
	```
	$ npm install
	```

4. Navigate to the `config` folder. In that folder, copy the `example-config.json` file and rename it `config.json`. This can be done from the command line with the following two commands:
	```
	$ cd config
	$ cp example-config.json config.json
	```

5. Run grunt to build the site:
	```
	$ grunt
	```

[npm-shrinkwrap](https://docs.npmjs.com/cli/shrinkwrap) is used to lock down dependencies. If you add any dependencies to package.json, re-run `npm shrinkwrap` to generate a new `npm-shrinkwrap.json` file.

## Configuration

### <a name="wordpress-indexing"></a>WordPress Indexing
To index your content from WordPress:

1. In the repo directory, copy the `.env_SAMPLE` file and name it `.env`. This can be done from the command line with the following command:
	```
	$ cp .evn_SAMPLE .env
	```

2. Add your WordPress URL in place of wordpress.domain on line 1 of `.env`.

3. Run the following command inside the `/src/` or `/dist/` folder:
	```
	$ cd src
	$ workon OAH
	$ sheer index [--reindex]
  ```


### Rate Checker and Mortgage Insurance
The Rate Checker and Mortgage Insurance are JavaScript applications for checking mortgage interest rates and mortgage insurance premiums. Currently owning-a-home's Rate Checker and Loan Comparison are powered by private APIs that returns mortgage rate, county data, and mortgage insurance premiums. **Without these APIs configured, the website will still load but the Rate Checker and Loan Comparison applications will NOT be available.**

**The following section is therefore only useful to users with access to the private APIs who are able to run the Rate Checker and Loan Comparison apps.**

#### Private API Users

To configure the Rate Checker and Loan Comparison you will need to point to the required API URLs in `config/config.json`. 

1. In `config/config.json`, change lines to point to the API URLs, respectively:
	```json
	{
	    "rateCheckerAPI": "YOUR RATE CHECKER API URL HERE",
	    "countyAPI": "YOUR COUNTY API URL HERE",
		"mortgageInsuranceAPI": "YOUR MORTGAGE INSURANCE API URL HERE",
	}
	```


## Workflow

The following commands need to be run as part of your daily workflow developing this application.


### Fetch changes workflow
1. Each time you fetch from upstream, install dependencies with npm and run `grunt` to build everything:

```bash
$ npm install
$ grunt
```

### Sheer workflow
Sheer needs to be running to compile the templates in `_layouts`. 

1. Use the sheer virtualenv:
	```bash
	$ workon OAH
	```

2. Navigate to the built app directory that grunt created
	```bash
	$ cd dist
	```

3. Start Sheer:
	```bash
	$ sheer serve
	```
	**Note:** The first time you start sheer, you may get a firewall alert and login prompt. Hit cancel at either of these.

### Grunt workflow
Grunt watch will recompile Less and JS everytime you save changes to those project files.

1. Open a new command prompt and run:
	```
	$ grunt watch
	```

To view the site browse to: <http://localhost:7000>

## Browser tests

### Browser test setup

Browser tests can be found in `test/browser_testing/` directory. To run them you will need [Chromedriver](http://chromedriver.storage.googleapis.com/index.html).

Once Chromedriver is downloaded, unzip the *chromedriver* file and copy it to a folder that is accessible to the development environment, such as `/usr/bin/`.

Before running tests, you will need to set up a Python virtual environment, install dependencies, and create an enviconment.cfg file.

```bash
$ cd test/browser_testing/
$ mkvirtualenv oah-tests
$ pip install -r requirements.txt
```

Rename `test/browser_testing/features/example-environment.cfg` to `test/browser_testing/features/environment.cfg` and edit the file to point the `chromedriver_path` to your local chromedriver file.

### Running browser tests

```bash
$ workon oah-tests
$ behave -k
```

## API tests

Before running tests, you will need to set up a Python virtual environment, install dependencies, and create an `environment.cfg` file.

```bash
$ cd test/api_testing/
$ mkvirtualenv oah-tests
$ pip install requests
```

Rename `test/api_testing/features/example-environment.cfg` to `test/api_testing/features/environment.cfg` and edit the file to point `ratechecker_url` and `mortgageinsurance_url` to the environment you wish to test.

```bash
$ workon oah-tests
$ behave -k
```

Run `behave -k -t=~prod_only` to omit production environment tests.

## Load tests

### Installing Jmeter

Run `python jmeter-bootstrap/bin/JMeterInstaller.py` in the `test` folder which will install Jmeter 2.11 and required plugins to run Jmeter locally

### Running load tests locally from the command line:

```
apache-jmeter-2.11/bin/jmeter.sh -t owning-a-home/test/load_testing/RateChecker.jmx -Jserver_url oah.fake.demo.domain -Jthreads=8
```

`-t owning-a-home/test/load_testing/RateChecker.jmx`: this tells Jmeter where the test lives, relative to where Jmeter us running from
`-Jserver_url oah.fake.demo.domain`: this is the URL to runs load tests against.  Replace `oah.fake.demo.domain` with the URL you want
`-Jthreads=8` : this is the maximum number of concurrent users for the load test

OaH.jmx - this test is for the landing pages using all default settings (loan-options, rate-checker, etc)

Rate_Checker.jmx - this test uses the queries listed inside "RC.csv" to run the load test for Rate Checker API. Additional queries can just be added as rows in "RC.csv" and the test will pick them up.

Mortgage_Insurance.jmx - this test uses the queries listed inside "MI.csv" to run the load test for Mortgage Insurance API.  Additional queries can just be added as rows in "MI.csv" and the test will pick them up.

If the number of threads is 6 and the there are 3 rows of queries the test will execute in this order:
```
user 1 - row 1
user 2 - row 2
user 3 - row 3
user 4 - row 1
user 5 - row 2
user 6 - row 3
```


## Contributions
We welcome contributions, in both code and design form, with the understanding that you are contributing to a project that is in the public domain, and anything you contribute to this project will also be released into the public domain. See our [CONTRIBUTING file](https://github.com/cfpb/owning-a-home/blob/master/CONTRIBUTING.md) for more details.
