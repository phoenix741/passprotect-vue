<template>
  <ValidationObserver ref="observer" class="on-boarding" v-slot="{ invalid }" tag="form" @submit.prevent="submit()">
    <v-card>
      <v-card-text class="pa-4">
        <div class="text-xs-center title">{{ $t('register.form.title') }}</div>

        <ValidationProvider ref="provider" rules="required" v-slot="{ errors }" :name="$t('register.form.identity_username.field')">
          <v-text-field
            class="mt-5"
            :label="$t('register.form.identity_username.field')"
            v-model="username"
            :error-messages="errors"
            name="username"
            required="required"
          ></v-text-field>
        </ValidationProvider>

        <ValidationProvider rules="required|min:8" v-slot="{ errors }" vid="password" :name="$t('register.form.identity_password1.field')">
          <VPasswordInput
            class="mt-3"
            :label="$t('register.form.identity_password1.field')"
            v-model="password"
            :error-messages="errors"
            name="password"
            required="required"
          ></VPasswordInput>
        </ValidationProvider>

        <ValidationProvider rules="required|min:8|confirmed:password" v-slot="{ errors }" :name="$t('register.form.identity_password2.field')">
          <v-text-field
            class="mt-3"
            :label="$t('register.form.identity_password2.field')"
            v-model="passwordRepeat"
            type="password"
            :error-messages="errors"
            name="passwordRepeat"
            required="required"
          ></v-text-field>
        </ValidationProvider>

        <v-btn class="register-button" block="block" type="primary" :dark="invalid ? 'false' : 'dark'" :color="invalid ? '' : 'primary'" :disabled="invalid">{{ $t('register.form.validation.field') }}</v-btn>

        <div class="text-xs-center">  {{ $t('register.form.terms1') }}<br/>
          <router-link id="register-link" to="/terms">{{ $t('register.form.terms2') }}</router-link>
        </div>
      </v-card-text>
      <v-divider light="light"></v-divider>
      <v-card-actions class="pa-3">{{ $t('register.form.already_registered') }}
        <v-spacer></v-spacer>
        <v-btn flat="flat" to="/login" replace="replace" color="primary">{{ $t('register.form.signin') }}</v-btn>
      </v-card-actions>
    </v-card>
  </ValidationObserver>
</template>

<script lang="ts">
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { Component, Mixins, Watch, Prop } from 'vue-property-decorator';
import AnalyticsMixin from '@/mixins/piwik';
import VPasswordInput from '@/components/shared/VPasswordInput.vue';
import { signup } from '@/services/UserService';
import { createSession } from '@/services/SessionService';

@Component({
  name: 'register',
  components: {
    ValidationObserver,
    ValidationProvider,
    VPasswordInput,
  },
})
export default class Register extends Mixins(AnalyticsMixin) {
  username = '';
  password = '';
  passwordRepeat = '';

  created() {
    this.title = this.$t('register.form.title');
  }

  async submit() {
    const isValid = await (this.$refs.observer as any).validate();
    if (!isValid) {
      return;
    }

    try {
      await signup({ username: this.username, password: this.password });
      await createSession(this.username, this.password);
    } catch (err) {
      (this.$refs.provider as any).applyResult({
        errors: [this.$t(err.message).toString()],
        valid: false,
        failedRules: {},
      });
    }
  }
}
</script>

<style lang="stylus" scoped>
.on-boarding
  width: 400px
  margin: auto
</style>
