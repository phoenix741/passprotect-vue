<template>  
  <div>
    <v-toolbar color="primary" dark="dark" app="app">
      <v-btn icon="icon" @click="$router.go(-1)">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title class="ml-0 pl-3"><span>{{ $t('app.title') }}</span></v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid="fluid">
        <h2 class="header">{{ $t('terms.title') }}</h2>
        <div>Icon made by monkik (https://www.flaticon.com/authors/monkik) from www.flaticon.com</div>
      </v-container>
    </v-content>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import { TranslateResult } from 'vue-i18n';
import AnalyticsMixin from '@/mixins/piwik';
import { defineToolbar } from '../services/ToolbarService';

@Component({
  name: 'page-terms',
})
export default class Terms extends Mixins(AnalyticsMixin) {
  title?: TranslateResult;

  async created() {
    this.title = this.$t('terms.title');
    await defineToolbar(this.$apollo.provider.defaultClient, {
      title: this.title.toString(),
      searchEnabled: true,
    });
  }
}
</script>
