#!/bin/sh

set -ev

if [ ! -f config/config.json ]; then
  cp config/example-config.json config/config.json
fi

npm install

if [ $DEPLOY_ENV = "PROD" ]; then
  echo "Running grunt production-deploy"
  grunt production-deploy
else
  echo "Running grunt dev-deploy"
  grunt dev-deploy
fi