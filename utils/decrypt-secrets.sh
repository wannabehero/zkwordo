#!/bin/sh
# usage: ./decrypt-secrets.sh <passphrase>

gpg --yes --quiet --batch --decrypt-files --passphrase $1 `find . -name '*.gpg'`