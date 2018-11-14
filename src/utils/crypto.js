import crypto from 'crypto'
import streamToPromise from 'stream-to-promise'
import { promisify } from 'es6-promisify'

const pbkdf2 = promisify(crypto.pbkdf2)
const randomBytes = promisify(crypto.randomBytes)

const CHARS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()+_-=}{[]|:;"/?.><,`~',
  similarCharacters: /[ilLI|`oO0]/g
}

export async function createKeyDerivation (password, salt, options) {
  const iterations = options.iterations
  const keylen = options.keylen / 8
  const ivlen = options.ivlen / 8
  const digest = options.digest
  const array = await pbkdf2(password, salt, iterations, keylen + ivlen, digest)
  return splitBuffer(array, keylen, ivlen)
}

export async function generateIV (size) {
  const iv = await randomBytes(size / 8)
  return Buffer.from(iv).toString('hex')
}

export async function generateKey (size) {
  const iv = await randomBytes(size / 8)
  return Buffer.from(iv).toString('hex')
}

export async function generatePassword (size, options = { uppercase: true, numbers: true, excludeSimilarCharacters: true }) {
  const len = size / 8
  const generatedChars = await randomBytes(len)
  let chars = CHARS.lowercase
  if (options.uppercase) {
    chars += CHARS.uppercase
  }
  if (options.numbers) {
    chars += CHARS.numbers
  }
  if (options.symbols) {
    chars += CHARS.symbols
  }
  if (options.excludeSimilarCharacters) {
    chars = chars.replace(CHARS.similarCharacters, '')
  }

  const password = new Array(len)
  for (let i = 0; i < len; i++) {
    password[i] = chars[generatedChars[i] % chars.length]
  }

  return password.join('')
}

export async function encrypt (text, key, iv, options) {
  const encryptor = crypto.createCipheriv(options.algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'))
  encryptor.write(text)
  encryptor.end()

  const content = await streamToPromise(encryptor)

  return {
    content: Buffer.from(content).toString('hex'),
    authTag: encryptor.getAuthTag().toString('hex')
  }
}

export function decrypt (text, key, iv, options) {
  const decryptor = crypto.createDecipheriv(options.algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'))
  decryptor.setAuthTag(Buffer.from(text.authTag, 'hex'))
  decryptor.write(text.content, 'hex')
  decryptor.end()

  return streamToPromise(decryptor)
}

function splitBuffer (array, keylen, ivlen) {
  return {
    key: Buffer.from(array.buffer, 0, keylen).toString('hex'),
    iv: Buffer.from(array.buffer, keylen, ivlen).toString('hex')
  }
}
