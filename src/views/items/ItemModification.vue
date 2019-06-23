<template>
  <v-content v-if="line">
    <VItemDetail :line="line" :groups="groups" @close="close($event)"></VItemDetail>
  </v-content>
</template>

<script lang="ts">
import { TranslateResult } from 'vue-i18n';
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator';
import { SmartQuery } from 'vue-apollo-decorator';
import AnalyticsMixin from '@/mixins/piwik';
import VItemDetail from '@/components/items/VItemDetail.vue';
import { defineToolbar } from '@/services/ToolbarService';
import { toolbarEventBus } from '@/store/modules';
import { GetLineQuery, GetLineQueryVariables, LineFragmentFragment, Query, ClearLineUpdateInput, GetGroupQueryVariables } from '@/generated/graphql';
import lineQuery from '@/services/graphql/lines/line.graphql';
import groupQuery from '@/services/graphql/lines/group.graphql';
import { updateClearLine } from '@/services/ItemService';
import { GetGroupQuery } from '../../generated/graphql';

@Component({
  name: 'item-modification',
  components: {
    VItemDetail,
  },
})
export default class ItemModification extends Mixins(AnalyticsMixin) {
  @Prop({
    type: String,
    required: true,
  })
  id!: string;

  @SmartQuery<ItemModification, GetLineQuery, GetLineQueryVariables>({
    query: lineQuery,
    variables() {
      // Start tracking time to generate the page.
      this.startTracking();
      return {
        id: this.id,
      };
    },
  })
  line?: LineFragmentFragment;

  @SmartQuery<ItemModification, GetGroupQuery, GetGroupQueryVariables>({ query: groupQuery })
  groups?: Array<string>;

  title?: TranslateResult;

  async created() {
    this.title = this.$t('item.title_modification');
    await defineToolbar(this.$apollo.provider.defaultClient, {
      title: this.title.toString(),
      searchEnabled: false,
    });
  }

  async close(updateLine?: ClearLineUpdateInput) {
    if (updateLine) {
      await updateClearLine(updateLine);
    }
    this.$router.go(-1);
  }
}
</script>
