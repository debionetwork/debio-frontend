import store from '../../store'
import globalFunctions from "@/lib/functions"

const doctorRoutes = [ 
    {
        path: '/doctor',
        component: () => import(/* webpackChunkName */ '@/views/Dashboard/Doctor/NavigationLayout'),
        beforeEnter: globalFunctions.checkIsLoggedIn,
        children: [
            {
              path: '/',
              name: 'doctor-dashboard',
              meta: {
                pageHeader: 'Doctor Dashboard',
              },
              component: () => import(/* webpackChunkName */ '@/views/Dashboard/Doctor'),
              beforeEnter: (to, from, next) => {
                // Set drawer buttons here to make it dynamic :)
                if(!store.state.substrate.isDoctorAccountExist){
                  to.meta.drawerButtons = [
                    { text: "Dashboard", active: true, disabled: false, route: { name: "doctor-dashboard" } },
                    { text: "Account" },
                    { text: "Customer Care", href: "https://docs.debio.network/" },
                  ]
                }
                else{
                  to.meta.drawerButtons = [
                    { text: "Dashboard", active: true, disabled: false, route: { name: "doctor-dashboard" } },
                    { text: "Account", disabled: false, route: { name: "doctor-dashboard-account" } },
                    { text: "Customer Care", href: "https://docs.debio.network/" },
                  ]
                }
                next()
              }
            },
            {
              path: '/doctor/account',
              name: 'doctor-dashboard-account',
              meta: {
                pageHeader: 'Account',
                breadcrumbs: [
                  { text: 'Doctor', href: '/doctor' },
                  { text: 'Account', disabled: true }
                ],
                drawerButtons: [
                  { text: "Dashboard", disabled: false, route: { name: "doctor-dashboard" } },
                  { text: "Account", active: true, disabled: false, route: { name: "doctor-dashboard-account" } },
                  { text: "Customer Care", href: "https://docs.debio.network/" },
                ]
              },
              component: () => import(/* webpackChunkName */ '@/views/Dashboard/Doctor/Account'),
            },
            // {
            //   path: '/doctor/account/verification',
            //   name: 'doctor-dashboard-account-verification',
            //   meta: {
            //     pageHeader: 'Doctor Verification',
            //     breadcrumbs: [
            //       { text: 'Doctor', href: '/doctor' },
            //       { text: 'Account', href: '/doctor/account' },
            //       { text: 'Verification', disabled: true }
            //     ],
            //     drawerButtons: [
            //       { text: "Dashboard", disabled: false, route: { name: "doctor-dashboard" } },
            //       { text: "Account", disabled: false, route: { name: "doctor-dashboard-account" } },
            //       { text: "Services", active: true, disabled: false, route: { name: "doctor-dashboard-services" } },
            //       { text: "Order", disabled: false, route: { name: "doctor-dashboard-order-history" } },
            //     ]
            //   },
            //   component: () => import(/* webpackChunkName */ '@/views/Dashboard/Doctor/Account/Verification')
            // },
            {
                path: '/doctor/registration',
                name: 'doctor-registration',
                meta: {
                    pageHeader: 'Doctor Registration',
                    breadcrumbs: [
                        { text: 'Doctor', href: '/doctor' },
                        { text: 'Registration', disabled: true }
                    ],
                    drawerButtons: [
                      { text: "Dashboard", active: true, disabled: false, route: { name: "doctor-dashboard" } },
                      { text: "Account" },
                      { text: "Customer Care", href: "https://docs.debio.network/" },
                    ]
                },
                component: () => import(/* webpackChunkName */ '@/views/Dashboard/Doctor/Registration'),
                beforeEnter: (to, from, next) => {
                  if(store.state.substrate.isDoctorAccountExist) next('/doctor')
                  else next()
                }
            },
            // {
            //     path: '/doctor/registration/verification',
            //     name: 'doctor-registration-verification',
            //     meta: {
            //         pageHeader: 'Doctor Verification',
            //         breadcrumbs: [
            //             { text: 'Doctor', href: '/doctor' },
            //             { text: 'Registration', disabled: true }
            //         ],
            //         drawerButtons: [
            //           { text: "Dashboard", disabled: false, route: { name: "doctor-dashboard" } },
            //           { text: "Account", disabled: false, route: { name: "doctor-dashboard-account" } },
            //           { text: "Services", active: true, disabled: false, route: { name: "doctor-dashboard-services" } },
            //           { text: "Order", disabled: false, route: { name: "doctor-dashboard-order-history" } },
            //           { text: "Dashboard", active: true, disabled: false, route: { name: "doctor-dashboard" } },
            //           { text: "Account" },
            //           { text: "Services" },
            //           { text: "Order" },
            //         ]
            //     },
            //     component: () => import(/* webpackChunkName */ '@/views/Dashboard/Doctor/Registration/Verification')
            // },
        ]
    },
]

export default doctorRoutes