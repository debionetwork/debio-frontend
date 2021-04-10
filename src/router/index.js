import Vue from 'vue'
import VueRouter from 'vue-router'
import indexRoutes from './routes'
import authRoutes from './routes/auth'
import labRoutes from './routes/lab'
import labDashboardRoutes from './routes/lab/dashboard'

Vue.use(VueRouter)

const routes = [
  ...indexRoutes,
  ...labRoutes,
  ...labDashboardRoutes,
  ...authRoutes
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
// async function getUserRole() {
//   try {
//     let role = store.getters['auth/getRole']
//     // If role is already set return it
//     if (role) {
//       return role
//     }
//     // else fetch it
//     await store.dispatch('auth/getRole');
//     role = store.getters['auth/getRole']

//     return role

//   } catch (err) {
//     console.log(err)
//     throw new Error('Error at get user role -> ', err)
//   }
// }

router.beforeEach(async (to, from, next) => {
  // If this is removed, it will cause infinite loop
  if (to.path == '/login') {
    next()
    return
  }
  if (to.path == '/register') {
    next()
    return
  }

  // If there's an error when getting user role, go back to login
  // let role = null
  // try {
  //   role = await getUserRole()
  // } catch (err) {
  //   store.dispatch('auth/clearAuth')
  //   next('/login')
  //   return
  // }

  // // Role Lab
  // if (role == 'lab') {
  //   if (!to.path.startsWith('/lab') && !to.meta.public) {
  //     next('/lab')
  //     return
  //   }
  // }

  // // Customer
  // if (role == 'customer') {
  //   if (to.path.startsWith('/lab')) {
  //     next('/')
  //     return
  //   }
  // }

  next()
})

export default router

