const labRoutes = [ 
    {
        path: '/lab',
        component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Lab/NavigationLayout'),
        children: [
            {
                path: '/',
                name: 'lab-dashboard',
                meta: {
                    pageHeader: 'Lab Dashboard',
                    drawerButtons: [
                        { text: "Dashboard", disabled: false },
                        { text: "Account", disabled: true },
                        { text: "Services", disabled: true },
                        { text: "Order", disabled: true },
                    ]
                },
                component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Lab')
            },
            {
              path: '/lab/account',
              name: 'lab-dashboard-account',
              meta: {
                pageHeader: 'Account',
                breadcrumbs: [
                  { text: 'Home', href: '/lab' },
                  { text: 'Account', disabled: true }
                ],
                drawerButtons: [
                    { text: "Dashboard", disabled: false },
                    { text: "Account", disabled: false },
                    { text: "Services", disabled: true },
                    { text: "Order", disabled: true },
                ]
              },
              component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Lab/Account')
            },
            {
                path: '/lab/registration',
                name: 'lab-registration',
                meta: {
                    pageHeader: 'Lab Registration',
                    breadcrumbs: [
                        { text: 'Home', href: '/' },
                        { text: 'Lab Registration', disabled: true }
                    ],
                    drawerButtons: [
                        { text: "Dashboard", disabled: false },
                        { text: "Account", disabled: true },
                        { text: "Services", disabled: true },
                        { text: "Order", disabled: true },
                    ]
                },
                component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Lab/Registration')
            },
            {
                path: '/lab/verification',
                name: 'lab-verification',
                meta: {
                    pageHeader: 'Lab Verification',
                    breadcrumbs: [
                        { text: 'Home', href: '/' },
                        { text: 'Lab Registration', disabled: true }
                    ],
                    drawerButtons: [
                        { text: "Dashboard", disabled: false },
                        { text: "Account", disabled: false },
                        { text: "Services", disabled: true },
                        { text: "Order", disabled: true },
                    ]
                },
                component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Lab/Verification')
            },
            {
                path: '/lab/:number',
                name: 'lab-process',
                meta: {
                    pageHeader: 'Process Order',
                    breadcrumbs: [
                        { text: 'Orders', href: '/lab' },
                        { text: 'Process Order', disabled: true },
                    ],
                    drawerButtons: [
                        { text: "Dashboard", disabled: false },
                        { text: "Account", disabled: false },
                        { text: "Services", disabled: false },
                        { text: "Order", disabled: false },
                    ]
                },
                component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Lab/Process')
            },
        ]
    },
]

export default labRoutes