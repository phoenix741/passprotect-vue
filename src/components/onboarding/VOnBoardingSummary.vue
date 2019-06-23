<template>
  <div class="pa-3 text-xs-center">
    <h1 class="title font-weight-light mb-5">{{ $t('onboarding.title')}}</h1>
    <v-img class="mb-5" contain="contain" height="128" src="/safe-box.png"></v-img>
    <div class="mb-5">{{ $t('onboarding.description') }}</div>
    <v-btn round="round" color="primary" @click="getStarted()">{{ $t('onboarding.btn_start') }}</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Mixins, Watch } from 'vue-property-decorator';

@Component({
  name: 'v-on-boarding-summary',
})
export default class VOnBoardingSummary extends Vue {
  getStarted() {
    this.$emit('getstarted');
  }
}
</script>
