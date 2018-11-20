import config from '../config.yml'
import { generateIV, generateKey, encrypt, decrypt, createKeyDerivation } from '../utils/crypto'
import createSession from '../graphql/user/createSession.gql'
import registerUser from '../graphql/user/registerUser.gql'
import { parseErrors } from '../utils/errors'

export async function login ($apollo, creds) {
  const response = await $apollo.mutate({
    mutation: createSession,
    variables: { input: creds }
  })

  parseErrors(response.data.createSession)

  const clearKey = await createClearKey(response.data.createSession.user, creds.password)
  return {
    username: response.data.createSession.user._id,
    jwtToken: response.data.createSession.token,
    clearKey
  }
}

export async function signup ($apollo, creds) {
  const encryption = await generateMasterKey(creds.username, creds.password)
  const result = await $apollo.mutate({
    mutation: registerUser,
    variables: { input: { _id: creds.username, password: creds.password, encryption } }
  })

  parseErrors(result.data.registerUser)
}

export async function generateMasterKey (user, password) {
  const salt = await generateIV(config.crypto.ivSize)
  const masterKey = await generateKey(config.crypto.keySize)
  const masterKeyKey = await createKeyDerivation(password, salt, config.crypto.pbkdf2)

  const encryptedKey = await encrypt(masterKey, masterKeyKey.key, masterKeyKey.iv, config.crypto.cypherIv)

  return { salt, encryptedKey }
}

export async function createClearKey (user, password) {
  const salt = user.encryption.salt
  const masterKeyKey = await createKeyDerivation(password, salt, config.crypto.pbkdf2)

  const key = masterKeyKey.key
  const iv = masterKeyKey.iv
  const encryptedKey = user.encryption.encryptedKey

  const clearKey = await decrypt(encryptedKey, key, iv, config.crypto.cypherIv)

  return clearKey.toString('binary')
}
