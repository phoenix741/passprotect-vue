<template>
  <v-content>
    <VItemDetail :line="line" :groups="groups" @close="close($event)"></VItemDetail>
  </v-content>
</template>

<script lang="ts">
import { TranslateResult } from 'vue-i18n';
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator';
import AnalyticsMixin from '@/mixins/piwik';
import VItemDetail from '@/components/items/VItemDetail.vue';
import { defineToolbar } from '@/services/ToolbarService';
import { toolbarEventBus } from '@/store/modules';
import groupQuery from '@/services/graphql/lines/group.graphql';
import { SmartQuery } from 'vue-apollo-decorator';
import { GetGroupQuery, GetGroupQueryVariables, LineTypeEnum, WalletLine, LineFragmentFragment, ClearLineCreateInput } from '@/generated/graphql';
import { createClearLine } from '@/services/ItemService';

@Component({
  name: 'item-creation',
  components: {
    VItemDetail,
  },
})
export default class ItemCreation extends Mixins(AnalyticsMixin) {
  @Prop({ type: String, required: true })
  type!: LineTypeEnum;

  @SmartQuery<ItemCreation, GetGroupQuery, GetGroupQueryVariables>({ query: groupQuery })
  groups?: Array<String>;

  line?: Partial<LineFragmentFragment>;
  title?: TranslateResult;

  async created() {
    this.title = this.$t('item.title_creation');
    this.line = { type: this.type, content: {} };
    await defineToolbar(this.$apollo.provider.defaultClient, {
      title: this.title.toString(),
      searchEnabled: false,
    });
  }

  async close(newLine?: ClearLineCreateInput) {
    if (newLine) {
      await createClearLine(newLine);
    }
    this.$router.go(-1);
  }
}
</script>
