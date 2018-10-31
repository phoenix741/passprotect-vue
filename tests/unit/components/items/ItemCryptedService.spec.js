import { encryptLine, decryptLine, generate } from '@/components/items/ItemCryptedService'
import { SESSION } from '@/components/user/UserService'

describe('ItemService.js', () => {
  describe('#encryptLine', () => {
    beforeEach(() => {
      SESSION.clearKey = 'clearKey'
    })

    afterEach(() => {
      delete SESSION.clearKey
    })

    it('encrypt / decrypt', async () => {
      const clearInformation = {
        cardType: 'VISA',
        cardNumber: '1234 5678 9012 1234'
      }
      const cryptedInformation = await encryptLine(clearInformation)
      const line = {
        type: 'card',
        encryption: cryptedInformation
      }

      const decryptedInformation = await decryptLine(line)
      expect(decryptedInformation).toEqual({
        group: '',
        logo: '',
        type: '',
        nameOnCard: '',
        cardNumber: '1234 5678 9012 1234',
        cvv: '',
        expiry: '',
        code: '',
        notes: '',
        cardType: 'VISA'
      })
    })
  })

  describe('#decryptLine', () => {
    it('empty lines', async () => {
      const empty = { group: '', logo: '', type: '', nameOnCard: '', cardNumber: '', cvv: '', expiry: '', code: '', notes: '' }
      const info1 = await decryptLine({ type: 'card' })
      const info2 = await decryptLine({ type: 'card', encryption: {} })

      expect(info1).toEqual(empty)
      expect(info2).toEqual(empty)
    })
  })

  describe('#generate', () => {
    it('generate a password', async () => {
      const password = await generate()
      expect(password.length).toEqual(16)
      expect(password).toEqual(expect.stringMatching(/[a-zA-Z0-9!"#$%&\\'()*+,-./:;<=>?@\[\\\]\^_`{|}~]+/)) // eslint-disable-line
    })
  })
})
