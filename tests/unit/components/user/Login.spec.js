import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Router from 'vue-router'
import { setLoginHandler } from '@/components/user/UserService'
import Login from '@/components/user/Login.vue'

jest.mock('@/components/user/UserService')

describe('Login.vue', () => {
  let LoginComponent, loginHandler
  beforeEach(() => {
    setLoginHandler(loginHandler = jest.fn())

    const mockRouter = new Router({ routes: [ { path: '/register', name: 'register' } ] })

    LoginComponent = mount(Login, {
      router: mockRouter
    })
  })

  it('should render correct contents', async () => {
    const data = {
      username: 'myusername',
      password: 'mypassword'
    }

    LoginComponent.setData(data)
    await LoginComponent.vm.submit()

    expect(loginHandler).toBeCalledWith(expect.anything(), data)
  })

  it('Test validation of input (username and password required)', async () => {
    const data = {
      username: ' ',
      password: ' '
    }

    LoginComponent.setData(data)
    LoginComponent.find('input[name="username"]').trigger('blur')
    LoginComponent.find('input[name="password"]').trigger('blur')

    await Vue.nextTick()
    await LoginComponent.vm.submit()

    expect(LoginComponent.html()).toBe(expect.stringMatch(/The user:login.form.username.field field is required./))
    expect(LoginComponent.html()).toBe(expect.stringMatch(/The user:login.form.password.field field is required./))
    expect(loginHandler).not.toBeCalled()
  })

  it('Test validation of input (password must be at least 8 characters)', async () => {
    const data = {
      username: 'test',
      password: 'test'
    }

    LoginComponent.setData(data)
    LoginComponent.find('input[name="username"]').trigger('blur')
    LoginComponent.find('input[name="password"]').trigger('blur')

    await Vue.nextTick()
    await LoginComponent.vm.submit()

    expect(LoginComponent.html()).toBe(expect.stringMatch(/The user:login.form.password.field field must be at least 8 characters./))
    expect(loginHandler).not.toBeCalled()
  })
})
