const indexRoutes = [{
    path: '/',
    name: 'selectrole',
      meta: {
        pageHeader: 'SelectRoleGroup',
      },
    component: () => import(/* webpackChunkName */ '../../views/SelectRole'),
  },
]
  
export default indexRoutes