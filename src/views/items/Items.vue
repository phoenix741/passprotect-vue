<template>
  <div>
    <v-content>
      <v-item-list :lines="lines" :search="q" :isLoading="$apollo.loading" :hasError="hasError" @selectLine="selectLine($event)"></v-item-list>
      <v-speed-dial :bottom="true" :right="true" :fixed="true">
        <v-btn class="red darken-2" id="items-add-button" slot="activator" dark="dark" fab="fab" hover="hover">
          <v-icon>add</v-icon>
          <v-icon>close</v-icon>
        </v-btn>
        <v-btn class="red" id="items-add-card-button" fab="fab" dark="dark" small="small" to="/items/card/new">
          <v-icon>credit_card</v-icon>
        </v-btn>
        <v-btn class="blue" id="items-add-password-button" fab="fab" dark="dark" small="small" to="/items/password/new">
          <v-icon>fingerprint</v-icon>
        </v-btn>
        <v-btn class="green" id="items-add-text-button" fab="fab" dark="dark" small="small" to="/items/text/new">
          <v-icon>text_fields</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-content>
    <v-dialog v-model="progressDialog" overlay="overlay" persistent="persistent" width="300">
      <v-card color="primary" dark="dark">
        <v-card-text>{{ $t('list.progress') }}
          <v-progress-linear class="mb-0" indeterminate="indeterminate" color="white"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag';
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator';
import AnalyticsMixin from '@/mixins/piwik';
import { TranslateResult } from 'vue-i18n';
import { debounce } from '@/utils/lodash';
import VItemList from '@/components/items/VItemList.vue';
import { exportLinesAsCsv } from '@/services/ItemService';
import { defineToolbar } from '@/services/ToolbarService';
import { toolbarEventBus } from '@/store/modules';
import lineQuery from '@/services/graphql/lines/lines.graphql';
import { SmartQuery } from 'vue-apollo-decorator';
import { LineFragmentFragment, GetLinesQuery, GetLinesQueryVariables } from '@/generated/graphql';

@Component({
  name: 'items',
  components: {
    'v-item-list': VItemList,
  },
})
export default class Items extends Mixins(AnalyticsMixin) {
  @Prop()
  q?: string;

  @SmartQuery<Items, GetLinesQuery, GetLinesQueryVariables>({
    query: lineQuery,
    notifyOnNetworkStatusChange: true,
    update: data => data.lines || [],
    error: function(error) {
      this.hasError = !!error;
    },
  })
  lines!: Array<LineFragmentFragment>;

  hasError = false;
  progressDialog = false;

  title?: TranslateResult;

  async created() {
    this.title = this.$t('list.title');
    this.lines = [];
    await defineToolbar(this.$apollo.provider.defaultClient, {
      title: this.title.toString(),
      searchEnabled: true,
      menu: [
        { id: 'export', title: this.$t('app.menu.export').toString() },
        { id: 'spacer' },
        { id: 'logout', title: this.$t('app.menu.logout').toString() },
        {
          id: 'about',
          title: this.$t('app.menu.about').toString(),
          router: '/about',
        },
      ],
    });

    toolbarEventBus.$on('toolbar-clicked:export', () => this.handleExport());
    toolbarEventBus.$on('toolbar-clicked:logout', () => this.handleLogout());
  }

  search(value: string) {
    debounce((value: string) => this.$router.replace(`/items?q=${value}`), 500)(value);
  }

  selectLine(line: LineFragmentFragment) {
    this.$router.push(`/items/${line._id}`);
  }

  async handleExport() {
    try {
      this.progressDialog = true;
      await exportLinesAsCsv();
    } catch (err) {
      console.log("can't export the csv", err);
    }
    this.progressDialog = false;
  }

  async handleLogout() {
    //
  }
}
</script>
