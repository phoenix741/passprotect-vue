import Vue from 'vue'
import Router from 'vue-router'

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
      component: () => import(/* webpackChunkName: "about" */ './pages/About.vue')
    },
    {
      name: 'terms',
      path: '/terms',
      component: () => import(/* webpackChunkName: "terms" */ './pages/Terms.vue')
    },
    {
      name: 'items',
      path: '/items',
      component: () => import(/* webpackChunkName: "items" */ './components/items/Items.vue'),
      props: route => ({ q: route.query.q })
    },
    {
      name: 'view',
      path: '/items/:id',
      component: () => import(/* webpackChunkName: "items" */ './components/items/ItemVisualisation.vue'),
      props: true
    },
    {
      name: 'edit',
      path: '/items/:id/edit',
      component: () => import(/* webpackChunkName: "edit" */ './components/items/ItemModification.vue'),
      props: true
    },
    {
      name: 'new',
      path: '/items/:type/new',
      component: () => import(/* webpackChunkName: "new" */ './components/items/ItemCreation.vue'),
      props: true
    },
    {
      name: 'login',
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ './components/user/Login.vue')
    },
    {
      name: 'register',
      path: '/register',
      component: () => import(/* webpackChunkName: "register" */ './components/user/Register.vue')
    },
    {
      path: '*',
      redirect: '/items'
    }
  ]
})
