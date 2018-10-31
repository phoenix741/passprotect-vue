import { mount } from '@vue/test-utils'
import Router from 'vue-router'
import Vue from 'vue'
import Items from '@/components/items/Items.vue' // eslint-disable-line
import { cardTypeMapping } from '@/components/items/ItemCryptedService'
import { setRemoveLineHandler, setExportLinesAsCsvHandler } from '@/components/items/ItemService'
import { setSession, setLogoutHandler } from '@/components/user/UserService'

jest.mock('@/components/user/UserService')
jest.mock('@/components/items/ItemService')
jest.mock('@/components/items/ItemCryptedService')

describe('Items.vue', () => {
  let ItemsComponent, mockRouter, removeLineHandler, logoutHandler, exportLinesAsCsvHandler
  const SESSION = {
    authenticated: true,
    username: 'myusername'
  }
  const ITEMS_LIST = {
    data: {
      lines: [
        {
          _id: '57fa53b5d3cd8c0013ac93ff',
          type: 'text',
          label: 'Mon Texte',
          group: 'titi',
          __typename: 'WalletLine'
        },
        {
          _id: '57fa539bd3cd8c0013ac93fe',
          type: 'password',
          label: 'Mon mot de passe',
          group: 'titi',
          __typename: 'WalletLine'
        },
        {
          _id: '57fa9c04b2bc100011505a4b',
          type: 'text',
          label: 'Text',
          group: 'titi',
          __typename: 'WalletLine'
        },
        {
          _id: '57fa5386d3cd8c0013ac93fd',
          type: 'card',
          label: 'Carte bancaire',
          group: 'toto',
          __typename: 'WalletLine'
        }
      ]
    }
  }

  beforeEach(() => {
    setLogoutHandler(logoutHandler = jest.fn())
    setExportLinesAsCsvHandler(exportLinesAsCsvHandler = jest.fn())
    setRemoveLineHandler(removeLineHandler = jest.fn())
    setSession(SESSION)

    mockRouter = new Router({ routes: [
      { path: '/items/:id', name: 'visualisation_tems' },
      { path: '/items/:id/edit', name: 'edit_items' }
    ] })

    ItemsComponent = mount(Items, {
      router: mockRouter,
      sync: false,
      stubs: {
        transition: false
      }
    })

    SESSION.authenticated = true
  })

  it('should render navigation drawer', () => {
    expect(ItemsComponent.find('.export-link').html()).toEqual(expect.stringMatching(/app\.menu\.export/))
    expect(ItemsComponent.find('.logout-link').html()).toEqual(expect.stringMatching(/app\.menu\.logout/))
    expect(ItemsComponent.find('.about-link').html()).toEqual(expect.stringMatching(/app\.menu\.about/))
  })

  it('log out call logout ', () => {
    ItemsComponent.find('.logout-link').trigger('click')
    expect(logoutHandler).toBeCalled()
  })

  it('export call export ', () => {
    ItemsComponent.find('.export-link').trigger('click')
    expect(exportLinesAsCsvHandler).toBeCalled()
  })

  it('Test that beforeRouteEnter is executed - authenticated', async () => {
    const to = '/to'
    const from = '/from'
    const next = jest.fn()

    ItemsComponent.vm.$options.beforeRouteEnter.forEach(beforeRouteEnter => {
      beforeRouteEnter(to, from, next)
    })

    expect(next).toBeCalledWith()
  })

  it('Test that beforeRouteEnter is executed - not authenticated', async () => {
    const to = '/to'
    const from = '/from'
    const next = jest.fn()

    SESSION.authenticated = false

    ItemsComponent.vm.$options.beforeRouteEnter.forEach(beforeRouteEnter => {
      beforeRouteEnter(to, from, next)
    })

    expect(next).toBeCalledWith('/login', { replace: true })
  })

  it('Check how the line is get by apollo', () => {
    expect(ItemsComponent.vm.$data).toEqual({
      title: 'list.title',
      showOptions: false,
      drawer: true,
      dialog: {},
      lines: [],
      progressDialog: false
    })
    ItemsComponent.vm.$options.apollo.lines.result.call(ItemsComponent.vm, ITEMS_LIST)
    expect(ItemsComponent.vm.$data).toEqual({
      title: 'list.title',
      showOptions: false,
      drawer: true,
      dialog: {
        remove0: false,
        remove1: false,
        remove2: false,
        remove3: false
      },
      progressDialog: false,
      lines: []
    })
  })

  it('Test showing items on the list', async () => {
    ItemsComponent.setData({
      title: 'list.title',
      showOptions: false,
      dialog: {
        remove0: false,
        remove1: false,
        remove2: false,
        remove3: false
      },
      lines: ITEMS_LIST.data.lines
    })
    await Vue.nextTick()

    const groups = ItemsComponent.findAll('.group-title')
    const groupsName = []
    expect(groups).toHaveLength(2)
    for (let i = 0; i < groups.length; i++) {
      groupsName.push(groups.at(i).text())
    }
    expect(groupsName).toEqual(['titi', 'toto'])
  })

  it('Test filter of items', async () => {
    ItemsComponent.setData({
      title: 'list.title',
      showOptions: false,
      drawer: true,
      dialog: { remove0: false, remove1: false, remove2: false, remove3: false },
      lines: ITEMS_LIST.data.lines
    })

    ItemsComponent.vm.search('Carte')

    await timeout(600)
    await Vue.nextTick()

    expect(mockRouter.currentRoute.path).toBe('/items')
    expect(mockRouter.currentRoute.query).toEqual({ q: 'Carte' })

    ItemsComponent.setProps(mockRouter.currentRoute.query)

    await Vue.nextTick()

    const groups = ItemsComponent.findAll('.group-title')
    const lines = ItemsComponent.findAll('.line-title')
    expect(groups).toHaveLength(1)
    expect(lines).toHaveLength(1)
  })

  it('Test card type mapping', () => {
    expect(ItemsComponent.vm.cardType()).toBe(cardTypeMapping['text'])
  })

  it('Click on the remove button', async () => {
    ItemsComponent.setData({
      title: 'list.title',
      showOptions: false,
      dialog: { remove0: false, remove1: false, remove2: false, remove3: false },
      lines: ITEMS_LIST.data.lines
    })

    await Vue.nextTick()
    ItemsComponent.find('.item-delete-btn').trigger('click')
    await Vue.nextTick()
    ItemsComponent.find('.delete-btn').trigger('click')
    await Vue.nextTick()
    expect(removeLineHandler).toBeCalledWith(expect.anything(), '57fa539bd3cd8c0013ac93fe')
  })

  it('Click on the detail item', async () => {
    ItemsComponent.setData({
      title: 'list.title',
      showOptions: false,
      dialog: { remove0: false, remove1: false, remove2: false, remove3: false },
      lines: ITEMS_LIST.data.lines
    })

    await Vue.nextTick()
    ItemsComponent.find('.line-title').trigger('click')
    await Vue.nextTick()
    expect(mockRouter.currentRoute.path).toBe('/items/57fa539bd3cd8c0013ac93fe')
  })
})

function timeout (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
