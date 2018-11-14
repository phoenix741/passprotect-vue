import { shallowMount } from '@vue/test-utils'
import Router from 'vue-router'
import ItemModification from '@/components/items/ItemModification.vue'
import { setSession } from '@/components/user/UserService'

jest.mock('@/components/user/UserService')
jest.mock('@/utils/piwik')

describe('ItemModification.vue', () => {
  let ItemModificationComponent, mockRouter
  const SESSION = {
    authenticated: true,
    clearKey: 'ee958f6809e430c9b8ff10b3cbec138f9150e0af1a00557144825fd5011e82ab'
  }

  beforeEach(() => {
    setSession(SESSION)

    mockRouter = new Router({ routes: [
      { path: '/items/:id/modification', name: 'modification' }
    ] })

    ItemModificationComponent = shallowMount(ItemModification, {
      router: mockRouter,
      propsData: {
        id: '57fa5386d3cd8c0013ac93fd'
      }
    })

    SESSION.authenticated = true
  })

  it('Test that beforeRouteEnter is executed - authenticated', () => {
    const to = '/to'
    const from = '/from'
    const next = jest.fn()

    ItemModificationComponent.vm.$options.beforeRouteEnter.forEach(beforeRouteEnter => {
      beforeRouteEnter(to, from, next)
    })

    expect(next).toBeCalled()
  })

  it('Test that beforeRouteEnter is executed - not authenticated', () => {
    const to = '/to'
    const from = '/from'
    const next = jest.fn()

    SESSION.authenticated = false

    ItemModificationComponent.vm.$options.beforeRouteEnter.forEach(beforeRouteEnter => {
      beforeRouteEnter(to, from, next)
    })

    expect(next).toBeCalledWith('/login', { replace: true })
  })

  it('Check how the line is get by apollo', function () {
    expect(ItemModificationComponent.vm.$options.apollo.line.variables.call({ id: 'id' })).toEqual({ id: 'id' })
  })
})
