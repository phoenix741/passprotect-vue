/* global localStorage */

import { login, logout, signup, SESSION } from '@/components/user/UserService'

describe('UserService.js', () => {
  const responseRegister = {
    data: {
      registerUser: {}
    }
  }
  const responseSignin = {
    data: {
      createSession: {
        token: 'jwtToken',
        user: {
          encryption: {
            salt: 'salt1',
            encryptedKey: { content: '65d73be2490996f24b7f54e0ac48f6', authTag: 'ada3386bd63223e7ea6923767c00128a' }
          }
        }
      }
    }
  }

  describe('#login', () => {
    let context, creds

    beforeEach(() => {
      creds = {
        username: 'CREDENTIALS',
        password: 'password1'
      }
      context = {
        $apollo: {
          mutate: jest.fn(() => Promise.resolve(responseSignin)),
          provider: {
            defaultClient: {
              resetStore: jest.fn()
            }
          }
        },
        $router: {
          replace: jest.fn()
        },
        errors: {
          add: jest.fn()
        }
      }
    })

    afterEach(() => {
      SESSION.authenticated = false
    })

    it('Try to login to server with success without redirect', async () => {
      await login(context, creds)

      expect(context.errors.add).not.toBeCalled()
      expect(context.$router.replace).toBeCalledWith('/items')
      expect(SESSION.authenticated).toBe(true)
      expect(SESSION.jwtToken).toBe('jwtToken')
      expect(SESSION.username).toBe('CREDENTIALS')
      expect(SESSION.clearKey).toBe('text to encrypt')
    })

    it('Try to login to server with success with redirect', async () => {
      await login(context, creds, 'mytest')

      expect(context.errors.add).not.toBeCalled()
      expect(context.$router.replace).toBeCalledWith('mytest')

      expect(SESSION.authenticated).toBe(true)
      expect(SESSION.jwtToken).toBe('jwtToken')
      expect(SESSION.username).toBe('CREDENTIALS')
      expect(SESSION.clearKey).toBe('text to encrypt')
    })

    it('Try to login to server with failure', async () => {
      const error = new Error('loginerror')
      error.fieldName = 'username'
      context.$apollo.mutate = jest.fn(() => Promise.reject(error))

      await login(context, creds)

      expect(context.errors.add).toBeCalledWith({ field: 'username', msg: 'loginerror' })
      expect(SESSION.authenticated).toBe(false)
    })
  })

  describe('#signup', () => {
    let context, creds
    beforeEach(() => {
      creds = {
        username: 'CREDENTIALS',
        password: 'password1'
      }
      context = {
        $apollo: {
          mutate: jest.fn()
            .mockReturnValueOnce(Promise.resolve(responseRegister))
            .mockReturnValueOnce(Promise.resolve(responseSignin)),
          provider: {
            defaultClient: {
              resetStore: jest.fn()
            }
          }
        },
        $router: {
          replace: jest.fn()
        },
        errors: {
          add: jest.fn()
        }
      }
    })

    afterEach(() => {
      SESSION.authenticated = false
    })

    it('Sign with no error', async () => {
      await signup(context, creds)

      expect(context.errors.add).not.toBeCalled()
      expect(context.$router.replace).toBeCalledWith('/items')
      expect(SESSION.authenticated).toEqual(true)
      expect(SESSION.jwtToken).toEqual('jwtToken')
      expect(SESSION.username).toEqual('CREDENTIALS')
      expect(SESSION.clearKey).toEqual('text to encrypt')
    })

    it('Sign with error', async () => {
      const error = new Error('signinerror')
      error.fieldName = 'username'
      context.$apollo.mutate = jest.fn(() => Promise.reject(error))

      await signup(context, creds)

      expect(context.errors.add).toBeCalledWith({ field: 'username', msg: 'signinerror' })
      expect(SESSION.authenticated).toEqual(false)
    })
  })

  describe('#logout', () => {
    it('Test logout', async () => {
      const context = {
        $apollo: {
          provider: {
            defaultClient: {
              resetStore: jest.fn()
            }
          }
        },
        $router: {
          push: jest.fn()
        },
        errors: {
          add: jest.fn()
        }
      }

      await logout(context)

      expect(context.$router.push).toBeCalledWith('/login')
      expect(context.$apollo.provider.defaultClient.resetStore).toHaveBeenCalledTimes(1)

      expect(SESSION.authenticated).toBe(false)
      expect(SESSION.jwtToken).toBeUndefined()
      expect(SESSION.username).toBeUndefined()
      expect(SESSION.clearKey).toBeUndefined()
    })
  })
})
