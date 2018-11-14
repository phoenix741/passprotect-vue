import { parseErrors } from '../../utils/errors'
import { pick } from '../../utils/lodash'
import deepmerge from 'deepmerge'
import createUpdateLine from './createUpdateLine.gql'
import removeLineQuery from './removeLine.gql'
import getLines from './getLines.gql'
import getGroups from './getGroups.gql'
import getLinesWithDetail from './getLinesWithDetail.gql'
import { decryptLine } from './ItemCryptedService'

export async function updateLine (context, line) {
  try {
    const result = await context.$apollo.mutate({
      mutation: createUpdateLine,
      variables: { input: line },
      update (store, { data: { createUpdateLine } }) {
        try {
          const data = store.readQuery({ query: getLines })
          if (!data.lines.find(line => line._id === createUpdateLine._id)) {
            data.lines.push(createUpdateLine)
            store.writeQuery({ query: getLines, data })
          }
        } catch (err) {
          // Store getLines doesn't exists.
          console.log(err)
        }

        try {
          const dataGroup = store.readQuery({ query: getGroups })
          if (!dataGroup.groups.find(group => group === createUpdateLine.group)) {
            dataGroup.groups.push(createUpdateLine.group)
            store.writeQuery({ query: getGroups, dataGroup })
          }
        } catch (err) {
          // Store getGroups doesn't exists.
          console.log(err)
        }
      },
      optimisticResponse: {
        __typename: 'Mutation',
        createUpdateLine: deepmerge({
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
            data.lines = data.lines.filter(line => line._id !== lineId)
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

export async function exportLinesAsCsv (context) {
  const json2csv = import(/* webpackChunkName: "csv" */ 'json2csv')
  const downloadAsFile = import(/* webpackChunkName: "csv" */ 'download-as-file')

  const data = await exportLines(context)
  const csv = (await json2csv).parse(data)

  return (await downloadAsFile).default({ data: csv, filename: 'password.csv' })
}

export async function exportLines (context) {
  const { data: { lines } } = await context.$apollo.query({ query: getLinesWithDetail })

  const result = []
  for await (const line of lines) {
    const copy = Object.assign({}, line)
    copy.decryptedContent = await decryptLine(copy)

    result.push(Object.assign({},
      pick(copy, ['label']),
      pick(copy.decryptedContent, ['username', 'password', 'siteUrl', 'notes']),
      pick(copy.decryptedContent, ['type', 'nameOnCard', 'cardNumber', 'cvv', 'expiry', 'code', 'notes']),
      pick(copy.decryptedContent, ['text', 'notes'])
    ))
  }
  return result
}
