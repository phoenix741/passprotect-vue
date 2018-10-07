import config from '../../config.yml'
import { SESSION } from '../user/UserService'
import { createKeyDerivation, decrypt, encrypt, generateIV, generatePassword } from '../../utils/crypto'
import { parseErrors } from '../../utils/errors'
import { merge, find, remove, pick, clone } from 'lodash'
import createUpdateLine from './createUpdateLine.gql'
import removeLineQuery from './removeLine.gql'
import getLines from './getLines.gql'
import getGroups from './getGroups.gql'
import getLinesWithDetail from './getLinesWithDetail.gql'
import downloadAsFile from 'download-as-file'
import json2csv from 'json2csv'

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

export async function updateLine (context, line) {
  try {
    const result = await context.$apollo.mutate({
      mutation: createUpdateLine,
      variables: { input: line },
      update (store, { data: { createUpdateLine } }) {
        try {
          const data = store.readQuery({ query: getLines })
          if (!find(data.lines, line => line._id === createUpdateLine._id)) {
            data.lines.push(createUpdateLine)
            store.writeQuery({ query: getLines, data })
          }
        } catch (err) {
          // Store getLines doesn't exists.
        }

        try {
          const dataGroup = store.readQuery({ query: getGroups })
          if (!find(dataGroup.groups, group => group === createUpdateLine.group)) {
            dataGroup.groups.push(createUpdateLine.group)
            store.writeQuery({ query: getGroups, dataGroup })
          }
        } catch (err) {
          // Store getGroups doesn't exists.
        }
      },
      optimisticResponse: {
        __typename: 'Mutation',
        createUpdateLine: merge({
          __typename: 'WalletLine',
          updatedAt: (new Date()).getTime(),
          _id: null,
          _rev: null,
          encryption: {
            __typename: 'EncryptedWalletLine',
            informations: {
              __typename: 'EncryptedContent'
            }
          }
        }, line)
      }
    })

    parseErrors(result.data.createUpdateLine)
  } catch (err) {
    context.error = err
  }
}

export async function removeLine (context, lineId) {
  try {
    const result = await context.$apollo.mutate({
      mutation: removeLineQuery,
      variables: { id: lineId },
      update (store, { data: { removeLine } }) {
        try {
          const data = store.readQuery({ query: getLines })
          if (!removeLine.errors || !removeLine.errors.length) {
            remove(data.lines, line => line._id === lineId)
            store.writeQuery({ query: getLines, data })
          }
        } catch (err) {
          // Store getLines doesn't exist
        }
      },
      optimisticResponse: {
        __typename: 'Mutation',
        removeLine: {
          __typename: 'Errors',
          errors: []
        }
      }
    })

    parseErrors(result.data.removeLine)
  } catch (err) {
    context.error = err
  }
}

export async function encryptLine (clearInformation) {
  const informationsString = JSON.stringify(clearInformation)

  const salt = await generateIV(config.crypto.ivSize)
  const lineKey = await createKeyDerivation(SESSION.clearKey, salt, config.crypto.pbkdf2)

  const informations = await encrypt(Buffer.from(informationsString, 'utf-8'), lineKey.key, lineKey.iv, config.crypto.cypherIv)

  return { salt, informations }
}

export async function decryptLine (line) {
  if (!line.encryption || !line.encryption.informations) {
    return completeFields(line.type, {})
  }

  const salt = line.encryption.salt
  const informationsEncrypted = line.encryption.informations

  const lineKey = await createKeyDerivation(SESSION.clearKey, salt, config.crypto.pbkdf2)
  const informationString = await decrypt(informationsEncrypted, lineKey.key, lineKey.iv, config.crypto.cypherIv)

  return completeFields(line.type, JSON.parse(informationString))
}

export async function generate () {
  return generatePassword(128)
}

export async function exportLinesAsCsv (context) {
  const data = await exportLines(context)
  const csv = json2csv.parse(data)

  return downloadAsFile({ data: csv, filename: 'password.csv' })
}

export async function exportLines (context) {
  const { data: { lines } } = await context.$apollo.query({ query: getLinesWithDetail })

  return Promise.all(lines.map(async line => {
    const copy = clone(line)
    copy.decryptedContent = await decryptLine(copy)

    return merge(
      pick(copy, ['label']),
      pick(copy.decryptedContent, ['username', 'password', 'siteUrl', 'notes']),
      pick(copy.decryptedContent, ['type', 'nameOnCard', 'cardNumber', 'cvv', 'expiry', 'code', 'notes']),
      pick(copy.decryptedContent, ['text', 'notes'])
    )
  }))
}

function completeFields (type, clearInformation) {
  const fields = cardTypeMapping[type].fields
  return merge({}, fields, clearInformation)
}
