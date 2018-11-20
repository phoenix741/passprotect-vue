import Vue from 'vue'
import veeValidate from './plugins/vee-validate'
import './plugins/vuetify'
import App from './App.vue'
import store from './store/index'
import router from './router'
import { createProvider } from './plugins/vue-apollo'
import i18n from './plugins/i18n'
import VueCordova from 'vue-cordova'
import './registerServiceWorker'

(async function () {
  await veeValidate()
  if (process.env.CORDOVA_PLATFORM) {
    Vue.use(VueCordova)
  }

  Vue.config.productionTip = false

  if (process.env.CORDOVA_PLATFORM) {
    Vue.cordova.on('deviceready', () => {
      navigator.splashscreen && navigator.splashscreen.hide()
    })
  }

  new Vue({
    apolloProvider: createProvider(),
    router,
    i18n,
    store,
    render: h => h(App)
  }).$mount('#app')
})()
