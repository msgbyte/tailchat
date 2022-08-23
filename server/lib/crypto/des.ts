import crypto from 'crypto';
import { config } from 'tailchat-server-sdk';

// DES 加密
export function desEncrypt(message: string, key: string = config.secret) {
  key =
    key.length >= 8 ? key.slice(0, 8) : key.concat('0'.repeat(8 - key.length));
  const keyHex = new Buffer(key);
  const cipher = crypto.createCipheriv('des-cbc', keyHex, keyHex);
  let c = cipher.update(message, 'utf8', 'base64');
  c += cipher.final('base64');
  return c;
}

// DES 解密
export function desDecrypt(text: string, key: string = config.secret) {
  key =
    key.length >= 8 ? key.slice(0, 8) : key.concat('0'.repeat(8 - key.length));
  const keyHex = new Buffer(key);
  const cipher = crypto.createDecipheriv('des-cbc', keyHex, keyHex);
  let c = cipher.update(text, 'base64', 'utf8');
  c += cipher.final('utf8');
  return c;
}
