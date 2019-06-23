<template>  
  <form class="on-boarding" @submit.prevent="submit()">
    <v-card :flat="$vuetify.breakpoint.xsOnly" :style="{ 'background': $vuetify.breakpoint.xsOnly ? '#fafafa' : '#fff' }">
      <v-card-text class="pa-4 pt-7 text-xs-center">
        <h1 class="title font-weight-light mb-5">{{ $t('unlock.title')}}</h1>
        <v-text-field class="mt-3" :label="$t('unlock.identity_password.field')" :data-vv-as="$t('unlock.identity_password.field')" v-model="password" type="password" :error-messages="errors.collect('password')" v-validate="'required'" name="password" data-vv-name="password" required="required"></v-text-field>
        <v-btn class="register-button" block="block" type="primary" dark="dark" color="primary">{{ $t('unlock.validation.field') }}</v-btn>
      </v-card-text>
    </v-card>
  </form>
</template>

<script lang="ts">
import { Component, Mixins, Watch, Prop } from 'vue-property-decorator';
import AnalyticsMixin from '@/mixins/piwik';

@Component({
  name: 'unlock',
})
export default class Unlock extends Mixins(AnalyticsMixin) {
  @Prop({
    type: String,
  })
  redirect!: string;
  password = '';

  created() {
    this.title = this.$t('unlock.title');
  }

  async submit() {
    const valid = await this.$validator.validateAll();
    if (!valid) {
      return;
    }

    //await this.activatePersistence({ masterKey: this.password });

    this.$router.replace(this.redirect);
  }
}
</script>

<style lang="stylus" scoped>
.on-boarding
  width: 400px
  margin: auto
</style>
