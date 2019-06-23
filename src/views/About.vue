<template>
  <v-content>
    <v-container fluid="fluid">
      <h2 class="header">{{ $t('about.title') }}</h2>
      <p class="caption">{{ $t('about.copyright') }}</p>
      <h3>{{ $t('about.licence') }}</h3>
      <p>MIT License</p>
      <p>Copyright (c) 2017 Ulrich Van Den Hekke</p>
      <p>Permission is hereby granted, free of charge, to any person obtaining a copy
      of this software and associated documentation files (the "Software"), to deal
      in the Software without restriction, including without limitation the rights
      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
      copies of the Software, and to permit persons to whom the Software is
      furnished to do so, subject to the following conditions:</p>
      <p>The above copyright notice and this permission notice shall be included in all
      copies or substantial portions of the Software.</p>
      <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
      SOFTWARE.</p>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import { TranslateResult } from 'vue-i18n';
import AnalyticsMixin from '@/mixins/piwik';
import { defineToolbar } from '../services/ToolbarService';

@Component({
  name: 'page-about',
})
export default class About extends Mixins(AnalyticsMixin) {
  title?: TranslateResult;

  async created() {
    this.title = this.$t('about.title');
    await defineToolbar(this.$apollo.provider.defaultClient, {
      title: this.title.toString(),
      searchEnabled: true,
    });
  }
}
</script>
