/* global __IS_CORDOVA__ */

'use strict'

import 'babel-polyfill'

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import promisify from 'es6-promisify'

import {init as i18nInit} from 'i18next'
import resBundle from '../common/locales'
import veeDictionaryFr from 'vee-validate/dist/locale/fr'
import VeeValidate, { Validator } from 'vee-validate'

import VueApollo from 'vue-apollo'
import {apolloProvider} from './utils/graphql'
import {checkAuth} from './components/user/UserService'

import Quasar from 'quasar'
import 'quasar-extras/material-icons'
import VueCordova from 'vue-cordova'

(async function () {
  Validator.localize('fr', veeDictionaryFr)

  Vue.config.productionTip = false

  Vue.use(Quasar)
  Vue.use(VueApollo)
  Vue.use(VeeValidate, {locale: 'fr'})
  if (__IS_CORDOVA__) {
    Vue.use(VueCordova)
    Vue.cordova.on('deviceready', () => {
      navigator.splashscreen.hide()
    })
  }

  const i18nOptions = {
    resources: resBundle,
    lng: 'fr-FR',
    joinArrays: '+'
  }

  const trans = await promisify(i18nInit)(i18nOptions)

  window.trans = trans
  Vue.prototype.trans = trans

  checkAuth()

  Quasar.start(() => {
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,
      apolloProvider,
      template: '<App/>',
      components: { App }
    })
  })
})()
