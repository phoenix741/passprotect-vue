import Vue from 'vue';
import veeDictionaryFr from 'vee-validate/dist/locale/fr';
import { Validator, install as VeeValidate } from 'vee-validate/dist/vee-validate.minimal.esm.js';
import { required, min, confirmed } from 'vee-validate/dist/rules.esm.js';

export default function veeValidate() {
  Validator.extend('required', required);
  Validator.extend('min', min);
  Validator.extend('confirmed', confirmed);

  Validator.localize('fr', veeDictionaryFr);

  Vue.use(VeeValidate, { locale: 'fr' });
}
