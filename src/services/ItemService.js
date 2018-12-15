import getLines from '../graphql/item/getLines.gql'
import { parseErrors } from '../utils/errors'

export async function fetchItems ($apollo) {
  const response = await $apollo.query({
    query: getLines
  })

  parseErrors(response.data.lines)

  return response.data.lines
}

export function sortByGroupLabel (l1, l2) {
  const result = l1.group && l1.group.localeCompare(l2.group)
  if (result === 0) {
    return l1.label && l1.label.localeCompare(l2.label)
  }
  return result
}

export function filterLines (lines, q) {
  const searchFilter = !!q && new RegExp(q)
  return lines.filter(line => !searchFilter || searchFilter.test(line.label) || searchFilter.test(line.group))
}

export function groupLineByGroup (lines) {
  return lines
    .sort(sortByGroupLabel)
    .reduce((acc, line) => Object.assign(acc, { [line.group]: (acc[line.group] || []).concat(line) }), {})
}
