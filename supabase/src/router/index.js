import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { userSessionStore } from '../stores/userSession'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        needsAuth: true
      }
    },
    {
      path: '/account/:userId',
      component: () => import('../views/HomeView.vue'),
      name: 'Account',
      meta: {
        needsAuth: true
      }
    },
    {
      path: '/build/:build',
      name: 'build',
      component: () => import('../views/SavedBuilds.vue')
    },
    {
      path: '/:userId/new',
      name: 'new',
      component: () => import('../views/SavedBuilds.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userSession = userSessionStore()

  if (to.meta.needsAuth) {
    if (userSession.session) {
      return next()
    } else {
      return next('/login')
    }
  }

  return next()
})

export default router
