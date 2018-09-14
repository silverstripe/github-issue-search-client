import Vue from 'vue'
import App from './App.vue'
import { apolloProvider } from './vue-apollo'

Vue.config.productionTip = false

new Vue({
  provide: apolloProvider.provide(),
  render: h => h(App),
  data: {
    // TODO Figure out how to pass this through to the <App>
    // repoGroups: process.env.VUE_APP_REPO_GROUPS
  }
}).$mount('#app')
