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
      ]
    },
]

export default labDashboardRoutes