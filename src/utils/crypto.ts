import { CipherGCM, DecipherGCM, CipherGCMTypes, CipherGCMOptions } from 'crypto';
import { EncryptedBlock, EncryptedBlockInput } from '@/generated/graphql';

const CHARS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()+_-=}{[]|:;"/?.><,`~',
  similarCharacters: /[ilLI|`oO0]/g,
};

export interface KeyIV {
  key: Buffer;
  iv: Buffer;
}

export interface GeneratePasswordOptions {
  uppercase?: boolean;
  numbers?: boolean;
  excludeSimilarCharacters?: boolean;
  symbols?: boolean;
}

export interface OptionEncryptDecrypt {
  algorithm: CipherGCMTypes;
  digest: string;
  iterations: number;
  ivSize: number;
  saltSize: number;
  keySize: number;
}

export interface EncryptionContent {
  salt: Buffer;
  iv: Buffer;
  content: Buffer;
  authTag: Buffer;
}

export type EncryptionContentV1 = Omit<EncryptionContent, 'iv'>;

export function getEncryptedContent(encryptedBlock: EncryptedBlock): EncryptionContent | EncryptionContentV1 {
  return {
    salt: Buffer.from(encryptedBlock.salt, 'base64'),
    iv: (encryptedBlock.iv && Buffer.from(encryptedBlock.iv, 'base64')) || undefined,
    content: Buffer.from(Buffer.from(encryptedBlock.content, 'base64').toString(), 'hex'),
    authTag: Buffer.from(Buffer.from(encryptedBlock.authTag, 'base64').toString(), 'hex'),
  };
}

export function getEncryptedBlockInput(encryptedBlock: EncryptionContent): EncryptedBlockInput {
  return {
    salt: encryptedBlock.salt.toString('base64'),
    iv: encryptedBlock.iv.toString('base64'),
    content: Buffer.from(encryptedBlock.content.toString('hex')).toString('base64'),
    authTag: Buffer.from(encryptedBlock.authTag.toString('hex')).toString('base64'),
  };
}

export async function generateSalt(size: number): Promise<Buffer> {
  return randomBytes(size / 8);
}

export async function generateIV(size: number): Promise<Buffer> {
  return randomBytes(size / 8);
}

export async function generateKey(size: number): Promise<Buffer> {
  return randomBytes(size / 8);
}

export async function generatePassword(
  size: number,
  options: GeneratePasswordOptions = {
    uppercase: true,
    numbers: true,
    excludeSimilarCharacters: true,
  },
) {
  const len = size / 8;
  const generatedChars = await randomBytes(len);
  let chars = CHARS.lowercase;
  if (options.uppercase) {
    chars += CHARS.uppercase;
  }
  if (options.numbers) {
    chars += CHARS.numbers;
  }
  if (options.symbols) {
    chars += CHARS.symbols;
  }
  if (options.excludeSimilarCharacters) {
    chars = chars.replace(CHARS.similarCharacters, '');
  }

  const password = new Array(len);
  for (let i = 0; i < len; i++) {
    password[i] = chars[generatedChars[i] % chars.length];
  }

  return password.join('');
}

export async function encrypt(text: string | Buffer, masterkey: Buffer | string, options: OptionEncryptDecrypt): Promise<EncryptionContent> {
  const iv = await generateIV(options.ivSize);
  const salt = await generateSalt(options.saltSize);
  const key = await pbkdf2(masterkey, salt, options.iterations, options.keySize / 8, 'sha512');

  const [content, authTag] = await createCipheriv(options.algorithm, key, iv, text);

  return { salt, iv, content, authTag };
}

export async function decrypt(
  text: EncryptionContent | EncryptionContentV1,
  masterkey: Buffer | string,
  options: OptionEncryptDecrypt,
): Promise<Buffer> {
  if (!isEncryptionContent(text)) {
    return decryptWithoutIv(text, masterkey, options);
  }

  const key = await pbkdf2(masterkey, text.salt, options.iterations, options.keySize / 8, options.digest);
  return createDecipheriv(options.algorithm, key, text.iv, text.authTag, text.content);
}

export async function decryptWithoutIv(text: EncryptionContentV1, masterkey: Buffer | string, options: OptionEncryptDecrypt): Promise<Buffer> {
  const keyAndIv = await pbkdf2(masterkey, text.salt, options.iterations, (options.keySize + options.ivSize) / 8, options.digest);
  const { key, iv } = splitBuffer(keyAndIv, options.keySize / 8, options.ivSize / 8);

  return createDecipheriv(options.algorithm, key, iv, text.authTag, text.content);
}

function splitBuffer(array: Buffer, keylen: number, ivlen: number): KeyIV {
  return {
    key: Buffer.from(array.buffer, 0, keylen),
    iv: Buffer.from(array.buffer, keylen, ivlen),
  };
}

function isEncryptionContent(text: EncryptionContent | EncryptionContentV1): text is EncryptionContent {
  return text.hasOwnProperty('iv') && !!(<EncryptionContent>text).iv;
}

/* ************************************************* Dynamic crypto ********************************* */

function importNodeJSCrypto() {
  return import('crypto');
}

async function pbkdf2(password: string | Buffer, salt: string | Buffer, iterations: number, keylen: number, digest: string): Promise<Buffer> {
  const { promisify } = await import('es6-promisify');
  const crypto = await importNodeJSCrypto();
  const nodeJSpbkdf2 = promisify(crypto.pbkdf2);
  return nodeJSpbkdf2(password, salt, iterations, keylen, digest);
}

async function randomBytes(size: number): Promise<Buffer> {
  const { promisify } = await import('es6-promisify');
  const crypto = await importNodeJSCrypto();
  const nodeJSRandomBytes = promisify(crypto.randomBytes);
  return nodeJSRandomBytes(size);
}

async function createDecipheriv(
  algorithm: CipherGCMTypes,
  key: string | Buffer,
  iv: string | Buffer,
  authTag: Buffer,
  content: Buffer | string,
  options?: CipherGCMOptions,
): Promise<Buffer> {
  const streamToPromise = (await import('stream-to-promise')).default;
  const crypto = await importNodeJSCrypto();

  const decryptor: DecipherGCM = crypto.createDecipheriv(algorithm, key, iv, options) as DecipherGCM;
  decryptor.setAuthTag(authTag);
  decryptor.write(content);
  decryptor.end();

  return streamToPromise(decryptor);
}

async function createCipheriv(
  algorithm: CipherGCMTypes,
  key: string | Buffer,
  iv: string | Buffer,
  content: string | Buffer,
  options?: CipherGCMOptions,
): Promise<[Buffer, Buffer]> {
  const streamToPromise = (await import('stream-to-promise')).default;
  const crypto = await importNodeJSCrypto();

  const encryptor: CipherGCM = crypto.createCipheriv(algorithm, key, iv, options) as CipherGCM;
  encryptor.write(content);
  encryptor.end();

  return [await streamToPromise(encryptor), encryptor.getAuthTag()];
}
