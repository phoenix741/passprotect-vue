<template lang="pug">
div
  v-toolbar(color="primary",dark,app)
    v-btn(icon,@click="$router.go(-1)")
      v-icon arrow_back
    v-toolbar-title.ml-0.pl-3
      span {{ $t('app.title') }}

  v-content
    v-container(fluid)
      h2.header {{ $t('terms.title') }}
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
