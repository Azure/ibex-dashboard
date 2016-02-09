#!/bin/bash

git init
git config user.name "Travis CI"
git config user.email "erisch@microsoft.com"

echo 'Adding files to local repo '
ls -ltr
git add .
git add --force dist/*
git commit -m "Deploy"

GIT_USERNAME="dokku"
GIT_TARGET_URL="${GIT_USERNAME}@${AZURE_WA_GIT_TARGET}:${DOKKU_APPNAME}"

eval "$(ssh-agent -s)"
ssh-agent -s

echo 'Adding decrypted SSH private keys for deployment'
. ./scripts/deploy_passphrase.exp

echo 'Private keys added. Starting Dokku Deployment'
git remote add $GIT_USERNAME $GIT_TARGET_URL
. ./scripts/dokku_git_push.exp

echo 'Deployed!!'
