import config from '../../config.yml'
import createSession from './createSession.gql'
import registerUser from './registerUser.gql'
import { generateIV, generateKey, encrypt, decrypt, createKeyDerivation } from '../../utils/crypto'
import { parseErrors } from '../../utils/errors'
import { onLogin, onLogout } from '../../plugins/vue-apollo'

export let SESSION = {
  authenticated: false
}

export async function login (context, creds, redirect) {
  try {
    const response = await context.$apollo.mutate({
      mutation: createSession,
      variables: { input: creds }
    })

    parseErrors(response.data.createSession)

    const clearKey = await createClearKey(response.data.createSession.user, creds.password)

    SESSION.jwtToken = response.data.createSession.token
    SESSION.username = creds.username
    SESSION.clearKey = clearKey
    SESSION.authenticated = true

    const [, token] = SESSION.jwtToken.split(' ')

    await onLogin(context.$apollo.provider.defaultClient, token)

    if (redirect) {
      context.$router.replace(redirect)
    } else {
      context.$router.replace('/items')
    }
  } catch (err) {
    context.errors.add({ field: err.fieldName, msg: err.message })
  }
}

export async function signup (context, creds, redirect) {
  // Idem login avec mutation signup + récup token
  try {
    const encryption = await generateMasterKey(creds.username, creds.password)
    const result = await context.$apollo.mutate({
      mutation: registerUser,
      variables: { input: { _id: creds.username, password: creds.password, encryption } }
    })

    parseErrors(result.data.registerUser)

    return await login(context, creds, redirect)
  } catch (err) {
    context.errors.add({ field: err.fieldName, msg: err.message })
    console.log(err)
  }
}

export async function logout (context) {
  SESSION.authenticated = false
  delete SESSION.username
  delete SESSION.jwtToken
  delete SESSION.clearKey

  await onLogout(context.$apollo.provider.defaultClient)

  context.$apollo.provider.defaultClient.resetStore()
  context.$router.push('/login')
}

async function generateMasterKey (user, password) {
  const salt = await generateIV(config.crypto.ivSize)
  const masterKey = await generateKey(config.crypto.keySize)
  const masterKeyKey = await createKeyDerivation(password, salt, config.crypto.pbkdf2)

  const encryptedKey = await encrypt(masterKey, masterKeyKey.key, masterKeyKey.iv, config.crypto.cypherIv)

  return { salt, encryptedKey }
}

async function createClearKey (user, password) {
  const salt = user.encryption.salt
  const masterKeyKey = await createKeyDerivation(password, salt, config.crypto.pbkdf2)

  const key = masterKeyKey.key
  const iv = masterKeyKey.iv
  const encryptedKey = user.encryption.encryptedKey

  const clearKey = await decrypt(encryptedKey, key, iv, config.crypto.cypherIv)

  return clearKey.toString('binary')
}
