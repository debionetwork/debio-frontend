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
                        { text: "Dashboard", active: true, disabled: false, route: { name: "lab-dashboard" } },
                        { text: "Account" },
                        { text: "Services" },
                        { text: "Order" },
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
                  { text: 'Lab', href: '/lab' },
                  { text: 'Account', disabled: true }
                ],
                drawerButtons: [
                    { text: "Dashboard", disabled: false, route: { name: "lab-dashboard" } },
                    { text: "Account", active: true, disabled: false, route: { name: "lab-dashboard-account" } },
                    { text: "Services" },
                    { text: "Order" },
                ]
              },
              component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Lab/Account')
            },
            {
              path: '/lab/account/verification',
              name: 'lab-dashboard-account-verification',
              meta: {
                pageHeader: 'Lab Verification',
                breadcrumbs: [
                  { text: 'Lab', href: '/lab' },
                  { text: 'Account', href: '/lab/account' },
                  { text: 'Verification', disabled: true }
                ],
                drawerButtons: [
                    { text: "Dashboard", disabled: false, route: { name: "lab-dashboard" } },
                    { text: "Account", active: true, disabled: false, route: { name: "lab-dashboard-account" } },
                    { text: "Services" },
                    { text: "Order" },
                ]
              },
              component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Lab/Account/Verification')
            },
            {
                path: '/lab/registration',
                name: 'lab-registration',
                meta: {
                    pageHeader: 'Lab Registration',
                    breadcrumbs: [
                        { text: 'Lab', href: '/lab' },
                        { text: 'Registration', disabled: true }
                    ],
                    drawerButtons: [
                        { text: "Dashboard", active: true, disabled: false, route: { name: "lab-dashboard" } },
                        { text: "Account" },
                        { text: "Services" },
                        { text: "Order" },
                    ]
                },
                component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Lab/Registration')
            },
            {
                path: '/lab/registration/verification',
                name: 'lab-registration-verification',
                meta: {
                    pageHeader: 'Lab Verification',
                    breadcrumbs: [
                        { text: 'Lab', href: '/lab' },
                        { text: 'Registration', disabled: true }
                    ],
                    drawerButtons: [
                        { text: "Dashboard", active: true, disabled: false, route: { name: "lab-dashboard" } },
                        { text: "Account" },
                        { text: "Services" },
                        { text: "Order" },
                    ]
                },
                component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Lab/Registration/Verification')
            },
            {
                path: '/lab/:number',
                name: 'lab-process',
                meta: {
                    pageHeader: 'Process Order',
                    breadcrumbs: [
                        { text: 'Lab', href: '/lab' },
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