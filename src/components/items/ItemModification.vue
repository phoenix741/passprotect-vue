<template lang="pug">
item-detail(v-bind:line="line",@close="close()")
</template>

<script type="text/babel">
import ItemDetail from './ItemDetail.vue'
import getLine from './getLine.gql'
import AnalyticsMixin from '../../utils/piwik'

export default {
  props: ['id'],
  mixins: [AnalyticsMixin],
  components: {
    'item-detail': ItemDetail
  },
  name: 'item-modification',
  data () {
    return {
      title: this.$t('item.title_modification'),
      line: {}
    }
  },
  methods: {
    close () {
      this.$router.go(-1)
    }
  },
  apollo: {
    line: {
      query: getLine,
      variables () {
        return {
          id: this.id
        }
      }
    }
  }
}
</script>
