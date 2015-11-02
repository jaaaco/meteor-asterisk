#!/usr/bin/env bash
export APP_NAME=asterisk

docker build -t jaaaco/$APP_NAME .
docker run --link mongodb:db -e ROOT_URL=http://localhost -e MONGO_OPLOG_URL=mongodb://db/local -e MONGO_URL=mongodb://db/meteorAsterisk -e METEOR_SETTINGS="`cat server/config/debug.json`" -d jaaaco/$APP_NAME
