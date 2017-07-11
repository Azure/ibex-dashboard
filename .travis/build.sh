#!/usr/bin/env bash

pushd client
yarn build
rm -rf ../build
mv build ..
popd