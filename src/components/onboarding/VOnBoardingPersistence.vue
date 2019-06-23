<template>
  <div class="pa-3 text-xs-center">
    <h1 class="title font-weight-light mb-5">{{ $t('onboarding.persistence_title')}}</h1>
    <v-img class="mb-5" contain="contain" height="128" src="/safe-box.png"></v-img>
    <div class="mb-5">{{ $t('onboarding.persistence_description') }}</div>
    <v-layout row="row" wrap="wrap">
      <v-flex xs5="xs5">
        <v-btn round="round" block="block" @click="no()">{{ $t('onboarding.persistence_no') }}</v-btn>
      </v-flex>
      <v-flex xs2="xs2"></v-flex>
      <v-flex xs5="xs5">
        <v-btn round="round" block="block" color="primary" @click="yes()">{{ $t('onboarding.persistence_yes') }}</v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Mixins, Watch } from 'vue-property-decorator';

@Component({
  name: 'v-on-boarding-persistence',
})
export default class VOnBoardingPersistence extends Vue {
  yes() {
    this.$emit('yes');
  }

  no() {
    this.$emit('no');
  }
}
</script>
