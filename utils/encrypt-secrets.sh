#!/bin/sh
# usage: ./encrypt-secrets.sh <passphrase>

files_to_encrypt=(
    'snarks/words.wasm'
    'snarks/words_plonk.zkey'
)

# encrypt files from array
for file in "${files_to_encrypt[@]}"; do
    echo "\ndeleting $file.gpg"
    rm -f $file.gpg

    echo "encrypting $file"
    gpg --cipher-algo AES256 --symmetric --pinentry-mode loopback --passphrase $1 $file
done
