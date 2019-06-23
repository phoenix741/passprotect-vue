import Vue from 'vue';
import Router, { Route } from 'vue-router';
import Toolbar from './views/toolbars/Toolbar.vue';
import { getLocalSession } from './services/SessionService';

Vue.use(Router);

const router = new Router({
  mode: process.env.CORDOVA_PLATFORM ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      name: 'onboarding',
      path: '/onboarding/:pageIndex',
      component: () => import('./views/onboarding/OnBoarding.vue'),
      props: route => ({ pageIndex: parseInt(route.params.pageIndex, 10) }),
      meta: {
        requiresAuth: false,
      },
    },
    {
      name: 'lock',
      path: '/lock',
      component: () => import('./views/onboarding/Lock.vue'),
      props: route => ({ redirect: route.query.redirect }),
      meta: {
        requiresAuth: false,
      },
    },
    {
      name: 'unlock',
      path: '/unlock',
      component: () => import('./views/onboarding/Unlock.vue'),
      props: route => ({ redirect: route.query.redirect }),
      meta: {
        requiresAuth: false,
      },
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('./views/users/Login.vue'),
      props: route => ({ redirect: route.query.redirect }),
      meta: {
        requiresAuth: false,
      },
    },
    {
      name: 'register',
      path: '/register',
      component: () => import('./views/users/Register.vue'),
      props: route => ({ redirect: route.query.redirect }),
      meta: {
        requiresAuth: false,
      },
    },
    {
      name: 'about',
      path: '/about',
      components: {
        default: () => import('./views/About.vue'),
        toolbar: Toolbar,
      },
      meta: {
        requiresAuth: false,
      },
    },
    {
      name: 'terms',
      path: '/terms',
      components: {
        default: () => import('./views/Terms.vue'),
        toolbar: Toolbar,
      },
      meta: {
        requiresAuth: false,
      },
    },
    {
      name: 'items',
      path: '/items',
      components: {
        default: () => import('./views/items/Items.vue'),
        toolbar: Toolbar,
      },
      props: {
        default: (route: Route) => ({ q: route.query.q }),
      },
      meta: {
        requiresAuth: true,
      },
    },
    {
      name: 'view',
      path: '/items/:id',
      components: {
        default: () => import('./views/items/ItemVisualisation.vue'),
        toolbar: Toolbar,
      },
      props: { default: true },
      meta: {
        requiresAuth: true,
      },
    },
    {
      name: 'edit',
      path: '/items/:id/edit',
      components: {
        default: () => import('./views/items/ItemModification.vue'),
        toolbar: Toolbar,
      },
      props: { default: true },
      meta: {
        requiresAuth: true,
      },
    },
    {
      name: 'new',
      path: '/items/:type/new',
      components: {
        default: () => import('./views/items/ItemCreation.vue'),
        toolbar: Toolbar,
      },
      props: { default: true },
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '*',
      redirect: '/items',
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  // If the route need authentification, ...
  if (to.meta.requiresAuth) {
    // ... and the user is never authenticate
    const { localState, username } = await getLocalSession();
    if (localState && !username) {
      return next({
        path: '/unlock',
        replace: true,
        query: { redirect: to.fullPath },
      });
    } else if (!username) {
      return next({
        path: '/login',
        replace: true,
        query: { redirect: to.fullPath },
      });
    }
  }

  return next();
});

export default router;
