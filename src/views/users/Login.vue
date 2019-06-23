<template>  
  <form class="on-boarding" @submit.prevent="submit()"><img class="elevation-5" src="@/assets/logo.png"/>
    <v-card>
      <v-card-text class="pa-4 pt-7">
        <div class="pt-5 text-xs-center title">{{ $t('login.dialog.title') }}</div>
        <v-text-field class="mt-5" :label="$t('login.form.username.field')" :data-vv-as="$t('login.form.username.field')" v-model="username" :error-messages="errors.collect('username')" v-validate="'required'" data-vv-name="username" name="username" required="required"></v-text-field>
        <v-text-field class="mt-3" :label="$t('login.form.password.field')" :data-vv-as="$t('login.form.password.field')" v-model="password" type="password" :error-messages="errors.collect('password')" v-validate="'required|min:8'" data-vv-name="password" name="password" required="required"></v-text-field>
        <v-btn id="login-button" block="block" type="submit" dark="dark" color="light-blue">{{ $t('login.dialog.button.connect') }}</v-btn>
        <div class="mt-4 mb-4">  {{ $t('login.dialog.button.noaccount') }}
          <router-link id="register-link" to="/register" replace="replace">{{ $t('login.dialog.button.signup') }}</router-link>
        </div>
      </v-card-text>
    </v-card>
  </form>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import AnalyticsMixin from '@/mixins/piwik';
import { createSession } from '@/services/SessionService';

@Component({
  name: 'login',
})
export default class Login extends Mixins(AnalyticsMixin) {
  username = '';
  password = '';

  created() {
    this.title = this.$t('login.dialog.title');
  }

  async submit() {
    const valid = await this.$validator.validateAll();
    if (!valid) {
      return;
    }

    try {
      await createSession(this.username, this.password);

      if (this.$router.currentRoute.query.redirect) {
        this.$router.replace(this.$router.currentRoute.query.redirect as string);
      } else {
        this.$router.replace('/items');
      }
    } catch (err) {
      this.$validator.errors.add({ field: err.fieldName, msg: this.$t(err.message).toString() });
    }
  }
}
</script>

<style lang="stylus" scoped>
.on-boarding
  width: 400px
  margin: auto

img
  position: relative;
  top: 50px;
  left: 150px;
  width: 100px;
  background: white;
  border-radius: 50%;
  z-index: 99;
</style>
