import Vue from 'vue'
import {
  Vuetify,
  VApp,
  VBtn,
  VCard,
  VDialog,
  VDivider,
  VGrid,
  VIcon,
  VList,
  VMenu,
  VProgressLinear,
  VSelect,
  VSpeedDial,
  VSubheader,
  VTextarea,
  VTextField,
  VToolbar,
  transitions
} from 'vuetify'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  components: {
    VApp,
    VBtn,
    VCard,
    VDialog,
    VDivider,
    VGrid,
    VIcon,
    VList,
    VMenu,
    VProgressLinear,
    VSelect,
    VSpeedDial,
    VSubheader,
    VTextarea,
    VTextField,
    VToolbar,
    transitions
  },
  iconfont: 'md'
})
