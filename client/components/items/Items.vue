<template lang="pug">
q-layout(ref='layout',view='lHh Lpr fff',:left-class="{'bg-grey-2': true}")
  q-toolbar.glossy(slot='header')
    q-btn(flat,@click='$refs.layout.toggleLeft()')
      q-icon(name='menu')

    q-toolbar-title {{ trans('app.title') }}
    q-search.glossy.primary.search-input(:debounce="500",:placeholder="trans('items:list.search')",v-on:input="search")


  div(slot='left')
    q-list(no-border,link,inset-delimiter)
      q-item(router=true,to="/about")
        q-item-side(icon="chat_bubble")
        q-item-main(:label="trans('app.menu.about')")
      q-item(@click="handleExport()")
        q-item-side(icon="import_export")
        q-item-main(:label="trans('app.menu.export')")
      q-item(@click="handleLogout()")
        q-item-side(icon="power_settings_new")
        q-item-main(:label="trans('app.menu.logout')")

  v-content
    v-list#items-list(two-line)
      template(v-for="(lines, title, indexGroup) in linesByGroup")
        v-subheader.group-title(v-text="title")
        template(v-for="(line, index) in lines")
          v-list-tile(:key="line._id",v-on:click="showDetail(line, $event)",avatar)
            v-list-tile-avatar
              v-icon.white--text(:class="cardType(line).color") {{ cardType(line).icon }}
            v-list-tile-content
              v-list-tile-title.line-title {{ line.label }}
              v-list-tile-sub-title.line-type {{ trans(cardType(line).label) }}
            v-list-tile-action
              v-dialog(v-model="dialog['remove' + index]" max-width="500px")
                v-btn.item-delete-btn(icon,ripple,slot="activator")
                  v-icon.grey--text.text--lighten-1 delete
                v-card
                  v-card-title
                    .headline {{ trans('items:alert.confirm_remove.title') }}
                  v-card-text {{ trans('items:alert.confirm_remove.message', {title: line.label}) }}
                  v-card-actions
                    v-spacer
                    v-btn.cancel-btn.green--text.darken-1(flat="flat",ripple,v-on:click="dialog['remove' + index] = false") {{ trans('items:alert.confirm_remove.disagree') }}
                    v-btn.delete-btn.green--text.darken-1(flat="flat",ripple,v-on:click="remove(line, index)") {{ trans('items:alert.confirm_remove.agree') }}
          v-divider(:inset="index < lines.length - 1",v-if="index < lines.length - 1 || indexGroup != groupCount - 1")
      v-list-tile(v-if="lines.length == 0")
        v-list-tile-content
          v-list-tile-title.text-xs-center {{ trans('items:list.empty') }}

      v-speed-dial(:bottom="true",:right="true",:fixed="true")
        v-btn#items-add-button.red.darken-2(slot="activator",dark,fab,hover)
          v-icon add
          v-icon close
        v-btn#items-add-card-button.red(fab,dark,small,@click="dialog.card = true")
          v-icon credit_card
        v-btn#items-add-password-button.blue(fab,dark,small,@click="dialog.password = true")
          v-icon fingerprint
        v-btn#items-add-text-button.green(fab,dark,small,@click="dialog.text = true")
          v-icon text_fields

      v-dialog(v-model="dialog.card",fullscreen,transition="dialog-bottom-transition",:overlay="false")
        item-creation(v-if="dialog.card",type="card",@close="dialog.card = false")
      v-dialog(v-model="dialog.password",fullscreen,transition="dialog-bottom-transition",:overlay="false")
        item-creation(v-if="dialog.password",type="password",@close="dialog.password = false")
      v-dialog(v-model="dialog.text",fullscreen,transition="dialog-bottom-transition",:overlay="false")
        item-creation(v-if="dialog.text",type="text",@close="dialog.text = false")
</template>

<script type="text/babel">
import {QLayout, QToolbar, QToolbarTitle, QBtn, QIcon, QList, QListHeader, QItem, QItemSide, QItemMain, QSearch} from 'quasar'
import {SESSION, logout} from '../user/UserService'
import {cardTypeMapping, removeLine, exportLinesAsCsv} from './ItemService'
import getLines from './getLines.gql'
import {filter, groupBy, size, debounce} from 'lodash'
import AnalyticsMixin from '../../utils/piwik'
import ItemCreation from './ItemCreation'

export default {
  name: 'items',
  mixins: [AnalyticsMixin],
  props: ['q'],
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QSearch,
    'item-creation': ItemCreation
  },
  data () {
    return {
      title: this.trans('items:list.title'),
      showOptions: false,
      drawer: true,
      dialog: {
        card: false,
        password: false,
        text: false
      },
      lines: []
    }
  },
  computed: {
    linesByGroup () {
      const searchFilter = !!this.q && new RegExp('^' + this.q)
      const filteredLines = filter(this.lines, line => {
        if (searchFilter) {
          return searchFilter.test(line.label) || searchFilter.test(line.group)
        }
        return true
      })
      return groupBy(filteredLines, line => line.group)
    },
    groupCount () {
      return size(this.linesByGroup)
    }
  },
  methods: {
    handleLogout () {
      logout(this)
    },
    handleExport () {
      exportLinesAsCsv(this)
    },
    search (value) {
      debounce(value => this.$router.push(`/items?q=${value}`), 500)(value)
    },
    remove (line, index) {
      this.dialog['remove' + index] = false
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
  },/*
  beforeRouteEnter (to, from, next) {
    if (!SESSION.authenticated) {
      return next('/login')
    }
    return next()
  },*/
  apollo: {
    lines: {
      query: getLines,
      result ({data}) {
        // Create the dialog element used for reactivity. If not the dialog will not work
        data.lines.forEach((line, index) => {
          this.$set(this.dialog, 'remove' + index, false)
        })
      }
    }
  }
}
</script>
