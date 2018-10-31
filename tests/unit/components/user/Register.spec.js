import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Router from 'vue-router'
import { setSignupHandler } from '@/components/user/UserService'
import Register from '@/components/user/Register.vue'

jest.mock('@/components/user/UserService')

describe('Register.vue', () => {
  let RegisterComponent, signupHandler
  beforeEach(() => {
    setSignupHandler(signupHandler = jest.fn())

    const mockRouter = new Router({ routes: [] })
    RegisterComponent = mount(Register, {
      router: mockRouter
    })
  })

  it('should render correct contents', async () => {
    const data = {
      username: 'myusername',
      password: 'mypassword',
      passwordRepeat: 'mypassword'
    }

    RegisterComponent.setData(data)
    await RegisterComponent.vm.submit()
    expect(signupHandler).toBeCalledWith(expect.anything(), {
      username: 'myusername',
      password: 'mypassword'
    })
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

    expect(RegisterComponent.html()).toEqual(expect.stringMatching(/The user:register.form.identity_username.field field is required./))
    expect(RegisterComponent.html()).toEqual(expect.stringMatching(/The user:register.form.identity_password1.field field is required./))
    expect(RegisterComponent.html()).toEqual(expect.stringMatching(/The user:register.form.identity_password2.field field is required./))
    expect(signupHandler).not.toBeCalled()
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

    expect(RegisterComponent.html()).toEqual(expect.stringMatching(/The user:register.form.identity_password1.field field must be at least 8 characters./))
    expect(signupHandler).not.toBeCalled()
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

    expect(RegisterComponent.html()).toEqual(expect.stringMatching(/The user:register.form.identity_password2.field confirmation does not match./))
    expect(signupHandler).not.toBeCalled()
  })
})
