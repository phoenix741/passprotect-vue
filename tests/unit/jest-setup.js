import Vue from 'vue'
import VeeValidate from 'vee-validate'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'

Vue.use(VeeValidate)
Vue.use(VueRouter)
Vue.use(Vuetify)

Vue.config.productionTip = false
Vue.prototype.$t = text => text

process.env.VUE_APP_PIWIK_ENABLED = false

// Create the v-app necessary to vuetify
const app = document.createElement('div')
app.setAttribute('data-app', true)
document.body.appendChild(app)
