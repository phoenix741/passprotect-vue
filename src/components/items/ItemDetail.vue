<template lang="pug">
v-card
  form(@submit.prevent="submit()")
    v-toolbar(dark,color="primary")
      v-btn(icon,@click.native="close()",dark)
        v-icon close
      v-toolbar-title#title-label {{ $t(cardType.label) }}
      v-spacer
      v-toolbar-items
        v-btn#generate-password(v-if="lineToModify.type == 'password'",dark,flat,v-on:click.native="generatePassword()") {{ $t('item.form.button.generate') }}
        v-btn#detail-button(type="submit",dark,flat) {{ $t('item.form.button.field') }}
      v-menu(bottom,right,offset-y)
        v-btn#menu(slot="activator",dark,icon)
          v-icon more_vert
        v-list
          upload-image(v-model="lineToModify.logo") {{ $t('item.form.button.addpicture') }}
          v-list-tile#clear-image(v-on:click="lineToModify.logo = null")
            v-list-tile-title {{ $t('item.form.button.clearpicture') }}
    v-layout.image(v-if="!!src",align-center,justify-center)
      img(:src="src")

    v-container(grid-list-md)
      v-layout(wrap)
        v-flex#group-select(xs12)
          v-select(
            :label="$t('item.form.group.field')",
            :data-vv-as="$t('item.form.group.field')",
            :items="groups",
            v-model="lineToModify.group",
            :error-messages="errors.collect('group')",
            v-validate="'required'",
            data-vv-name="group",
            name="group",
            required)
            template(slot="item",slot-scope="data")
              template(v-if="data.item !== null") {{ data.item }}
              div.groupSelect(v-if="data.item === null")
                span#empty-item(@click="addEmptyItem()") {{ $t('item.form.group.newItem') }}

        v-flex(xs12)
          v-text-field#label-input(
            :label="$t('item.form.label.field')"
            :data-vv-as="$t('item.form.label.field')",
            v-model="lineToModify.label",
            :error-messages="errors.collect('label')",
            v-validate="'required'",
            data-vv-name="label",
            name="label",
            required)

        template(v-if="lineToModify.type == 'text'")
          v-flex(xs12)
            v-textarea#text-input(
              :label="$t('item.form.text.field')",
              v-model="clearInformation.text",
              auto-grow)

        template(v-if="lineToModify.type == 'card'")
          v-flex(xs12)
            v-select#type-of-card-select(
              :label="$t('item.form.type.field')",
              v-bind:items="typeOfCard",
              v-model="clearInformation.type")

          v-flex(xs12)
            v-text-field#name-on-card-input(
              :label="$t('item.form.nameOnCard.field')",
              v-model="clearInformation.nameOnCard")

          v-flex(xs12)
            v-text-field#card-number-input(
              :label="$t('item.form.cardNumber.field')",
              :append-icon="cardNumberVisibility ? 'visibility' : 'visibility_off'"
              @click:append="() => (cardNumberVisibility = !cardNumberVisibility)"
              :type="cardNumberVisibility ? 'text' : 'password'"
              v-model="clearInformation.cardNumber")

          v-flex(xs12)
            v-text-field#cvv-input(
              :label="$t('item.form.cvv.field')",
              :append-icon="cvvVisibility ? 'visibility' : 'visibility_off'"
              @click:append="() => (cvvVisibility = !cvvVisibility)"
              :type="cvvVisibility ? 'text' : 'password'"
              v-model="clearInformation.cvv")

          v-flex(xs12)
            v-text-field#expiry-input(
              :label="$t('item.form.expiry.field')",
              v-model="clearInformation.expiry")

          v-flex(xs12)
            v-text-field#code-input(
              :label="$t('item.form.code.field')",
              :append-icon="codeVisibility ? 'visibility' : 'visibility_off'"
              @click:append="() => (codeVisibility = !codeVisibility)"
              :type="codeVisibility ? 'text' : 'password'"
              v-model="clearInformation.code")

        template(v-if="lineToModify.type == 'password'")
          v-flex(xs12)
            v-text-field#username-input(
              :label="$t('item.form.username.field')",
              v-model="clearInformation.username")

          v-flex(xs12)
            PasswordInput.password-input#password-input(
              :label="$t('item.form.password.field')",
              :words="passwordExcludedWords"
              v-model="clearInformation.password"
            )

          v-flex(xs12)
            v-text-field#siteurl-input(
              :label="$t('item.form.siteUrl.field')",
              v-model="clearInformation.siteUrl")

        v-flex(xs12)
          v-textarea#notes-input(
            :label="$t('item.form.notes.field')",
            v-model="clearInformation.notes",
            auto-grow)
  new-group(:show="newGroupDlg",@close="cancelAddGroup",@add="addGroup")
</template>

<script type="text/babel">
import { pick, cloneDeep } from '../../utils/lodash'
import { updateLine } from './ItemService'
import { cardTypeMapping, decryptLine, encryptLine, generate } from './ItemCryptedService'
import getGroups from './getGroups.gql'
import NewGroupVue from './NewGroup.vue'
import UploadImageVue from '../shared/UploadImage.vue'
import PasswordInput from '../shared/PasswordInput.vue'

export default {
  $validates: true,
  props: ['line'],
  name: 'item-detail',
  components: {
    'new-group': NewGroupVue,
    'upload-image': UploadImageVue,
    PasswordInput
  },
  data () {
    return {
      lineToModify: cloneDeep(this.line),
      cardNumberVisibility: false,
      cvvVisibility: false,
      codeVisibility: false,
      clearInformation: {},
      typeOfCard: this.$t('item.form.type.options'),
      groups: [],
      newGroupDlg: false
    }
  },
  apollo: {
    groups: {
      query: getGroups,
      result ({ data }) {
        // Create the dialog element used for reactivity. If not the dialog will not work
        data.groups.push(null)
      }
    }
  },
  methods: {
    async submit () {
      const valid = await this.$validator.validateAll()
      if (!valid) {
        return
      }

      const line = pick(this.lineToModify, ['_id', 'type', 'label', 'group', 'logo', '_rev'])
      line.encryption = await encryptLine(this.clearInformation)

      await updateLine(this, line)
      this.close()
    },
    addGroup (newGroup) {
      this.groups.splice(0, 0, newGroup)
      this.lineToModify.group = newGroup

      this.newGroupDlg = false
    },
    cancelAddGroup () {
      this.lineToModify.group = null

      this.newGroupDlg = false
    },
    async generatePassword () {
      this.clearInformation.password = await generate()
    },
    async decryptClearInformation (val) {
      if (!val.type) {
        val = { type: 'text' }
      }
      this.clearInformation = await decryptLine(val)
    },
    close () {
      this.$emit('close')
    },
    addEmptyItem () {
      this.newGroupDlg = true
    }
  },
  computed: {
    cardType () {
      return cardTypeMapping[this.lineToModify.type || 'text']
    },
    src () {
      return this.lineToModify && this.lineToModify.logo && 'data:text/plain;base64,' + this.lineToModify.logo
    },
    passwordExcludedWords () {
      return [this.clearInformation.username, this.clearInformation.siteUrl, this.lineToModify.group, this.lineToModify.label]
    }
  },
  watch: {
    lineToModify: {
      immediate: true,
      async handler (val) {
        await this.decryptClearInformation(val)
      }
    }
  }
}
</script>

<style scoped lang="stylus">
img
  max-height: 150px
</style>
