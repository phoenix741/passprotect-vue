import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Router from 'vue-router'
import { setSignupHandler } from '@/components/user/UserService'
import Register from '@/components/user/Register.vue'

jest.mock('@/components/user/UserService')

describe('Register.vue', () => {
  let RegisterComponent, signupHandler
  beforeEach(() => {
    setSignupHandler(jest.fn())

    const mockRouter = new Router({ routes: [] })
    RegisterComponent = shallowMount(Register, {
      router: mockRouter
    })
  })

  fit('should render correct contents', async () => {
    const data = {
      username: 'myusername',
      password: 'mypassword',
      passwordRepeat: 'mypassword'
    }

    console.log(RegisterComponent.vm.$el.innerHTML)
    RegisterComponent.setData(data)
    // await RegisterComponent.vm.submit()
    /*
    expect(signupHandler).toBeCalledWith({}, {
      username: 'myusername',
      password: 'mypassword'
    }) */
  })

  it('Test validation of input (username and password required)', async () => {
    const data = {
      username: ' ',
      password: ' ',
      passwordRepeat: ' '
    }

    RegisterComponent.setData(data)
    RegisterComponent.find('input[name="username"]').trigger('blur')
    RegisterComponent.find('input[name="password"]').trigger('blur')
    RegisterComponent.find('input[name="passwordRepeat"]').trigger('blur')

    await Vue.nextTick()
    await RegisterComponent.vm.submit()

    expect(RegisterComponent.html()).to.match(/The user:register.form.identity_username.field field is required./)
    expect(RegisterComponent.html()).to.match(/The user:register.form.identity_password1.field field is required./)
    expect(RegisterComponent.html()).to.match(/The user:register.form.identity_password2.field field is required./)
    sinon.assert.notCalled(signupHandler)
  })

  it('Test validation of input (password must be at least 8 characters)', async () => {
    const data = {
      username: 'test',
      password: 'test',
      passwordRepeat: 'test'
    }

    RegisterComponent.setData(data)
    RegisterComponent.find('input[name="username"]').trigger('blur')
    RegisterComponent.find('input[name="password"]').trigger('blur')
    RegisterComponent.find('input[name="passwordRepeat"]').trigger('blur')

    await Vue.nextTick()
    await RegisterComponent.vm.submit()

    expect(RegisterComponent.html()).to.match(/The user:register.form.identity_password1.field field must be at least 8 characters./)
    sinon.assert.notCalled(signupHandler)
  })

  it('Test validation of input (password different)', async () => {
    const data = {
      username: 'test',
      password: 'testtest',
      passwordRepeat: 'xxxxxxxx'
    }

    RegisterComponent.setData(data)
    RegisterComponent.find('input[name="username"]').trigger('blur')
    RegisterComponent.find('input[name="password"]').trigger('blur')
    RegisterComponent.find('input[name="passwordRepeat"]').trigger('blur')

    await Vue.nextTick()
    await RegisterComponent.vm.submit()

    expect(RegisterComponent.html()).to.match(/The user:register.form.identity_password2.field confirmation does not match./)
    sinon.assert.notCalled(signupHandler)
  })
})
