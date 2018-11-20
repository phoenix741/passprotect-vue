<template lang="pug">
div
  v-toolbar(color="primary",dark,app)
    v-btn(icon,exact,@click="$router.go(-1)")
      v-icon arrow_back
    v-toolbar-title.ml-0.pl-3
      span#title-label {{ $t(cardType.label) }}
  v-content
    v-layout.image(v-if="!!src",align-center,justify-center)
      img(:src="src")

    v-list(two-line)
      v-list-tile
        v-list-tile-action
          v-icon.indigo--text label
        v-list-tile-content
          v-list-tile-title#label-text {{ line.label }}
          v-list-tile-sub-title {{ $t('item.form.label.field') }}

    v-divider(inset)
    v-list(three-line,v-if="line.type == 'text' && clearInformation.text")
      v-list-tile
        v-list-tile-action
          v-icon.indigo--text text_fields
        v-list-tile-content
          v-list-tile-title {{ $t('item.form.text.field') }}
          v-list-tile-sub-title#text-text {{ clearInformation.text }}
        v-list-tile-action
          v-icon.copy-button(v-on:click="copyToClipboard(clearInformation.text)") content_copy

    template(v-if="line.type == 'card'")
      v-list(two-line)
        v-list-tile(v-if="clearInformation.type")
          v-list-tile-action
            v-icon.indigo--text credit_card
          v-list-tile-content
            v-list-tile-title#type-of-card-text {{ clearInformation.type }}
            v-list-tile-sub-title {{ $t('item.form.type.field') }}
        v-list-tile(v-if="clearInformation.nameOnCard")
          v-list-tile-action
            v-icon.indigo--text
          v-list-tile-content
            v-list-tile-title#name-on-card-text {{ clearInformation.nameOnCard }}
            v-list-tile-sub-title {{ $t('item.form.nameOnCard.field') }}
          v-list-tile-action
            v-icon.copy-button(v-on:click="copyToClipboard(clearInformation.nameOnCard)") content_copy
        v-list-tile(v-if="clearInformation.cardNumber")
          v-list-tile-action
            v-icon.indigo--text
          v-list-tile-content
            v-list-tile-title#card-number-text {{ clearInformation.cardNumber }}
            v-list-tile-sub-title {{ $t('item.form.cardNumber.field') }}
          v-list-tile-action
            v-icon.copy-button(v-on:click="copyToClipboard(clearInformation.cardNumber)") content_copy
        v-list-tile(v-if="clearInformation.cvv")
          v-list-tile-action
            v-icon.indigo--text
          v-list-tile-content
            v-list-tile-title#cvv-text {{ clearInformation.cvv }}
            v-list-tile-sub-title {{ $t('item.form.cvv.field') }}
          v-list-tile-action
            v-icon.copy-button(v-on:click="copyToClipboard(clearInformation.cvv)") content_copy
        v-list-tile(v-if="clearInformation.code")
          v-list-tile-action
            v-icon.indigo--text
          v-list-tile-content
            v-list-tile-title#code-text {{ clearInformation.code }}
            v-list-tile-sub-title {{ $t('item.form.code.field') }}
          v-list-tile-action
            v-icon.copy-button(v-on:click="copyToClipboard(clearInformation.code)") content_copy
        v-list-tile(v-if="clearInformation.expiry")
          v-list-tile-action
            v-icon.indigo--text
          v-list-tile-content
            v-list-tile-title#expiry-text {{ clearInformation.expiry }}
            v-list-tile-sub-title {{ $t('item.form.expiry.field') }}
          v-list-tile-action
            v-icon.copy-button(v-on:click="copyToClipboard(clearInformation.expiry)") content_copy

      v-divider(inset,v-if="clearInformation.code")
      v-list(two-line,v-if="clearInformation.code")
        v-list-tile
          v-list-tile-action
            v-icon.indigo--text vpn_key
          v-list-tile-content
            v-list-tile-title {{ clearInformation.code }}
            v-list-tile-sub-title {{ $t('item.form.code.field') }}

    template(v-if="line.type == 'password'")
      v-list(two-line)
        v-list-tile(v-if="clearInformation.username")
          v-list-tile-action
            v-icon.indigo--text lock
          v-list-tile-content
            v-list-tile-title#username-text {{ clearInformation.username }}
            v-list-tile-sub-title {{ $t('item.form.username.field') }}
          v-list-tile-action
            v-icon.copy-button(v-on:click="copyToClipboard(clearInformation.username)") content_copy

        v-list-tile(v-if="clearInformation.password")
          v-list-tile-action
            v-icon.indigo--text
          v-list-tile-content
            v-list-tile-title#password-text {{ clearInformation.password }}
            v-list-tile-sub-title {{ $t('item.form.password.field') }}
          v-list-tile-action
            v-icon.copy-button(v-on:click="copyToClipboard(clearInformation.password)") content_copy

        v-list-tile(v-if="clearInformation.password")
          v-list-tile-action
            v-icon.indigo--text
          v-list-tile-content
            v-list-tile-title#security-password-text
              v-progress-linear(:value="zxcvbnProgress",:color="zxcvbnColor")

      v-divider(inset,v-if="clearInformation.siteUrl")
      v-list(two-line,v-if="clearInformation.siteUrl")
        v-list-tile
          v-list-tile-action
            v-icon.indigo--text web
          v-list-tile-content
            v-list-tile-title#siteurl-text {{ clearInformation.siteUrl }}
            v-list-tile-sub-title {{ $t('item.form.siteUrl.field') }}
          v-list-tile-action
            v-icon.copy-button(v-on:click="copyToClipboard(clearInformation.siteUrl)") content_copy

    v-divider(inset,v-if="clearInformation.notes")
    v-list(three-line,v-if="clearInformation.notes")
      v-list-tile
        v-list-tile-action
          v-icon.indigo--text note
        v-list-tile-content
          v-list-tile-title {{ $t('item.form.notes.field') }}
          v-list-tile-sub-title#notes-text {{ clearInformation.notes }}

    v-btn.red.darken-2(dark,fab,fixed,bottom,right,:to="'/items/' + line._id + '/edit'")
      v-icon mode_edit
</template>

<script type="text/babel">
import copy from 'clipboard-copy'
import getLine from './getLine.gql'
import AnalyticsMixin from '../../utils/piwik'
import { cardTypeMapping, decryptLine } from './ItemCryptedService'
import zxcvbn from 'zxcvbn'

export default {
  props: ['id'],
  mixins: [AnalyticsMixin],
  name: 'item-visualisation',
  data () {
    return {
      title: this.$t('item.title_visualisation'),
      line: {},
      clearInformation: {},
      editDialog: false
    }
  },
  methods: {
    copyToClipboard (label) {
      copy(label)
    },
    async decryptClearInformation (val) {
      this.clearInformation = await decryptLine(this.$store.state.user.clearKey, val)
    }
  },
  computed: {
    cardType () {
      return cardTypeMapping[this.line.type || 'text']
    },
    src () {
      return this.line && this.line.logo && 'data:text/plain;base64,' + this.line.logo
    },
    zxcvbn () {
      return (this.clearInformation.password && zxcvbn(this.clearInformation.password, [this.clearInformation.username, this.clearInformation.siteUrl, this.line.group, this.line.label].filter(e => !!e))) || { feedback: {} }
    },
    zxcvbnProgress () {
      return this.zxcvbn.score * 25
    },
    zxcvbnColor () {
      return ['red accent-2', 'orange', 'amber', 'light-green ', 'green'][this.zxcvbn.score]
    }
  },
  watch: {
    line (val) {
      this.decryptClearInformation(val)
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

<style lang="stylus" scoped>
img
  max-height: 150px
</style>
