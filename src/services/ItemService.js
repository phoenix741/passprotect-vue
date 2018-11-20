import getLines from '../graphql/item/getLines.gql'
import { parseErrors } from '../utils/errors'

export async function fetchItems ($apollo) {
  const response = await $apollo.query({
    query: getLines
  })

  parseErrors(response.data.lines)

  return response.data.lines
}
