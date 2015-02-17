#!/bin/sh

if [ ! -f config/config.json ]; then
    echo "Creating empty config file..."
    cp config/example-config.json config/config.json
fi

npm install
grunt build