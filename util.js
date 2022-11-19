import * as process from 'node:process';
import * as crypto from 'node:crypto';
import * as fs from 'node:fs/promises';
import * as readline from 'node:readline';

export class Util {

  static hash_sha3_256(message) {
    const hash = crypto.createHash('sha3-256');
    hash.update(message);
    return hash.digest();
  }

  static encrypt_aes_256(key, message, iv) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    return Buffer.concat([cipher.update(message),
    cipher.final()]);
  }

  static decrypt_aes_256(key, encryptedMessage, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    return Buffer.concat([decipher.update(encryptedMessage),
    decipher.final()]);
  }

  static async importJSON(fileName) {
    return await import(fileName, { assert: { type: 'json' } });
  }

  static async readFile(fileName) {
    return await fs.readFile(fileName);
  }

  static async writeFile(fileName, data) {
    fs.writeFile(fileName, data);
  }

  static async appendFile(fileName, data) {
    fs.appendFile(fileName, data);
  }

  static getPassd(callbackFunction) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Password: ', (password) => {
      callbackFunction(password);
      rl.close();
    });
    return true;
  }

  static randomIv() {
    return crypto.randomBytes(16);
  }
  static randomSalt() {
    return crypto.randomBytes(16);
  }
}
