import Vue from 'vue'
import veeDictionaryFr from 'vee-validate/dist/locale/fr'
import VeeValidate, { Validator } from 'vee-validate'

export default async function veeValidate () {
  Vue.use(VeeValidate, { locale: 'fr' })
  Validator.localize('fr', veeDictionaryFr)
}
