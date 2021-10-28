import store from '../../store'
import globalFunctions from "@/lib/functions"

const labRoutes = [ 
    {
        path: '/lab',
        component: () => import(/* webpackChunkName */ '../../views/Dashboard/Lab/NavigationLayout'),
        beforeEnter: globalFunctions.checkIsLoggedIn,
        children: [
            {
              path: '/',
              name: 'lab-dashboard',
              meta: {
                  pageHeader: 'Lab Dashboard',
              },
              component: () => import(/* webpackChunkName */ '../../views/Dashboard/Lab'),
              beforeEnter: (to, from, next) => {
                // Set drawer buttons here to make it dynamic :)
                if(!store.state.substrate.isServicesExist){
                  to.meta.drawerButtons = [
                    { text: "Dashboard", active: true, disabled: false, route: { name: "lab-dashboard" } },
                    { text: "Account" },
                    { text: "Services" },
                    { text: "Order" },
                    { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
                  ]
                }
                else{
                  to.meta.drawerButtons = [
                    { text: "Dashboard", active: true, disabled: false, route: { name: "lab-dashboard" } },
                    { text: "Account", disabled: false, route: { name: "lab-dashboard-account" } },
                    { text: "Services", disabled: false, route: { name: "lab-dashboard-services" } },
                    { text: "Order", disabled: false, route: { name: "lab-dashboard-order-history" } },
                    { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
                  ]
                }
                next()
              }
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
                  { text: "Services", disabled: false, route: { name: "lab-dashboard-services" } },
                  { text: "Order", disabled: false, route: { name: "lab-dashboard-order-history" } },
                  { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
                ]
              },
              component: () => import(/* webpackChunkName */ '../../views/Dashboard/Lab/Account'),
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
                      { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
                    ]
                },
                component: () => import(/* webpackChunkName */ '../../views/Dashboard/Lab/Registration'),
                beforeEnter: (to, from, next) => {
                  if(store.state.substrate.isLabAccountExist) next('/lab/registration/services')
                  else if(store.state.substrate.isServicesExist) next('/lab')
                  else next()
                }
            },
            {
                path: '/lab/registration/services',
                name: 'lab-registration-services',
                meta: {
                    pageHeader: 'Lab Verification Services',
                    breadcrumbs: [
                        { text: 'Lab', href: '/lab' },
                        { text: 'Registration', disabled: true }
                    ],
                    drawerButtons: [
                      { text: "Dashboard", active: true, disabled: false, route: { name: "lab-dashboard" } },
                      { text: "Account" },
                      { text: "Services" },
                      { text: "Order" },
                      { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
                    ]
                },
                component: () => import(/* webpackChunkName */ '../../views/Dashboard/Lab/Registration/Services'),
                beforeEnter: (to, from, next) => {
                  if(!store.state.substrate.isLabAccountExist) next('/lab/registration')
                  else if(store.state.substrate.isServicesExist) next('/lab')
                  else next()
                }
            },
            // {
            //     path: '/lab/registration/verification',
            //     name: 'lab-registration-verification',
            //     meta: {
            //         pageHeader: 'Lab Verification',
            //         breadcrumbs: [
            //             { text: 'Lab', href: '/lab' },
            //             { text: 'Registration', disabled: true }
            //         ],
            //         drawerButtons: [
            //           { text: "Dashboard", disabled: false, route: { name: "lab-dashboard" } },
            //           { text: "Account", disabled: false, route: { name: "lab-dashboard-account" } },
            //           { text: "Services", active: true, disabled: false, route: { name: "lab-dashboard-services" } },
            //           { text: "Order", disabled: false, route: { name: "lab-dashboard-order-history" } },
            //           { text: "Dashboard", active: true, disabled: false, route: { name: "lab-dashboard" } },
            //           { text: "Account" },
            //           { text: "Services" },
            //           { text: "Order" },
            //         ]
            //     },
            //     component: () => import(/* webpackChunkName */ '../../views/Dashboard/Lab/Registration/Verification')
            // },
            {
              path: '/lab/services',
              name: 'lab-dashboard-services',
              meta: {
                pageHeader: 'Services',
                breadcrumbs: [
                  { text: 'Lab', href: '/lab' },
                  { text: 'Services', disabled: true }
                ],
                drawerButtons: [
                    { text: "Dashboard", disabled: false, route: { name: "lab-dashboard" } },
                    { text: "Account", disabled: false, route: { name: "lab-dashboard-account" } },
                    { text: "Services", active: true, disabled: false, route: { name: "lab-dashboard-services" } },
                    { text: "Order", disabled: false, route: { name: "lab-dashboard-order-history" } },
                    { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
                ]
              },
              component: () => import(/* webpackChunkName */ '../../views/Dashboard/Lab/Services')
            },
            {
              path: '/lab/services/add',
              name: 'lab-dashboard-add-services',
              meta: {
                pageHeader: 'Add Services',
                breadcrumbs: [
                  { text: 'Lab', href: '/lab' },
                  { text: 'Services', href: '/lab/services' },
                  { text: 'Add Services', disabled: true }
                ],
                drawerButtons: [
                    { text: "Dashboard", disabled: false, route: { name: "lab-dashboard" } },
                    { text: "Account", disabled: false, route: { name: "lab-dashboard-account" } },
                    { text: "Services", active: true, disabled: false, route: { name: "lab-dashboard-services" } },
                    { text: "Order", disabled: false, route: { name: "lab-dashboard-order-history" } },
                    { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
                ]
              },
              component: () => import(/* webpackChunkName */ '../../views/Dashboard/Lab/Services/Add')
            },
            {
              path: '/lab/services/detail',
              name: 'lab-dashboard-services-detail',
              meta: {
                pageHeader: 'Services Detail',
                breadcrumbs: [
                  { text: 'Lab', href: '/lab' },
                  { text: 'Services', href: '/lab/services' },
                  { text: 'Services Detail', disabled: true }
                ],
                drawerButtons: [
                    { text: "Dashboard", disabled: false, route: { name: "lab-dashboard" } },
                    { text: "Account", disabled: false, route: { name: "lab-dashboard-account" } },
                    { text: "Services", active: true, disabled: false, route: { name: "lab-dashboard-services" } },
                    { text: "Order", disabled: false, route: { name: "lab-dashboard-order-history" } },
                    { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
                ]
              },
              component: () => import(/* webpackChunkName */ '../../views/Dashboard/Lab/Services/Detail')
            },
            {
              path: '/lab/orders',
              name: 'lab-dashboard-order-history',
              meta: {
                pageHeader: 'Payment History',
                breadcrumbs: [
                  { text: 'Lab', href: '/lab' },
                  { text: 'Orders', disabled: true }
                ],
                drawerButtons: [
                    { text: "Dashboard", disabled: false, route: { name: "lab-dashboard" } },
                    { text: "Account", disabled: false, route: { name: "lab-dashboard-account" } },
                    { text: "Services", disabled: false, route: { name: "lab-dashboard-services" } },
                    { text: "Order", active: true, disabled: false, route: { name: "lab-dashboard-order-history" } },
                    { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
                ]
              },
              component: () => import(/* webpackChunkName */ '../../views/Dashboard/Lab/OrderHistory')
            },
            {
              path: '/lab/orders/:order_id/process',
              name: 'lab-dashboard-process-order',
              meta: {
                pageHeader: 'Process Order',
                breadcrumbs: [
                  { text: 'Lab', href: '/lab' },
                  { text: 'Orders', href: '/lab/orders' },
                  { text: 'Process Order', disabled: true }
                ],
                drawerButtons: [
                    { text: "Dashboard", disabled: false, route: { name: "lab-dashboard" } },
                    { text: "Account", disabled: false, route: { name: "lab-dashboard-account" } },
                    { text: "Services", disabled: false, route: { name: "lab-dashboard-services" } },
                    { text: "Order", active: true, disabled: false, route: { name: "lab-dashboard-order-history" } },
                    { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
                ]
              },
              component: () => import(/* webpackChunkName */ '../../views/Dashboard/Lab/OrderHistory/ProcessOrder')
            },
        ]
    },
]

export default labRoutes
