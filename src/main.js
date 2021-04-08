import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import VueTheMask from 'vue-the-mask'
import VueCurrencyInput from 'vue-currency-input'
import BaseButton from './components/BaseButton.vue'
import DrawerNavigation from './components/DrawerNavigation.vue'
import ToolbarAction from './components/ToolbarAction.vue'
import BaseLoading from './components/BaseLoading.vue'
import Top from './components/tables/Top.vue'
import Footer from './components/tables/Footer.vue'
import Vuelidate from 'vuelidate'
import './global.css'

Vue.use(Vuelidate)

import { store } from './store'
const pluginOptions = {
  globalOptions: { currency: 'BRL' }
}

Vue.component('base-btn', BaseButton)
Vue.component('drawer-navigation', DrawerNavigation)
Vue.component('toolbar-menu', ToolbarAction)
Vue.component('circle-loading', BaseLoading)
Vue.component('top-table', Top)
Vue.component('footer-table', Footer)


Vue.use(VueCurrencyInput, pluginOptions)

Vue.config.productionTip = false

Vue.use(VueTheMask)

new Vue({
  store,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
