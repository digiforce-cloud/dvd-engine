#!/usr/bin/env bash

rm -rf node_modules package-lock.json yarn.lock
lerna clean -y
find ./packages -type f -name "package-lock.json" -exec rm -f {} \;

lerna bootstrap

lerna exec --stream \
  --scope @digiforce-cloud/dvd-editor-core \
  --scope @digiforce-cloud/dvd-types \
  --scope @digiforce-cloud/dvd-utils \
  -- npm run build
