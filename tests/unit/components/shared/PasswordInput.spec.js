import { shallowMount } from '@vue/test-utils'
import PasswordInput from '@/components/shared/PasswordInput.vue'

describe('PasswordInput.vue', () => {
  it('Test that the component show a progress bar', () => {
    const PasswordInputComponent = shallowMount(PasswordInput, {
      propsData: {
        id: 'passwordInput',
        name: 'passwordInputName',
        label: 'Mon mot de passe',
        value: 'test'
      }
    })
    expect(PasswordInputComponent.element).toMatchSnapshot()
  })

  const passwords = [
    { value: 'test', words: [], progress: '0' },
    { value: 'ceci est un test', words: [], progress: '100' },
    { value: 'maison', words: [], progress: '25' },
    { value: 'camion tracteur', words: [], progress: '100' },
    { value: 'camion tracteur2', words: ['camion', 'tracteur2'], progress: '75' },
    { value: 'afeVtj@!#', words: [], progress: '75' }
  ]

  passwords.forEach(password => {
    it(`Test that the component show a progress bar with password ${password.value}`, () => {
      const PasswordInputComponent = shallowMount(PasswordInput, {
        propsData: {
          id: 'passwordInput',
          name: 'passwordInputName',
          label: 'Mon mot de passe',
          value: password.value,
          words: password.words
        }
      })
      expect(PasswordInputComponent.element).toMatchSnapshot()
      expect(PasswordInputComponent.find('vprogresslinear-stub').attributes('value')).toBe(password.progress)
    })
  })
})
