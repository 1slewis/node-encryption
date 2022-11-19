import { Util } from './util.js';

const env = {
  fileIn: process.argv[2] || '.crypto/.encrypt.json',
  fileOut: process.argv[3] || 'decrypt.txt',
  logFile: '.crypto/.decrypt.log',
  version: '0.7',
  ifOveride: false
};

function decrypt({
  password,
  salt,
  iv,
  hashed2Pass,
  message,
  hashedMessage,
  status,
  version,
  ifOveride
}) {
  const key = Util.hash_sha3_256(password + salt);
  const hash2Pass = Util.hash_sha3_256(key);
  const decrypt = Util.decrypt_aes_256(key, message, iv);
  const hashMessage = Util.hash_sha3_256(decrypt + salt)
  const ifError = !hash2Pass.equals(hashed2Pass) || !hashMessage.equals(hashedMessage) || status !== 'encrypted' || version !== env.version;
  if (ifError && !ifOveride) {
    return {
      error: {
        [hashed2Pass.toString()]: hash2Pass.toString(),
        [hashedMessage.toString()]: hashMessage.toString(),
        ['encrypted']: status,
        [env.version]: version
      }
    };
  }
  return {
    version: env.version,
    status: 'decrypted',
    message: decrypt
  };
}

async function cmd_line_utility(password) {
  const stringIn = await Util.readFile(env.fileIn);
  const objectIn = JSON.parse(stringIn);
  const objectOut = decrypt({
    password,
    salt: Buffer.from(objectIn.salt.data),
    iv: Buffer.from(objectIn.iv.data),
    hashed2Pass: Buffer.from(objectIn.hash2Pass.data),
    message: Buffer.from(objectIn.message.data),
    hashedMessage: Buffer.from(objectIn.hashedMessage.data),
    status: objectIn.status,
    version: objectIn.version,
    ifOveride: env.ifOveride
  });
  /*
  const stringOut = JSON.stringify(objectOut) + '\n';
  Util.appendFile(env.logFile, stringOut);
  */
  if (objectOut.error) {
    console.error(objectOut.error);
    return;
  }
  Util.writeFile(env.fileOut, objectOut.message.toString());
  console.log(objectOut);
  console.log(objectOut.message.toString());
  return;
}

Util.getPassd(cmd_line_utility);
