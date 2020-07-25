import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from './features/index.vue'
Vue.config.productionTip = false

Vue.use(VueRouter);
const routes = [
  { path: '/', component: Index, props: true },
];
const router = new VueRouter({
  routes // short for `routes: routes`
});
new Vue({
  render: h => h(Index),
  router,
}).$mount('#app')
