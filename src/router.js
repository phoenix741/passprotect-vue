import Vue from 'vue'
import Router from 'vue-router'

import Items from './components/items/Items.vue'
import ItemModification from './components/items/ItemModification.vue'
import ItemVisualisation from './components/items/ItemVisualisation.vue'
import Login from './components/user/Login.vue'
import About from './pages/About.vue'
import Terms from './pages/Terms.vue'
import Register from './components/user/Register.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      name: 'about',
      path: '/about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ './pages/About.vue')
      component: About
    },
    {
      name: 'terms',
      path: '/terms',
      component: Terms
    },
    {
      name: 'items',
      path: '/items',
      component: Items,
      props: route => ({ q: route.query.q })
    },
    {
      name: 'edit',
      path: '/items/:id/edit',
      component: ItemModification,
      props: true
    },
    {
      name: 'view',
      path: '/items/:id',
      component: ItemVisualisation,
      props: true
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'register',
      path: '/register',
      component: Register
    },
    {
      path: '*',
      redirect: '/items'
    }
  ]
})
