import store from '../../store'
import globalFunctions from "@/lib/functions"

const hospitalRoutes = [ 
    {
        path: '/hospital',
        component: () => import(/* webpackChunkName */ '@/views/Dashboard/Hospital/NavigationLayout'),
        beforeEnter: globalFunctions.checkIsLoggedIn,
        children: [
            {
              path: '/',
              name: 'hospital-dashboard',
              meta: {
                pageHeader: 'Hospital Dashboard',
              },
              component: () => import(/* webpackChunkName */ '@/views/Dashboard/Hospital'),
              beforeEnter: (to, from, next) => {
                if(!store.state.substrate.isHospitalAccountExist){
                  to.meta.drawerButtons = [
                    { text: "Dashboard", active: true, disabled: false, route: { name: "hospital-dashboard" } },
                    { text: "Account" },
                    { text: "Customer Care", href: "https://docs.debio.network/" },
                  ]
                }
                else{
                  to.meta.drawerButtons = [
                    { text: "Dashboard", active: true, disabled: false, route: { name: "hospital-dashboard" } },
                    { text: "Account", disabled: false, route: { name: "hospital-dashboard-account" } },
                    { text: "Customer Care", href: "https://docs.debio.network/" },
                  ]
                }
                next()
              }
            },
            {
              path: '/hospital/account',
              name: 'hospital-dashboard-account',
              meta: {
                pageHeader: 'Account',
                breadcrumbs: [
                  { text: 'Hospital', href: '/hospital' },
                  { text: 'Account', disabled: true }
                ],
                drawerButtons: [
                  { text: "Dashboard", disabled: false, route: { name: "hospital-dashboard" } },
                  { text: "Account", active: true, disabled: false, route: { name: "hospital-dashboard-account" } },
                  { text: "Customer Care", href: "https://docs.debio.network/" },
                ]
              },
              component: () => import(/* webpackChunkName */ '@/views/Dashboard/Hospital/Account'),
            },
            // {
            //   path: '/hospital/account/verification',
            //   name: 'hospital-dashboard-account-verification',
            //   meta: {
            //     pageHeader: 'Hospital Verification',
            //     breadcrumbs: [
            //       { text: 'Hospital', href: '/hospital' },
            //       { text: 'Account', href: '/hospital/account' },
            //       { text: 'Verification', disabled: true }
            //     ],
            //     drawerButtons: [
            //       { text: "Dashboard", disabled: false, route: { name: "hospital-dashboard" } },
            //       { text: "Account", disabled: false, route: { name: "hospital-dashboard-account" } },
            //       { text: "Services", active: true, disabled: false, route: { name: "hospital-dashboard-services" } },
            //       { text: "Order", disabled: false, route: { name: "hospital-dashboard-order-history" } },
            //     ]
            //   },
            //   component: () => import(/* webpackChunkName */ '@/views/Dashboard/Hospital/Account/Verification')
            // },
            {
                path: '/hospital/registration',
                name: 'hospital-registration',
                meta: {
                    pageHeader: 'Hospital Registration',
                    breadcrumbs: [
                        { text: 'Hospital', href: '/hospital' },
                        { text: 'Registration', disabled: true }
                    ],
                    drawerButtons: [
                      { text: "Dashboard", active: true, disabled: false, route: { name: "hospital-dashboard" } },
                      { text: "Account" },
                      { text: "Customer Care", href: "https://docs.debio.network/" },
                    ]
                },
                component: () => import(/* webpackChunkName */ '@/views/Dashboard/Hospital/Registration'),
                beforeEnter: (to, from, next) => {
                  if(store.state.substrate.isHospitalAccountExist) next('/hospital')
                  else next()
                }
            },
            // {
            //     path: '/hospital/registration/verification',
            //     name: 'hospital-registration-verification',
            //     meta: {
            //         pageHeader: 'Hospital Verification',
            //         breadcrumbs: [
            //             { text: 'Hospital', href: '/hospital' },
            //             { text: 'Registration', disabled: true }
            //         ],
            //         drawerButtons: [
            //           { text: "Dashboard", disabled: false, route: { name: "hospital-dashboard" } },
            //           { text: "Account", disabled: false, route: { name: "hospital-dashboard-account" } },
            //           { text: "Services", active: true, disabled: false, route: { name: "hospital-dashboard-services" } },
            //           { text: "Order", disabled: false, route: { name: "hospital-dashboard-order-history" } },
            //           { text: "Dashboard", active: true, disabled: false, route: { name: "hospital-dashboard" } },
            //           { text: "Account" },
            //           { text: "Services" },
            //           { text: "Order" },
            //         ]
            //     },
            //     component: () => import(/* webpackChunkName */ '@/views/Dashboard/Hospital/Registration/Verification')
            // },
        ]
    },
]

export default hospitalRoutes