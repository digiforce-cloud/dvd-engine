#!/usr/bin/env bash

pkgName="@digiforce-cloud/dvd-ignitor"

if [ "$1" ]; then
  pkgName="$1"
fi

lerna exec --scope $pkgName -- npm start
