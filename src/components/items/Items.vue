<template lang="pug">
div
  v-toolbar(color="primary",dark)
    v-toolbar-title.ml-0.pl-3.white--text {{ $t('app.title') }}
    v-text-field.mx-3.search-input(flat,solo-inverted,prepend-inner-icon="search",:label="$t('list.search')",v-on:input="search",slot="extension")
    v-spacer
    v-menu(offset-y)
      v-btn(icon,color="primary",slot="activator",dark)
        v-icon more_vert
      v-list
        v-list-tile.logout-link(v-on:click.native="handleLogout()")
          v-list-tile-title {{ $t('app.menu.logout') }}
        v-list-tile.export-link(v-on:click.native="handleExport()")
          v-list-tile-title {{ $t('app.menu.export') }}
        v-divider
        v-list-tile.about-link(router=true,to="/about")
          v-list-tile-title {{ $t('app.menu.about') }}

  v-content
    v-list#items-list
      template(v-for="(lines, title, indexGroup) in linesByGroup")
        v-subheader.group-title(v-text="title")
        template(v-for="(line, index) in lines")
          v-list-tile(:key="line._id",v-on:click="showDetail(line, $event)",avatar)
            v-list-tile-action.avatar
              v-icon.white--text(v-if="!line.logo",:class="cardType(line).color") {{ cardType(line).icon }}
              img(v-else="!!line.logo",:src="'data:text/plain;base64,' + line.logo")
            v-list-tile-content
              v-list-tile-title.line-title {{ line.label }}
            v-list-tile-action
              v-dialog(v-model="dialog['remove' + line._id]" max-width="500px")
                v-btn.item-delete-btn(icon,ripple,slot="activator")
                  v-icon.grey--text.text--lighten-1 delete
                v-card
                  v-card-title
                    .headline {{ $t('alert.confirm_remove.title') }}
                  v-card-text {{ $t('alert.confirm_remove.message', {title: line.label}) }}
                  v-card-actions
                    v-spacer
                    v-btn.cancel-btn.green--text.darken-1(flat="flat",ripple,v-on:click="dialog['remove' + line._id] = false") {{ $t('alert.confirm_remove.disagree') }}
                    v-btn.delete-btn.green--text.darken-1(flat="flat",ripple,v-on:click="remove(line)") {{ $t('alert.confirm_remove.agree') }}
          v-divider(:inset="index < lines.length - 1",v-if="index < lines.length - 1 || indexGroup != groupCount - 1")
      v-list-tile(v-if="lines.length == 0")
        v-list-tile-content
          v-list-tile-title.text-xs-center {{ $t('list.empty') }}

      v-speed-dial(:bottom="true",:right="true",:fixed="true")
        v-btn#items-add-button.red.darken-2(slot="activator",dark,fab,hover)
          v-icon add
          v-icon close
        v-btn#items-add-card-button.red(fab,dark,small,to="/items/card/new")
          v-icon credit_card
        v-btn#items-add-password-button.blue(fab,dark,small,to="/items/password/new")
          v-icon fingerprint
        v-btn#items-add-text-button.green(fab,dark,small,to="/items/text/new")
          v-icon text_fields

  v-dialog(v-model="progressDialog",overlay,persistent,width="300")
    v-card(color="primary",dark)
      v-card-text
        | {{ $t('list.progress') }}
        v-progress-linear.mb-0(indeterminate,color="white")
</template>

<script type="text/babel">
import { SESSION, logout } from '../user/UserService'
import { removeLine, exportLinesAsCsv } from './ItemService'
import { cardTypeMapping } from './ItemCryptedService'
import { saveLinesAsCsv } from './ItemServiceCordova'
import getLines from './getLines.gql'
import { debounce } from '../../utils/lodash'
import AnalyticsMixin from '../../utils/piwik'
import ItemCreation from './ItemCreation'

export default {
  name: 'items',
  mixins: [AnalyticsMixin],
  props: ['q'],
  components: {
    'item-creation': ItemCreation
  },
  data () {
    return {
      title: this.$t('list.title'),
      showOptions: false,
      drawer: true,
      dialog: {},
      progressDialog: false,
      lines: []
    }
  },
  computed: {
    linesByGroup () {
      const searchFilter = !!this.q && new RegExp(this.q)
      return this.lines
        .filter(line => !searchFilter || searchFilter.test(line.label) || searchFilter.test(line.group))
        .sort((l1, l2) => {
          const result = l1.group.localeCompare(l2.group)
          if (result === 0) {
            return l1.label.localeCompare(l2.label)
          }
          return result
        })
        .reduce((acc, line) => {
          acc[line.group] = acc[line.group] || []
          acc[line.group].push(line)
          return acc
        }, {})
    },
    groupCount () {
      return Object.keys(this.linesByGroup || {}).length
    }
  },
  methods: {
    async handleLogout () {
      await logout(this)
    },
    async handleExport () {
      try {
        this.progressDialog = true
        if (process.env.CORDOVA_PLATFORM) {
          await saveLinesAsCsv(this)
        } else {
          await exportLinesAsCsv(this)
        }
      } catch (err) {
        console.log('can\'t export the csv', err)
      }
      this.progressDialog = false
    },
    search: debounce(function (value) {
      this.$router.replace(`/items?q=${value}`)
    }, 500),
    remove (line) {
      this.dialog['remove' + line._id] = false
      removeLine(this, line._id)
    },
    showDetail (line, $event) {
      var target = $event.target || $event.srcElement

      while (target) {
        if (target instanceof HTMLButtonElement) {
          break
        }

        target = target.parentNode
      }

      if (!target || !target.className.match(/\bdelete-btn\b/)) {
        this.$router.push('/items/' + line._id)
      }
    },
    cardType (line) {
      line = line || {}
      return cardTypeMapping[line.type || 'text']
    }
  },
  beforeRouteEnter (to, from, next) {
    if (!SESSION.authenticated) {
      return next('/login', { replace: true })
    }
    return next()
  },
  apollo: {
    lines: {
      query: getLines,
      result ({ data }) {
        // Create the dialog element used for reactivity. If not the dialog will not work
        (data.lines || []).forEach((line, index) => {
          this.$set(this.dialog, 'remove' + index, false)
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.avatar
  .v-icon, img
    width: 50px
    height: 30px
    margin-right: 5px
    border-radius: 5px
</style>
