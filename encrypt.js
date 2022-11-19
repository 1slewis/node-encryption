import { Util } from './util.js';

const env = {
  fileIn: process.argv[2] || 'message.txt',
  fileOut: process.argv[3] || '.crypto/.encrypt.json',
  logFile: '.crypto/.encrypt.log',
  version: '0.7'
};

function encrypt({
  password,
  message
}) {
  const iv = Util.randomIv();
  const salt = Util.randomSalt();
  const key = Util.hash_sha3_256(password + salt);
  return {
    version: env.version,
    status: 'encrypted',
    salt: salt,
    iv: iv,
    hash2Pass: Util.hash_sha3_256(key),
    message: Util.encrypt_aes_256(key, message, iv),
    hashedMessage: Util.hash_sha3_256(message + salt)
  };
}

async function cmd_line_utility(password) {
  const message =
    Buffer.from(await Util.readFile(env.fileIn));
  const objectOut = encrypt({
    password,
    message
  });
  const stringOut = JSON.stringify(objectOut) + '\n';
  Util.appendFile(env.logFile, stringOut);
  if (objectOut.error) {
    console.error(objectOut.error);
    console.info(objectOut);
    return;
  }
  Util.writeFile(env.fileOut, stringOut);
  console.log(objectOut);
  return;
}

Util.getPassd(cmd_line_utility);
