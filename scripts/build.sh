#!/usr/bin/env bash

lerna run build \
  --scope @digiforce-cloud/dvd-types \
  --scope @digiforce-cloud/dvd-utils \
  --scope @digiforce-cloud/dvd-shell \
  --scope @digiforce-cloud/dvd-editor-core \
  --scope @digiforce-cloud/dvd-editor-skeleton \
  --scope @digiforce-cloud/dvd-designer \
  --scope @digiforce-cloud/dvd-plugin-designer \
  --scope @digiforce-cloud/dvd-plugin-outline-pane \
  --scope @digiforce-cloud/dvd-rax-renderer \
  --scope @digiforce-cloud/dvd-rax-simulator-renderer \
  --scope @digiforce-cloud/dvd-react-renderer \
  --scope @digiforce-cloud/dvd-react-simulator-renderer \
  --scope @digiforce-cloud/dvd-renderer-core \
  --scope @digiforce-cloud/dvd-engine \
  --stream

lerna run build:umd \
  --scope @digiforce-cloud/dvd-engine \
  --scope @digiforce-cloud/dvd-rax-simulator-renderer \
  --scope @digiforce-cloud/dvd-react-simulator-renderer \
  --scope @digiforce-cloud/dvd-react-renderer \
  --stream

cp ./packages/react-simulator-renderer/dist/js/* ./packages/engine/dist/js/
cp ./packages/react-simulator-renderer/dist/css/* ./packages/engine/dist/css/

cp ./packages/rax-simulator-renderer/dist/js/* ./packages/engine/dist/js/
cp ./packages/rax-simulator-renderer/dist/css/* ./packages/engine/dist/css/