import { parseErrors } from '@/utils/errors'

describe('errors.js', () => {
  describe('#parseErrors', () => {
    it('Parse error when there is not error', () => {
      expect(() => parseErrors()).not.toThrow()
      expect(() => parseErrors({})).not.toThrow()
      expect(() => parseErrors({ errors: [] })).not.toThrow()
    })

    it('Parse error will throw when there is one error', () => {
      expect(() => parseErrors({ errors: [ { fieldName: 'fieldName', message: 'message' } ] })).toThrow(Error, 'message')
    })

    it('Parse error will throw when there is two error', () => {
      expect(() => parseErrors({ errors: [ { fieldName: 'fieldName', message: 'message2' }, { fieldName: 'fieldName', message: 'message' } ] })).toThrow(Error, 'message2')
    })
  })
})
