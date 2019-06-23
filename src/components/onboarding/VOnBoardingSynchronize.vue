<template>
  <div class="pa-3 text-xs-center">
    <h1 class="title font-weight-light mb-5">{{ $t('onboarding.synchronization_title')}}</h1>
    <v-img class="mb-5" contain="contain" height="128" src="/safe-box.png"></v-img>
    <div class="mb-5">{{ $t('onboarding.synchronization_description') }}</div>
    <v-layout row="row" wrap="wrap">
      <v-flex xs5="xs5">
        <v-btn round="round" block="block" color="primary" @click="signin()">{{ $t('onboarding.synchronization_signin') }}</v-btn>
      </v-flex>
      <v-flex xs2="xs2"></v-flex>
      <v-flex xs5="xs5">
        <v-btn round="round" block="block" color="primary" @click="signup()">{{ $t('onboarding.synchronization_signup') }}</v-btn>
      </v-flex>
      <v-flex xs12="xs12">
        <v-btn round="round" block="block" @click="dialogNothanks = true">{{ $t('onboarding.synchronization_nothanks') }}</v-btn>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialogNothanks" max-width="290">
      <v-card>
        <v-card-title class="headline">{{ $t('onboarding.synchronization_warning_title') }}</v-card-title>
        <v-card-text>{{ $t('onboarding.synchronization_warning') }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click="dialogNothanks = false">Disagree</v-btn>
          <v-btn color="green darken-1" flat="flat" @click="cancel()">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Mixins, Watch } from 'vue-property-decorator';

@Component({
  name: 'v-on-boarding-synchronize',
})
export default class VOnBoardingSynchronize extends Vue {
  dialogNothanks = false;

  signin() {
    this.$emit('signin');
  }

  signup() {
    this.$emit('signup');
  }

  cancel() {
    this.dialogNothanks = false;
    this.$emit('cancel');
  }
}
</script>
