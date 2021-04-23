const labDashboardRoutes = [
    {
      path: '/lab/dashboard',
      component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Lab/NavigationLayout'),
      children:[
        {
          path: '/',
          name: 'lab-dashboard',
          meta: {
            pageHeader: 'Home',
          },
        },
        {
          path: '/lab/dashboard/account',
          name: 'lab-dashboard-account',
          meta: {
            pageHeader: 'Account',
            breadcrumbs: [
              { text: 'Home', href: '/lab/dashboard' },
              { text: 'Account', disabled: true }
            ]
          },
          component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Lab/Account')
        },
      ]
    },
]

export default labDashboardRoutes