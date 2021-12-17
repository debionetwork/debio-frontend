import globalFunctions from "@/lib/functions";

const authRoutes = [
  {
    path: '/login',
    name: 'login',
    beforeEnter: globalFunctions.checkIsLoggedIn,
    meta: { public: true },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName */ '@/views/Login')
  },
]

export default authRoutes