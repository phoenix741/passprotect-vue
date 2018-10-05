<template lang="pug">
div
  v-content
    v-container(fluid)
      p Terms and condition
</template>

<script type="text/babel">
import AnalyticsMixin from '../utils/piwik'

export default {
  name: 'page-about',
  mixins: [AnalyticsMixin],
  data () {
    return {
      title: this.$t('about.title')
    }
  }
}
</script>
