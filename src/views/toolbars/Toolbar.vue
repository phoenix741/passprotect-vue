<template>  
  <v-toolbar color="primary" dark="dark" app="app">
    <v-btn v-if="!toolbar.searchEnabled" icon="icon" @click="$router.go(-1)">
      <v-icon>arrow_back</v-icon>
    </v-btn>
    <v-toolbar-title class="ml-0 pl-3" id="title-label">{{ toolbar.title }}</v-toolbar-title>
    <v-text-field class="mx-3 search-input" v-if="toolbar.searchEnabled" flat="flat" solo-inverted="solo-inverted" prepend-inner-icon="search" :label="$t('list.search')" @input="search" slot="extension"></v-text-field>
    <template v-if="toolbar.menu.length || toolbar.actions.length">
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="toolbar.actions.length">
        <template v-for="(item, index) in toolbar.actions">
          <v-btn dark="dark" flat="flat" :key="index" @click="click(item.id)" :router="!!item.router" :to="item.router">{{ item.title }}</v-btn>
        </template>
      </v-toolbar-items>
      <v-menu v-if="toolbar.menu.length" offset-y="offset-y" bottom="bottom" left="left">
        <v-btn icon="icon" color="primary" slot="activator" dark="dark">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <template v-for="(item, index) in toolbar.menu">
            <v-list-tile v-if="item.title" :key="index" @click="click(item.id)" :router="!!item.router" :to="item.router">
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
            <v-divider v-else="v-else" :key="index"></v-divider>
          </template>
        </v-list>
      </v-menu>
    </template>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag';
import { SmartQuery } from 'vue-apollo-decorator';
import { Prop, Component } from 'vue-property-decorator';
import { debounce } from '@/utils/lodash';
import { Toolbar as GraphQLToolbar } from '@/generated/graphql';
import { toolbarEventBus } from '@/store/modules';
import toolbarQuery from '@/services/graphql/toolbar/toolbar.graphql';

@Component({
  name: 'toolbar',
})
export default class Toolbar extends Vue {
  @SmartQuery(toolbarQuery)
  toolbar!: GraphQLToolbar;

  search(value: string) {
    debounce((value: string) => this.$router.replace(`/items?q=${value}`), 500)(value);
  }

  click(id: string) {
    toolbarEventBus.$emit('toolbar-clicked:' + id);
  }
}
</script>
