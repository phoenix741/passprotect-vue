import config from '../../config.yml'
import { createKeyDerivation, decrypt, encrypt, generateIV, generatePassword } from '../../utils/crypto'

export const cardTypeMapping = {
  card: {
    label: 'list.type.card',
    icon: 'credit_card',
    color: 'red',
    fields: {
      group: '',
      type: '',
      nameOnCard: '',
      cardNumber: '',
      cvv: '',
      expiry: '',
      code: '',
      logo: '',
      notes: ''
    }
  },
  password: {
    label: 'list.type.password',
    icon: 'fingerprint',
    color: 'blue',
    fields: {
      group: '',
      username: '',
      password: '',
      siteUrl: '',
      logo: '',
      notes: ''
    }
  },
  text: {
    label: 'list.type.text',
    icon: 'text_fields',
    color: 'green',
    fields: {
      group: '',
      text: '',
      logo: '',
      notes: ''
    }
  }
}

export async function encryptLine (clearKey, clearInformation) {
  const informationsString = JSON.stringify(clearInformation)

  const salt = await generateIV(config.crypto.ivSize)
  const lineKey = await createKeyDerivation(clearKey, salt, config.crypto.pbkdf2)

  const informations = await encrypt(Buffer.from(informationsString, 'utf-8'), lineKey.key, lineKey.iv, config.crypto.cypherIv)

  return { salt, informations }
}

export async function decryptLine (clearKey, line) {
  if (!line.encryption || !line.encryption.informations) {
    return completeFields(line.type, {})
  }

  const salt = line.encryption.salt
  const informationsEncrypted = line.encryption.informations

  const lineKey = await createKeyDerivation(clearKey, salt, config.crypto.pbkdf2)
  const informationString = await decrypt(informationsEncrypted, lineKey.key, lineKey.iv, config.crypto.cypherIv)

  return completeFields(line.type, JSON.parse(informationString))
}

export async function generate () {
  return generatePassword(128)
}

function completeFields (type, clearInformation) {
  const fields = cardTypeMapping[type].fields
  return Object.assign({}, fields, clearInformation)
}
