#!/bin/sh

set -ev

if [ ! -f config/config.json ]; then
  cp config/example-config.json config/config.json
fi

npm install

if [ $DEPLOY_ENV = "PROD" ]; then
  grunt production-deploy
elif [ $DEPLOY_ENV = "DEV" ]; then
  grunt dev-deploy
fi