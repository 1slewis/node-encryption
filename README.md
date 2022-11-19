# node-encryption

## Default

Both require password at runtime via Standard Input.

### Encryption
Put the message you want to encrypt in a message.txt file in the same folder as the encrypt.js script.
The output will be in .crypto/.encrypt.json relative to the encrypt.js script.
By default, local logs are turned on (These are not a security risk).

### Decryption
It will take a file in .crypto/.encrypt.json and decrypt it.
The output will be in decrypt.txt.
By default, local logs are turned off (as they are a security risk).

## How to run
Just how you run normal node scripts.
node encrypt.js
node decrypt.js

## Basic customising
Both scripts you can customise by choosing which file as input and output at runtime.
node encrypt.js mySecret.txt encryptedSecret.json
node decrypt.js encryptedSecret.json myDecryptedSecret.txt

You can also disable checking of tampering by setting env.ifOveride to true (only in decrypt.js).
