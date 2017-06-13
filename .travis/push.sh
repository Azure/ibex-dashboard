#!/usr/bin/env bash

set -euo pipefail

readonly GITHUB_ORG="${GITHUB_ORG:-CatalystCode}"
readonly GITHUB_REPO="${GITHUB_REPO:-ibex-dashboard}"
readonly TARGET_BRANCH="${TARGET_BRANCH:-master}"

log() {
  echo "$@" >&2
}

ensure_preconditions_met() {
  if [ "${TRAVIS_BRANCH}" != "${TARGET_BRANCH}" ]; then
    log "Build is targetting ${TRAVIS_BRANCH}, not ${TARGET_BRANCH}"
    log "Skipping creation of production build"
    exit 0
  fi
  if [ -z "${GITHUB_TOKEN}" ]; then
    log "GITHUB_TOKEN not set: won't be able to push production build"
    log "Please configure the token in .travis.yml or the Travis UI"
    exit 1
  fi
}

create_production_build() {
  CI="" yarn build
}

setup_git() {
  git config user.name "Travis CI"
  git config user.email "travis@travis-ci.org"
  git remote add origin-travis "https://${GITHUB_TOKEN}@github.com/${GITHUB_ORG}/${GITHUB_REPO}.git"
}

commit_build_files() {
  git checkout "${TARGET_BRANCH}"
  git add --all build
  echo -e "Travis build: ${TRAVIS_BUILD_NUMBER}\n\nhttps://travis-ci.org/${GITHUB_ORG}/${GITHUB_REPO}/builds/${TRAVIS_BUILD_ID}" | git commit --file -
}

push_to_github() {
  git push origin-travis "${TARGET_BRANCH}:${TARGET_BRANCH}"
}

ensure_preconditions_met
create_production_build
setup_git
commit_build_files
push_to_github