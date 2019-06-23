<template>  
  <form class="on-boarding" @submit.prevent="submit()">
    <v-card :flat="$vuetify.breakpoint.xsOnly" :style="{ 'background': $vuetify.breakpoint.xsOnly ? '#fafafa' : '#fff' }">
      <v-card-text class="pa-4 pt-7 text-xs-center">
        <h1 class="title font-weight-light mb-5">{{ $t('lock.title')}}</h1>
        <div class="mb-5">{{ $t('lock.description') }}</div>
        <VPasswordInput class="mt-3" ref="password" :label="$t('lock.identity_password1.field')" :data-vv-as="$t('lock.identity_password1.field')" v-model="password" :error-messages="errors.collect('password')" v-validate="'required'" data-vv-name="password" name="password" required="required"></VPasswordInput>
        <v-text-field class="mt-3" :label="$t('lock.identity_password2.field')" :data-vv-as="$t('lock.identity_password2.field')" v-model="passwordRepeat" type="password" :error-messages="errors.collect('passwordRepeat')" v-validate="'required|confirmed:password'" name="passwordRepeat" data-vv-name="passwordRepeat" required="required"></v-text-field>
        <v-btn class="register-button" block="block" type="primary" dark="dark" color="primary">{{ $t('lock.validation.field') }}</v-btn>
      </v-card-text>
    </v-card>
  </form>
</template>

<script lang="ts">
import { Component, Mixins, Watch, Prop } from 'vue-property-decorator';
import AnalyticsMixin from '@/mixins/piwik';
import VPasswordInput from '@/components/shared/VPasswordInput.vue';

@Component({
  name: 'lock',
  components: {
    VPasswordInput,
  },
})
export default class Lock extends Mixins(AnalyticsMixin) {
  @Prop({
    type: String,
  })
  redirect!: string;

  password = '';
  passwordRepeat = '';

  created() {
    this.title = this.$t('lock.title');
  }

  cancel() {
    this.$router.go(-1);
  }

  async submit() {
    const valid = await this.$validator.validateAll();
    if (!valid) {
      return;
    }

    //await this.activatePersistence({ masterKey: this.password });

    this.$router.push(this.redirect);
  }
}
</script>

<style lang="stylus" scoped>
.on-boarding
  width: 400px
  margin: auto
</style>
