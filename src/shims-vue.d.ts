declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module '*.yml' {
  const value: any;
  export default value;
}

declare module 'vee-validate/dist/locale/fr' {
  const dictionary: Object;
  export default dictionary;
}

declare module 'vee-validate/dist/vee-validate.minimal.esm.js' {
  import VeeValidate from 'vee-validate';
  export { Validator } from 'vee-validate';
  export const install: any;
}
declare module 'vee-validate/dist/rules.esm.js' {
  import { Rule, RuleValidate } from 'vee-validate';
  export const required: Rule | RuleValidate;
  export const min: Rule | RuleValidate;
  export const confirmed: Rule | RuleValidate;
}
