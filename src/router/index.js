import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
import localStorage from '../lib/local-storage'

Vue.use(VueRouter)

function hasKeystore() {
  const keystore = localStorage.getKeystore()
  return !!keystore
}

// eslint-disable-next-line no-unused-vars
function checkIsLoggedIn(to, from, next) {
  const isLoggedIn = hasKeystore()
  if (!isLoggedIn && to.path != '/login') {
    next('/login')
    return
  }
  // FIXME: This line is causing error when role == lab
  //   because going to / will redirect to /lab
  //   double redirect is considered an error by vue router
  // if logged in and going to login route, redirect to root
  if (isLoggedIn && to.path == '/login') {
    next('/')
    return
  }
  // is logged in, continue
  next()
}

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName */ '../views/Dashboard'),
    beforeEnter: checkIsLoggedIn,
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName */ '../views/Dashboard/Home')
      },
      {
        path: '/history-test',
        name: 'history-test',
        component: () => import(/* webpackChunkName */ '../views/Dashboard/TestHistory')
      },
      {
        path: '/result-test/:number',
        name: 'result-test',
        component: () => import(/* webpackChunkName */ '../views/Dashboard/TestHistory/result.vue')
      },
      {
        path: '/request-test',
        name: 'request-test',
        component: () => import(/* webpackChunkName */ '../views/Dashboard/RequestTest')
      },
      {
        path: '/request-test/checkout',
        name: 'request-test-checkout',
        component: () => import(/* webpackChunkName */ '../views/Dashboard/RequestTestCheckout')
      },
      {
        path: '/request-test/receipt',
        name: 'request-test-receipt',
        component: () => import(/* webpackChunkName */ '../views/Dashboard/RequestTestReceipt')
      },
      {
        path: '/lab',
        name: 'lab',
        component: () => import(/* webpackChunkName */ '../views/Dashboard/Lab')
      },
      {
        path: '/lab/:number',
        name: 'lab-result',
        component: () => import(/* webpackChunkName */ '../views/Dashboard/Lab/result.vue')
      }

    ]
  },
  {
    path: '/requestTest',
    name: 'requestTest',
    component: () => import(/* webpackChunkName */ '../views/RequestTest')
  },
  {
    path: '/login',
    name: 'login',
    meta: { public: true },
    beforeEnter: checkIsLoggedIn,
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



/**
 * getUserRole()
 *
 * Get user role from account smart contract
 * */
async function getUserRole() {
  try {
    let role = store.getters['auth/getRole']
    // If role is already set return it
    if (role) {
      return role
    }
    // else fetch it
    await store.dispatch('auth/getRole');
    role = store.getters['auth/getRole']

    return role

  } catch (err) {
    console.log(err)
    throw new Error('Error at get user role -> ', err)
  }
}

router.beforeEach(async (to, from, next) => {
  // If this is removed, it will cause infinite loop
  if (to.path == '/login') {
    next()
    return
  }
  
  // If there's an error when getting user role, go back to login
  let role = null
  try {
    role = await getUserRole()
  } catch (err) {
    store.dispatch('auth/clearAuth')
    next('/login')
    return
  }

  // Role Lab
  if (role == 'lab') {
    if (!to.path.startsWith('/lab') && !to.meta.public) {
      next('/lab')
      return
    }
  }

  // Customer
  if (role == 'customer') {
    if (to.path.startsWith('/lab')) {
      next('/')
      return
    }
  }

  next()
})

export default router

