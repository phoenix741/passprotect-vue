<template lang="pug">
div(style="width: 400px; margin: auto;")
  form(@submit.prevent="submit()")
    v-card
      v-card-text.pa-4
        div.text-xs-center.title {{ $t('register.form.title') }}

        v-text-field.mt-5(
          :label="$t('register.form.identity_username.field')",
          :data-vv-as="$t('register.form.identity_username.field')",
          v-model="username",
          :error-messages="errors.collect('username')",
          v-validate="'required'",
          data-vv-name="username",
          name="username",
          required)
        password-input.mt-3(
          ref="password"
          :label="$t('register.form.identity_password1.field')",
          :data-vv-as="$t('register.form.identity_password1.field')",
          v-model="password"
          :error-messages="errors.collect('password')",
          v-validate="'required|min:8'",
          name="password",
          data-vv-name="password"
          required
        )
        v-text-field.mt-3(
          :label="$t('register.form.identity_password2.field')",
          :data-vv-as="$t('register.form.identity_password2.field')",
          v-model="passwordRepeat"
          type="password",
          :error-messages="errors.collect('passwordRepeat')",
          v-validate="'required|min:8|confirmed:password'"
          name="passwordRepeat"
          data-vv-name="passwordRepeat"
          required)

        v-btn.register-button(block,type="primary",dark,color="primary") {{ $t('register.form.validation.field') }}

        div.text-xs-center
          |   {{ $t('register.form.terms1') }}
          br
          router-link#register-link(to="/terms") {{ $t('register.form.terms2') }}

      v-divider(light)
      v-card-actions.pa-3
        | {{ $t('register.form.already_registered') }}
        v-spacer
        v-btn(flat,to="/login",replace,color="primary") {{ $t('register.form.signin') }}
</template>

<script type="text/babel">
import { signup } from './UserService'
import AnalyticsMixin from '../../utils/piwik'
import PasswordInput from '../shared/PasswordInput.vue'

export default {
  $validates: true,
  name: 'register',
  mixins: [AnalyticsMixin],
  components: {
    'password-input': PasswordInput
  },
  data () {
    return {
      title: this.$t('register.form.title'),
      username: '',
      password: '',
      passwordRepeat: ''
    }
  },
  methods: {
    async submit () {
      const valid = await this.$validator.validateAll()
      if (!valid) {
        return
      }

      signup(this, { username: this.username, password: this.password })
    }
  }
}
</script>
