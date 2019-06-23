<template>
  <v-list id="items-list">
    <template v-for="(lines, title, indexGroup) in linesByGroup">
      <v-subheader class="group-title" v-text="title" :key="`group-${indexGroup}`"></v-subheader>
      <template v-for="(line, index) in lines">
        <v-list-tile :key="`item-${indexGroup}-${line._id}`" @click="selectLine(line)" avatar="avatar">
          <v-list-tile-action class="avatar">
            <v-icon class="white--text" v-if="!line.logo" :class="line.typeColor">{{ line.typeIcon }}</v-icon>
            <img v-else :src="'data:text/plain;base64,' + line.logo"/>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="line-title">{{ line.label }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider :key="`divider-${indexGroup}-${index}`" :inset="index < lines.length - 1" v-if="index < lines.length - 1 || indexGroup != groupCount - 1"></v-divider>
      </template>
    </template>
    <v-list-tile v-if="!hasError && !isLoading && lines.length == 0">
      <v-list-tile-content>
        <v-list-tile-title class="text-xs-center">{{ $t('list.empty') }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile v-if="isLoading && lines.length == 0">
      <v-list-tile-content>
        <v-list-tile-title class="text-xs-center">
          <v-progress-circular :indeterminate="true" color="primary"></v-progress-circular>
        </v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile v-if="hasError && lines.length == 0">
      <v-list-tile-content></v-list-tile-content>
      <v-list-tile-title class="text-xs-center">{{ $t('list.offline') }}</v-list-tile-title>
    </v-list-tile>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator';
import { debounce } from '@/utils/lodash';
import { TranslateResult } from 'vue-i18n';
import { groupLineByGroup, filterLines, IItemListLine } from '@/components/items/VItemListService';

@Component({
  name: 'v-item-list',
})
export default class VItemList extends Vue {
  @Prop()
  search?: string;
  @Prop({
    type: Array,
    required: true,
  })
  lines!: Array<IItemListLine>;
  @Prop({
    default: false,
  })
  hasError!: boolean;
  @Prop({
    default: true,
  })
  isLoading!: boolean;

  get linesByGroup() {
    return groupLineByGroup(filterLines(this.lines, this.search));
  }

  get groupCount() {
    return Object.keys(this.linesByGroup || {}).length;
  }

  selectLine(line: IItemListLine) {
    this.$emit('selectLine', line);
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
