<template lang="pug">
div(style="width: 400px; margin: auto;")
  form(@submit.prevent="submit()")
    img.elevation-5(src="@/assets/logo.png")
    v-card
      v-card-text.pa-4.pt-7
        div.pt-5.text-xs-center.title {{ $t('login.dialog.title') }}

        v-text-field.mt-5(
          :label="$t('login.form.username.field')",
          :data-vv-as="$t('login.form.username.field')",
          v-model="username",
          :error-messages="errors.collect('username')",
          v-validate="'required'",
          data-vv-name="username"
          name="username"
          required)
        v-text-field.mt-3(
          :label="$t('login.form.password.field')",
          :data-vv-as="$t('login.form.password.field')",
          v-model="password"
          type="password",
          :error-messages="errors.collect('password')",
          v-validate="'required|min:8'"
          data-vv-name="password"
          name="password"
          required)
        v-btn#login-button(block,type="submit",dark,color="light-blue") {{ $t('login.dialog.button.connect') }}
        div.mt-4.mb-4
          |   {{ $t('login.dialog.button.noaccount') }}
          router-link#register-link(to="/register",replace) {{ $t('login.dialog.button.signup') }}
</template>

<script type="text/babel">
import { login } from './UserService'
import AnalyticsMixin from '../../utils/piwik'

export default {
  $validates: true,
  name: 'login',
  mixins: [AnalyticsMixin],
  data () {
    return {
      title: this.$t('login.dialog.title'),
      username: '',
      password: ''
    }
  },
  methods: {
    async submit () {
      const valid = await this.$validator.validateAll()
      if (!valid) {
        return
      }

      await login(this, { username: this.username, password: this.password })
    }
  }
}
</script>

<style lang="stylus" scoped>
img {
  position: relative;
  top: 50px;
  left: 150px;
  width: 100px;
  background: white;
  border-radius: 50%;
  z-index: 99;
}
</style>
