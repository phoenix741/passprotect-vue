<template lang="pug">
item-detail(v-bind:line="line",@close="close()")
</template>

<script type="text/babel">
import ItemDetail from './ItemDetail.vue'
import { SESSION } from '../user/UserService'
import AnalyticsMixin from '../../utils/piwik'

export default {
  props: ['type'],
  mixins: [AnalyticsMixin],
  components: {
    'item-detail': ItemDetail
  },
  name: 'item-creation',
  data () {
    return {
      title: this.$t('item.title_creation'),
      line: {
        label: '',
        type: this.type,
        group: ''
      }
    }
  },
  methods: {
    close () {
      this.$router.go(-1)
    }
  },
  beforeRouteEnter (to, from, next) {
    if (!SESSION.authenticated) {
      return next('/login', { replace: true })
    }
    return next()
  }
}
</script>
