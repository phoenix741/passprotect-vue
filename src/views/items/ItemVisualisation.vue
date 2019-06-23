<template>
  <v-content v-if="line">
    <v-layout class="image" v-if="!!src" align-center="align-center" justify-center="justify-center"><img :src="src"/></v-layout>
    <v-list two-line="two-line">
      <v-list-tile>
        <v-list-tile-action>
          <v-icon class="indigo--text">label</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title id="label-text">{{ line.label }}</v-list-tile-title>
          <v-list-tile-sub-title>{{ $t('item.form.label.field') }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-divider inset="inset"></v-divider>
    <v-list three-line="three-line" v-if="line.type == 'text' && line.content.text">
      <v-list-tile>
        <v-list-tile-action>
          <v-icon class="indigo--text">text_fields</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ $t('item.form.text.field') }}</v-list-tile-title>
          <v-list-tile-sub-title id="text-text">{{ line.content.text }}</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon class="copy-button" @click="copyToClipboard(line.content.text)">content_copy</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <template v-if="line.type == 'card'">
      <v-list two-line="two-line">
        <v-list-tile v-if="line.content.cardType">
          <v-list-tile-action>
            <v-icon class="indigo--text">credit_card</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title id="type-of-card-text">{{ line.content.cardType }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ $t('item.form.type.field') }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="line.content.nameOnCard">
          <v-list-tile-action>
            <v-icon class="indigo--text"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title id="name-on-card-text">{{ line.content.nameOnCard }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ $t('item.form.nameOnCard.field') }}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon class="copy-button" @click="copyToClipboard(line.content.nameOnCard)">content_copy</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile v-if="line.content.cardNumber">
          <v-list-tile-action>
            <v-icon class="indigo--text"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title id="card-number-text">{{ line.content.cardNumber }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ $t('item.form.cardNumber.field') }}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon class="copy-button" @click="copyToClipboard(line.content.cardNumber)">content_copy</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile v-if="line.content.cvv">
          <v-list-tile-action>
            <v-icon class="indigo--text"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title id="cvv-text">{{ line.content.cvv }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ $t('item.form.cvv.field') }}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon class="copy-button" @click="copyToClipboard(line.content.cvv)">content_copy</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile v-if="line.content.code">
          <v-list-tile-action>
            <v-icon class="indigo--text"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title id="code-text">{{ line.content.code }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ $t('item.form.code.field') }}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon class="copy-button" @click="copyToClipboard(line.content.code)">content_copy</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile v-if="line.content.expiry">
          <v-list-tile-action>
            <v-icon class="indigo--text"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title id="expiry-text">{{ line.content.expiry }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ $t('item.form.expiry.field') }}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon class="copy-button" @click="copyToClipboard(line.content.expiry)">content_copy</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-divider inset="inset" v-if="line.content.code"></v-divider>
      <v-list two-line="two-line" v-if="line.content.code">
        <v-list-tile>
          <v-list-tile-action>
            <v-icon class="indigo--text">vpn_key</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ line.content.code }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ $t('item.form.code.field') }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </template>
    <template v-if="line.type == 'password'">
      <v-list three-line="three-line">
        <v-list-tile v-if="line.content.username">
          <v-list-tile-action>
            <v-icon class="indigo--text">lock</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title id="username-text">{{ line.content.username }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ $t('item.form.username.field') }}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon class="copy-button" @click="copyToClipboard(line.content.username)">content_copy</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile v-if="line.content.password">
          <v-list-tile-action>
            <v-icon class="indigo--text"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title id="password-text">{{ line.content.password }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ $t('item.form.password.field') }}</v-list-tile-sub-title>
            <v-list-tile-sub-title>
              <VProgressZxcvbn :value="zxcvbnValue" :words="zxcvbnWords"></VProgressZxcvbn>
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon class="copy-button" @click="copyToClipboard(line.content.password)">content_copy</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-divider inset="inset" v-if="line.content.siteUrl"></v-divider>
      <v-list two-line="two-line" v-if="line.content.siteUrl">
        <v-list-tile>
          <v-list-tile-action>
            <v-icon class="indigo--text">web</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title id="siteurl-text">{{ line.content.siteUrl }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ $t('item.form.siteUrl.field') }}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon class="copy-button" @click="copyToClipboard(line.content.siteUrl)">content_copy</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </template>
    <v-divider inset="inset" v-if="line.content.notes"></v-divider>
    <v-list three-line="three-line" v-if="line.content.notes">
      <v-list-tile>
        <v-list-tile-action>
          <v-icon class="indigo--text">note</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ $t('item.form.notes.field') }}</v-list-tile-title>
          <v-list-tile-sub-title id="notes-text">{{ line.content.notes }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-btn class="red darken-2" dark="dark" fab="fab" fixed="fixed" bottom="bottom" right="right" :to="'/items/' + line._id + '/edit'">
      <v-icon>mode_edit</v-icon>
    </v-btn>
    <v-dialog v-model="removeDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <div class="headline">{{ $t('alert.confirm_remove.title') }}</div>
        </v-card-title>
        <v-card-text>{{ $t('alert.confirm_remove.message', {title: line.label}) }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="cancel-btn green--text darken-1" flat="flat" ripple="ripple" @click="removeDialog = false">{{ $t('alert.confirm_remove.disagree') }}</v-btn>
          <v-btn class="delete-btn green--text darken-1" flat="flat" ripple="ripple" @click="remove(line)">{{ $t('alert.confirm_remove.agree') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Prop, Watch } from 'vue-property-decorator';
import copy from 'clipboard-copy';
import AnalyticsMixin from '@/mixins/piwik';
import { TranslateResult } from 'vue-i18n';
import { defineToolbar } from '@/services/ToolbarService';
import { toolbarEventBus } from '@/store/modules';
import lineQuery from '@/services/graphql/lines/line.graphql';
import { SmartQuery } from 'vue-apollo-decorator';
import { GetLineQuery, GetLineQueryVariables, LineFragmentFragment } from '@/generated/graphql';
import { removeLine } from '../../services/ItemService';

@Component({
  name: 'item-visualisation',
  components: {
    VProgressZxcvbn: () => import('@/components/shared/VProgressZxcvbn.vue'),
  },
})
export default class ItemVisualisation extends Mixins(AnalyticsMixin) {
  @Prop({
    type: String,
    required: true,
  })
  id!: string;

  @SmartQuery<ItemVisualisation, GetLineQuery, GetLineQueryVariables>({
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
  title?: TranslateResult;

  editDialog = false;
  removeDialog = false;

  async created() {
    toolbarEventBus.$on('toolbar-clicked:delete', () => (this.removeDialog = true));
  }

  async copyToClipboard(label: string) {
    await copy(label);
  }

  async remove(line: LineFragmentFragment) {
    this.removeDialog = false;
    await removeLine(line);
    this.$router.go(-1);
  }

  get src() {
    return this.line && this.line.logo && 'data:text/plain;base64,' + this.line.logo;
  }

  get zxcvbnValue() {
    if (this.line) {
      return (this.line.content || {}).password;
    }
    return '';
  }

  get zxcvbnWords() {
    if (this.line) {
      return [(this.line.content || {}).username, (this.line.content || {}).siteUrl, this.line.group, this.line.label].filter(
        (e): e is string => !!e,
      );
    }
    return [];
  }

  @Watch('line')
  async onLineChanged(line: LineFragmentFragment) {
    this.title = this.$t('item.title_visualisation') + ' - ' + this.$t(line.typeLabel || '');
    await defineToolbar(this.$apollo.provider.defaultClient, {
      title: this.title.toString(),
      searchEnabled: false,
      menu: [{ id: 'delete', title: this.$t('item.form.button.delete').toString() }],
    });

    // Changement of the line indicate a changement of page.
    this.trackPage();
  }
}
</script>

<style lang="stylus" scoped>
img
  padding: 10px
  max-height: 150px
</style>
