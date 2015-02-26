#!/bin/sh

set -ev

if [ ! -f config/config.json ]; then
  cp config/example-config.json config/config.json
fi

npm install -g grunt-cli
npm install
grunt build