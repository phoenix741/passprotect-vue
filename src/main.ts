import Vue from 'vue';
import veeValidate from './plugins/vee-validate';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import i18n from './plugins/i18n';
import apolloProvider from './plugins/vue-apollo';

(async function() {
  await veeValidate();

  Vue.config.productionTip = false;

  new Vue({
    router,
    i18n,
    apolloProvider,
    render: h => h(App),
  }).$mount('#app');
})().catch(err => console.log(err));
