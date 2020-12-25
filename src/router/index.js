import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

// eslint-disable-next-line no-unused-vars
async function checkAuth(to, from, next) {
  const isLoggedIn = store.getters['auth/isLoggedIn'] 
  if (!isLoggedIn) {
    // If has token
    if (store.getters['auth/hasToken']) {
      // Get user data
      await store.dispatch('auth/getUserData')
      // If getUserData success isLoggedIn will be set to true
      if (store.getters['auth/isLoggedIn']) {
        // token is valid, continue
        next(to)
        return
      } else {
        next('/login')
        return
      }
    }
    // No token, go to login
    next('/login')
    return
  }
  // is logged in, continue
  next()
}

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName */ '../views/Dashboard'),
    // beforeEnter: checkAuth,
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName */ '../views/Dashboard/Home')
      },
      {
        path: '/lab',
        name: 'lab',
        component: () => import(/* webpackChunkName */ '../views/Dashboard/Lab')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "" */ '../views/Login')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})

export default router

