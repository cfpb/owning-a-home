# owning-a-home

[![Build Status](https://travis-ci.org/cfpb/owning-a-home.svg?branch=master)](https://travis-ci.org/cfpb/owning-a-home)

## This project is a work in progress
Nothing presented in the issues or in this repo is a final product unless it is marked as such or appears on www.consumerfinance.gov/owning-a-home. Some copy or formulas may be replaced with dummy text to ensure that we follow any and all privacy and security procedures at the CFPB. All the designs, layouts, and evolution of our decision making process are accurate.

## We want your feedback, but will not be able to respond to everyone
We are working under an agile framework, and plan to use this repo to publish, receive feedback, and iterate on that feedback as often as possible. Our goal is to see user trends and reactions to our work. We want as much feedback as possible to help us make informed decisions so that we can make this tool better. Unfortunately, we will not be able to respond to every piece of feedback or comment we receive, but intend to respond with our progress through the evolution of the tool.

## Requirements

- [Sheer](https://github.com/cfpb/sheer)
- [Elasticsearch](http://www.elasticsearch.org/)
- [Node](http://nodejs.org/)
- [Grunt](http://gruntjs.com/)
- [Bower](http://bower.io/)

## Getting up and running with sheer

[Sheer](https://github.com/cfpb/sheer) is "A Jekyll-inspired, elasticsearch-powered, CMS-less publishing tool."

To get started with Sheer:

Install [Elasticsearch](http://www.elasticsearch.org/) however you'd like. (we use [homebrew](http://brew.sh/))::

```
$ brew install elasticsearch
```

Check out the sheer Github project:
```
$ git clone https://github.com/cfpb/sheer.git
```

create a virtualenv for sheer:
```
$ mkvirtualenv sheer
```

The new virtualenv will activate right away. to activate it later on (say, in a new terminal session) use the command "workon sheer"

Install sheer into the virtualenv with the -e flag (which allows you to make changes to sheer itself):

```
$ pip install -e ~/path/to/sheer
```

Install sheer's python requirements:

```
$ pip install -r ~/path/to/sheer/requirements.txt
```

You should now be able to run the sheer command:
```
$ sheer

usage: sheer [-h] [--debug] {inspect,index,serve} ...
sheer: error: too few arguments
```

## Configuration

Currently owning-a-home's Rate Checker is powered by a private API that returns mortgage rate data. To configure owning-a-home you will need to point to an API url in `config/config.js`. To do this:

In the config folder, copy the `example-config.js` file and rename it `config.js`

Change line 3 to point to an appropriate API url:

```javascript
config.rateCheckerAPI = 'YOUR API URL HERE';
```

## Working with the front end

The owning-a-home front-end currently uses the following:

- [LESS](http://lesscss.org/)
- [Capital Framework](http://cfpb.github.io/capital-framework/)
- [Grunt](http://gruntjs.com/)
- node/CommonJS style modules (compiled with [Browserify](http://browserify.org/))
- [Bower](http://bower.io/) & [npm](https://www.npmjs.org/) for package management

### Installing dependencies (one time)

1. Install [node.js](http://nodejs.org/) however you'd like.
2. Install [Grunt](http://gruntjs.com/), [Bower](http://bower.io/) and [Browserify](http://browserify.org/):

```
$ npm install -g grunt-cli bower browserify
```

## Developing

Each time you fetch from upstream, install dependencies with npm and run `grunt` to build everything:

```bash
$ npm install
$ grunt
```

To work on the app you will need sheer running to compile the templates in `_layouts`. There is also a `grunt watch` command that will recompile Less and JS on the fly while you're developing.

```bash
# use the sheer virtualenv
$ workon sheer

# navigate to the built app directory that grunt created
$ cd dist

# start sheer
$ sheer serve

# open a new command prompt and run:
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

Rename `test/browser_testing/features/example-environment.cfg` to `environtment.cfg` and edit the file to point the `chromedriver_path` to your local chromedriver file.

### Running browser tests

```bash
$ workon oah-tests
$ behave -k
```

## Load tests

### Installing Jmeter

Run "jmeter-bootstrap/bin/JMeterInstaller.py" which will install Jmeter 2.11 and required plugins to run Jmeter locally

### Running load tests locally from the command line:

apache-jmeter-2.11/bin/jmeter.sh -t owning-a-home/test/load_testing/RateChecker.jmx -Jserver_url oah.fake.demo.domain -Jthreads=8

-t : this tells Jmeter where the test lives, relative to where Jmeter us running from
-Jserver URL : this is the URL to runs load tests against
-Jthreads : this is the maximum number of concurrent users for the load test

OaH.jmx - this test is for the landing pages using all default settings (loan-options, rate-checker, etc)

Rate_Checker.jmx - this test uses the queries listed inside "RC.csv" to run the load test. Additional queries can just be added as rows in "RC.csv" and the test will pick them up.

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
