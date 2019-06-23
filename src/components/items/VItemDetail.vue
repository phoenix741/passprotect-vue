<template>
  <form @submit.prevent="submit()">
    <VUploadImage ref="uploadImage" v-model="lineToModify.logo"></VUploadImage>
    <v-layout class="image" v-if="!!src" align-center="align-center" justify-center="justify-center"><img :src="src"/></v-layout>
    <v-container grid-list-md="grid-list-md">
      <v-layout wrap="wrap">
        <v-flex id="group-select" xs12="xs12">
          <v-select :label="$t('item.form.group.field')" :data-vv-as="$t('item.form.group.field')" :items="groupsWithEmpty" v-model="lineToModify.group" :error-messages="errors.collect('group')" v-validate="'required'" data-vv-name="group" name="group" required="required">
            <template slot="item" slot-scope="data">
              <template v-if="data.item !== null">{{ data.item }}</template>
              <div class="groupSelect" v-if="data.item === null"><span id="empty-item" @click="addEmptyItem()">{{ $t('item.form.group.newItem') }}</span></div>
            </template>
          </v-select>
        </v-flex>
        <v-flex xs12="xs12">
          <v-text-field id="label-input" :label="$t('item.form.label.field')" :data-vv-as="$t('item.form.label.field')" v-model="lineToModify.label" :error-messages="errors.collect('label')" v-validate="'required'" data-vv-name="label" name="label" required="required"></v-text-field>
        </v-flex>
        <template v-if="lineToModify.type == 'text'">
          <v-flex xs12="xs12">
            <v-textarea id="text-input" :label="$t('item.form.text.field')" v-model="lineToModify.content.text" auto-grow="auto-grow"></v-textarea>
          </v-flex>
        </template>
        <template v-if="lineToModify.type == 'card'">
          <v-flex xs12="xs12">
            <v-select id="type-of-card-select" :label="$t('item.form.type.field')" :items="typeOfCard" v-model="lineToModify.content.cardType"></v-select>
          </v-flex>
          <v-flex xs12="xs12">
            <v-text-field id="name-on-card-input" :label="$t('item.form.nameOnCard.field')" v-model="lineToModify.content.nameOnCard"></v-text-field>
          </v-flex>
          <v-flex xs12="xs12">
            <v-text-field id="card-number-input" :label="$t('item.form.cardNumber.field')" :append-icon="cardNumberVisibility ? 'visibility' : 'visibility_off'" @click:append="() => (cardNumberVisibility = !cardNumberVisibility)" :type="cardNumberVisibility ? 'text' : 'password'" v-model="lineToModify.content.cardNumber"></v-text-field>
          </v-flex>
          <v-flex xs12="xs12">
            <v-text-field id="cvv-input" :label="$t('item.form.cvv.field')" :append-icon="cvvVisibility ? 'visibility' : 'visibility_off'" @click:append="() => (cvvVisibility = !cvvVisibility)" :type="cvvVisibility ? 'text' : 'password'" v-model="lineToModify.content.cvv"></v-text-field>
          </v-flex>
          <v-flex xs12="xs12">
            <v-text-field id="expiry-input" :label="$t('item.form.expiry.field')" v-model="lineToModify.content.expiry"></v-text-field>
          </v-flex>
          <v-flex xs12="xs12">
            <v-text-field id="code-input" :label="$t('item.form.code.field')" :append-icon="codeVisibility ? 'visibility' : 'visibility_off'" @click:append="() => (codeVisibility = !codeVisibility)" :type="codeVisibility ? 'text' : 'password'" v-model="lineToModify.content.code"></v-text-field>
          </v-flex>
        </template>
        <template v-if="lineToModify.type == 'password'">
          <v-flex xs12="xs12">
            <v-text-field id="username-input" :label="$t('item.form.username.field')" v-model="lineToModify.content.username"></v-text-field>
          </v-flex>
          <v-flex xs12="xs12">
            <VPasswordInput class="password-input" id="password-input" :label="$t('item.form.password.field')" :words="passwordExcludedWords" v-model="lineToModify.content.password"></VPasswordInput>
          </v-flex>
          <v-flex xs12="xs12">
            <v-text-field id="siteurl-input" :label="$t('item.form.siteUrl.field')" v-model="lineToModify.content.siteUrl"></v-text-field>
          </v-flex>
        </template>
        <v-flex xs12="xs12">
          <v-textarea id="notes-input" :label="$t('item.form.notes.field')" v-model="lineToModify.content.notes" auto-grow="auto-grow"></v-textarea>
        </v-flex>
      </v-layout>
      <v-btn id="detail-button" type="submit" dark="dark" block="block" color="primary">{{ $t('item.form.button.field') }}</v-btn>
    </v-container>
    <NewGroupDialog :show="newGroupDlg" @close="cancelAddGroup" @add="addGroup"></NewGroupDialog>
  </form>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Prop, Watch } from 'vue-property-decorator';
import { TranslateResult } from 'vue-i18n';
import { cloneDeep, pick } from '@/utils/lodash';
import { generate } from './VItemDetailService';
import NewGroupDialog from '@/components/shared/NewGroupDialog.vue';
import VUploadImage from '@/components/shared/VUploadImage.vue';
import VPasswordInput from '@/components/shared/VPasswordInput.vue';
import { addMenu, addAction } from '@/services/ToolbarService';
import { toolbarEventBus } from '@/store/modules';
import { LineFragmentFragment, LineTypeEnum } from '@/generated/graphql';

@Component({
  name: 'v-item-detail',
  components: {
    NewGroupDialog,
    VUploadImage,
    VPasswordInput,
  },
})
export default class VItemDetail extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  line!: LineFragmentFragment;

  @Prop({ type: Array, default: () => [] })
  groups!: Array<string>;

  $refs!: {
    uploadImage: VUploadImage;
  };

  groupsWithEmpty?: Array<string | null> = [];

  typeOfCard?: TranslateResult;
  cardNumberVisibility = false;
  cvvVisibility = false;
  codeVisibility = false;
  newGroupDlg = false;
  lineToModify = cloneDeep(this.line);

  async created() {
    this.typeOfCard = this.$t('item.form.type.options');

    await this.updateToolbar();

    toolbarEventBus.$on('toolbar-clicked:addgroup', () => this.addEmptyItem());
    toolbarEventBus.$on('toolbar-clicked:generate', () => this.generatePassword());
    toolbarEventBus.$on('toolbar-clicked:addimage', () => this.$refs.uploadImage.addImage());
    toolbarEventBus.$on('toolbar-clicked:clearpicture', () => (this.lineToModify.logo = undefined));
  }

  async submit() {
    const valid = await this.$validator.validateAll();
    if (!valid) {
      return;
    }

    this.$emit('close', this.lineToModify);
  }

  addGroup(newGroup: string) {
    if (this.groupsWithEmpty) {
      this.groupsWithEmpty.push(newGroup);
      this.lineToModify.group = newGroup;

      this.newGroupDlg = false;
    }
  }

  cancelAddGroup() {
    this.newGroupDlg = false;
  }

  addEmptyItem() {
    this.newGroupDlg = true;
  }

  close() {
    this.$emit('close');
  }

  async generatePassword() {
    if (this.lineToModify.type === LineTypeEnum.Password) {
      this.lineToModify.content = this.lineToModify.content || {};
      this.lineToModify.content.password = await generate();
    }
  }

  get src() {
    return this.lineToModify && this.lineToModify.logo && 'data:text/plain;base64,' + this.lineToModify.logo;
  }

  get passwordExcludedWords() {
    return [(this.lineToModify.content || {}).username, (this.lineToModify.content || {}).siteUrl, this.lineToModify.group, this.lineToModify.label];
  }

  @Watch('groups', { immediate: true })
  onGroupChange(val: Array<string> = []) {
    this.groupsWithEmpty = [...val];
  }

  private async updateToolbar() {
    await addAction(this.$apollo.provider.defaultClient, {
      id: 'addgroup',
      title: this.$t('item.form.button.addgroup').toString(),
    });

    if (this.line && this.line.type === LineTypeEnum.Password) {
      await addAction(this.$apollo.provider.defaultClient, {
        id: 'generate',
        title: this.$t('item.form.button.generate').toString(),
      });
    }

    await addMenu(this.$apollo.provider.defaultClient, {
      id: 'addimage',
      title: this.$t('item.form.button.addpicture').toString(),
    });
    await addMenu(this.$apollo.provider.defaultClient, {
      id: 'clearpicture',
      title: this.$t('item.form.button.clearpicture').toString(),
    });
  }
}
</script>

<style scoped lang="stylus">
img
  max-height: 150px
</style>
