import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Router from 'vue-router'
import ItemDetail from '@/components/items/ItemDetail.vue'
import { setUpdateLineHandler } from '@/components/items/ItemService'
import { setEncryptLineHandler, setDecryptLineHandler, setGenerateHandler } from '@/components/items/ItemCryptedService'

jest.mock('@/components/items/ItemService')
jest.mock('@/components/items/ItemCryptedService')

describe('ItemDetail.vue', () => {
  let ItemDetailComponent, mockRouter, updateLineHandler, generateHandler
  const DECRYPTED_LINE = { group: '', type: 'VISA', nameOnCard: 'MON NOM', cardNumber: '12345678910', cvv: '123', expiry: '12/20', code: '1234', notes: '' }
  const ENCRYPTED_LINE = {
    _id: '57fa5386d3cd8c0013ac93fd',
    type: 'card',
    label: 'Carte bancaire',
    encryption: {
      salt: '05cbd1aff29fe0b1',
      informations: {
        content: '3381e7cad1f8b685e6571b3a5b38a6f59fb7eebbc7dfdc4b6ca463c866dc1991abd4cb1459f5b3822dfd2a774ceb9e588e7e990849a005a1b621c7a3fff7b5a830c9dcbe4b7af99b2a4dcc2cf77a36c766845b6d35bcfabe66e05c9847e466d1c124fd72f8797b9bf931500e3a6a7d9214da8fd0d84dbbba2099aba463e592f5cc25',
        authTag: 'd7d713bd3fcf90ea33ccfd7a68c3f0e8'
      }
    }
  }
  const ENCRYPTED_PASSWORD = {
    _id: '57fa5386d3cd8c0013ac93fd',
    type: 'password',
    label: 'Pasword',
    encryption: {
      salt: '05cbd1aff29fe0b1',
      informations: {
        content: '3381e7cad1f8b685e6571b3a5b38a6f59fb7eebbc7dfdc4b6ca463c866dc1991abd4cb1459f5b3822dfd2a774ceb9e588e7e990849a005a1b621c7a3fff7b5a830c9dcbe4b7af99b2a4dcc2cf77a36c766845b6d35bcfabe66e05c9847e466d1c124fd72f8797b9bf931500e3a6a7d9214da8fd0d84dbbba2099aba463e592f5cc25',
        authTag: 'd7d713bd3fcf90ea33ccfd7a68c3f0e8'
      }
    }
  }

  beforeEach(() => {
    setUpdateLineHandler(updateLineHandler = jest.fn())
    setGenerateHandler(generateHandler = jest.fn(async () => 'passwordtest'))
    setEncryptLineHandler(jest.fn(() => ENCRYPTED_LINE.encryption))
    setDecryptLineHandler(jest.fn(() => DECRYPTED_LINE))

    mockRouter = new Router({ routes: [
      { path: '/items/:id/modification', name: 'modification' }
    ] })

    ItemDetailComponent = mount(ItemDetail, {
      router: mockRouter,
      propsData: {
        line: ENCRYPTED_LINE
      }
    })
  })

  it('Check mount without type', async () => {
    ItemDetailComponent = mount(ItemDetail, {
      router: mockRouter,
      propsData: {
        line: {}
      }
    })

    // Call method manually because wather is async
    await ItemDetailComponent.vm.decryptClearInformation({})
    await Vue.nextTick()

    expect(ItemDetailComponent.vm.$data.lineToModify).toEqual({})
    expect(ItemDetailComponent.vm.$data.clearInformation).toEqual(DECRYPTED_LINE)
  })

  it('Test the content of the vue', async () => {
    const data = ItemDetailComponent.vm.$data
    data.groups = ['group1', 'group2']
    ItemDetailComponent.setData(data)

    // Call method manually because wather is async
    await ItemDetailComponent.vm.decryptClearInformation(ENCRYPTED_LINE)
    await Vue.nextTick()

    console.log(ItemDetailComponent.html())

    expect(ItemDetailComponent.find('#title-label').text()).toEqual('list.type.card')
    expect(ItemDetailComponent.find('#label-input').element.value).toEqual('Carte bancaire')
    expect(ItemDetailComponent.find('#name-on-card-input').element.value).toEqual('MON NOM')
    expect(ItemDetailComponent.find('#card-number-input').element.value).toEqual('12345678910')
    expect(ItemDetailComponent.find('#cvv-input').element.value).toEqual('123')
    expect(ItemDetailComponent.find('#code-input').element.value).toEqual('1234')
    expect(ItemDetailComponent.find('#expiry-input').element.value).toEqual('12/20')

    const groupsElement = ItemDetailComponent.findAll('.list__tile--link')
    const groups = []
    for (let i = 0; i < groupsElement.length; i++) {
      groups.push(groupsElement.at(i).text())
    }
    expect(groups).toEqual(['group1', 'group2', 'item.form.group.newItem', 'item.form.type.options'])
  })

  it('Test validation of input label', async () => {
    const data = {
      lineToModify: {
        label: ''
      },
      clearInformation: {},
      typeOfCard: ['VISA'],
      groups: [],
      newGroup: ''
    }

    ItemDetailComponent.setData(data)
    ItemDetailComponent.find('#label-input').trigger('blur')

    await Vue.nextTick()
    await ItemDetailComponent.vm.submit()

    expect(ItemDetailComponent.html()).toEqual(expect.stringMatching(/The item.form.label.field field is required./))
    expect(updateLineHandler).not.toBeCalled()
  })

  it('Generate a password', async () => {
    ItemDetailComponent = mount(ItemDetail, {
      router: mockRouter,
      propsData: {
        line: ENCRYPTED_PASSWORD
      }
    })

    // Call method manually because wather is async
    await ItemDetailComponent.vm.decryptClearInformation(ENCRYPTED_LINE)
    await Vue.nextTick()

    ItemDetailComponent.find('#generate-password').trigger('click')
    await Vue.nextTick()

    expect(generateHandler).toBeCalled()
    expect(ItemDetailComponent.vm.$data.clearInformation.password).toEqual('passwordtest')
  })

  it('Submit the form - existing group', async () => {
    // Call method manually because wather is async
    await ItemDetailComponent.vm.decryptClearInformation(ENCRYPTED_LINE)
    await Vue.nextTick()

    await ItemDetailComponent.vm.submit()

    expect(updateLineHandler).toBeCalledWith(expect.anything(), ENCRYPTED_LINE)
    expect(ItemDetailComponent.emitted().close.length).to.equal(1)
  })

  it('Submit the form - new group', async () => {
    const data = ItemDetailComponent.vm.$data
    data.newGroup = 'newGroup'
    ItemDetailComponent.setData(data)

    // Call method manually because wather is async
    await ItemDetailComponent.vm.decryptClearInformation(ENCRYPTED_LINE)
    await Vue.nextTick()

    await ItemDetailComponent.vm.submit()

    const newLine = Object.assign({}, ENCRYPTED_LINE)
    newLine.group = 'newGroup'

    expect(updateLineHandler).toBeCalledWith(expect.anything(), newLine)
    expect(ItemDetailComponent.emitted().close.length).to.equal(1)
  })
})
