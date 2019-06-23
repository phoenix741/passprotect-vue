<template>  
  <div class="on-boarding">
    <v-card :flat="$vuetify.breakpoint.xsOnly" :style="{ 'background': $vuetify.breakpoint.xsOnly ? '#fafafa' : '#fff' }">
      <v-card-text class="pa-4 pt-7">
        <v-window :value="pageIndex" touchless="touchless">
          <v-window-item>
            <VOnBoardingSummary @getstarted="getStarted()"></VOnBoardingSummary>
          </v-window-item>
          <v-window-item>
            <VOnBoardingSynchronize @cancel="nosync()" @signin="signin()" @signup="signup()"></VOnBoardingSynchronize>
          </v-window-item>
          <v-window-item>
            <VOnBoardingPersistence @no="nopersistence()" @yes="persist()"></VOnBoardingPersistence>
          </v-window-item>
          <v-window-item>
            <VOnBoardingEnjoy @close="close()"></VOnBoardingEnjoy>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch, Prop } from 'vue-property-decorator';
import AnalyticsMixin from '@/mixins/piwik';
import VOnBoardingSummary from '@/components/onboarding/VOnBoardingSummary.vue';
import VOnBoardingSynchronize from '@/components/onboarding/VOnBoardingSynchronize.vue';
import VOnBoardingPersistence from '@/components/onboarding/VOnBoardingPersistence.vue';
import VOnBoardingEnjoy from '@/components/onboarding/VOnBoardingEnjoy.vue';

@Component({
  name: 'on-boarding',
  components: {
    VOnBoardingSummary,
    VOnBoardingSynchronize,
    VOnBoardingPersistence,
    VOnBoardingEnjoy,
  },
})
export default class OnBoarding extends Mixins(AnalyticsMixin) {
  @Prop({
    type: Number,
  })
  pageIndex!: number;

  created() {
    this.title = this.$t('onboarding.title');
  }

  getStarted() {
    this.$router.push(this.nextRoute());
  }

  nosync() {
    this.$router.push({ name: 'lock', query: { redirect: this.nextRoute(2) } });
  }

  signin() {
    this.$router.push({ name: 'login', query: { redirect: this.nextRoute() } });
  }

  signup() {
    this.$router.push({
      name: 'signup',
      query: { redirect: this.nextRoute() },
    });
  }

  nopersistence() {
    this.$router.push(this.nextRoute());
  }

  persist() {
    this.$router.push({ name: 'lock', query: { redirect: this.nextRoute() } });
  }

  close() {
    this.$router.push({ name: 'items' });
  }

  nextRoute(inc: number = 1) {
    return `/onboarding/${this.pageIndex + inc}`;
  }
}
</script>

<style lang="stylus" scoped>
.on-boarding
  width: 400px
  margin: auto
</style>
