import { shallowMount } from '@vue/test-utils'
import Router from 'vue-router'
import ItemCreation from '@/components/items/ItemCreation.vue'
import { setSession } from '@/components/user/UserService'

jest.mock('@/components/user/UserService')
jest.mock('@/utils/piwik')

describe('ItemCreation.vue', () => {
  let ItemCreationComponent, mockRouter
  const SESSION = {
    authenticated: true,
    clearKey: 'ee958f6809e430c9b8ff10b3cbec138f9150e0af1a00557144825fd5011e82ab'
  }

  beforeEach(() => {
    setSession(SESSION)

    mockRouter = new Router({ routes: [
      { path: '/items/:id/create', name: 'creation' }
    ] })

    ItemCreationComponent = shallowMount(ItemCreation, {
      router: mockRouter,
      propsData: {
        type: 'text'
      }
    })

    SESSION.authenticated = true
  })

  it('Test that beforeRouteEnter is executed - authenticated', () => {
    const to = '/to'
    const from = '/from'
    const next = jest.fn()

    ItemCreationComponent.vm.$options.beforeRouteEnter.forEach(beforeRouteEnter => {
      beforeRouteEnter(to, from, next)
    })

    expect(next).toBeCalled()
  })

  it('Test that beforeRouteEnter is executed - not authenticated', () => {
    const to = '/to'
    const from = '/from'
    const next = jest.fn()

    SESSION.authenticated = false

    ItemCreationComponent.vm.$options.beforeRouteEnter.forEach(beforeRouteEnter => {
      beforeRouteEnter(to, from, next)
    })

    expect(next).toBeCalledWith('/login', { replace: true })
  })
})
