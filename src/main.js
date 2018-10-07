import '@babel/polyfill'
import Vue from 'vue'
import veeValidate from './plugins/vee-validate'
import './plugins/vuetify'
import router from './router'
import './registerServiceWorker'
import { createProvider } from './plugins/vue-apollo'
import App from './App.vue'
import i18n from './plugins/i18n'

(async function () {
  await veeValidate()

  Vue.config.productionTip = false

  new Vue({
    apolloProvider: createProvider(),
    router,
    i18n,
    render: h => h(App)
  }).$mount('#app')
})()
