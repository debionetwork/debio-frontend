import globalFunctions from "@/lib/functions";

const indexRoutes = [{
    path: '/',
    name: 'selectrole',
    beforeEnter: globalFunctions.checkIsLoggedIn,
      meta: {
        pageHeader: 'SelectRoleGroup',
      },
    component: () => import(/* webpackChunkName */ '@/views/SelectRole'),
  },
]
  
export default indexRoutes