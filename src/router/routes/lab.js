import store from "@/store"
import globalFunctions from "@/lib/functions"

const labRoutes = [
  {
    path: "/lab",
    component: () => import(/* webpackChunkName */ "@/views/Dashboard/Lab/NavigationLayout"),
    beforeEnter: globalFunctions.checkIsLoggedIn,
    children: [
      {
        path: "/",
        name: "lab-dashboard",
        meta: {
          pageHeader: "Orders",
          breadcrumbs: [
            { text: "Lab", href: "/lab" },
            { text: "Orders", disabled: true }
          ]
        },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/Lab")
      },
      {
        path: "maintenance",
        name: "maintenance",
        meta: { pageHeader: "Maintenance" },
        component: () => import(/* webpackChunkName */ "@/views/maintenancePageLayout"),
        beforeEnter: (to, from, next) => {
          if (from.path === "/") next({ name: "lab-dashboard" })
          else next()
        }
      },
      {
        path: "/lab/account",
        name: "lab-dashboard-account",
        meta: {
          pageHeader: "Account",
          breadcrumbs: [
            { text: "Lab", href: "/lab" },
            { text: "Account", disabled: true }
          ]
        },
        beforeEnter: (to, from, next) => {
          if (!store.state.substrate.isServicesExist || store.state.substrate.labAccount.verificationStatus !== "Verified") {
            next("/lab")
          }

          else next()
        },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/Lab/Account")
      },
      {
        path: "/lab/registration",
        name: "lab-registration",
        meta: {
          pageHeader: "Lab Registration",
          breadcrumbs: [
            { text: "Lab", href: "/lab" },
            { text: "Registration", disabled: true }
          ]
        },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/Lab/Registration"),
        beforeEnter: (to, from, next) => {
          if (store.state.substrate.isLabAccountExist && store.state.substrate.labAccount.certifications.length) next("/lab/registration/services")
          else next()
        }
      },
      {
        path: "/lab/registration/services",
        name: "lab-registration-services",
        meta: {
          pageHeader: "Lab Verification Services",
          breadcrumbs: [
            { text: "Lab", href: "/lab" },
            { text: "Registration", disabled: true }
          ]
        },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/Lab/Registration/Services"),
        beforeEnter: (to, from, next) => {
          if (!store.state.substrate.isLabAccountExist || !store.state.substrate.labAccount.certifications.length) next("/lab/registration")
          else next()
        }
      },
      {
        path: "/lab/services",
        name: "lab-dashboard-services",
        meta: {
          pageHeader: "Services",
          breadcrumbs: [
            { text: "Lab", href: "/lab" },
            { text: "Services", disabled: true }
          ]
        },
        beforeEnter: (to, from, next) => {
          if (!store.state.substrate.isServicesExist || store.state.substrate.labAccount.verificationStatus !== "Verified") {
            next("/lab")
          }

          else next()
        },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/Lab/Services")
      },
      {
        path: "/lab/services/add",
        name: "lab-dashboard-add-services",
        meta: {
          pageHeader: "Add Services",
          breadcrumbs: [
            { text: "Lab", href: "/lab" },
            { text: "Services", href: "/lab/services" },
            { text: "Add Services", disabled: true }
          ]
        },
        beforeEnter: (to, from, next) => {
          if (from.name !== "request-lab" && (!store.state.substrate.isServicesExist || store.state.substrate.labAccount.verificationStatus !== "Verified")) next("/lab")
          else next()
        },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/Lab/Services/Add")
      },
      {
        path: "/lab/services/detail/:id",
        name: "lab-dashboard-services-detail",
        meta: {
          pageHeader: "Services Detail",
          breadcrumbs: [
            { text: "Lab", href: "/lab" },
            { text: "Services", href: "/lab/services" },
            { text: "Services Detail", disabled: true }
          ]
        },
        beforeEnter: (to, from, next) => {
          if (!store.state.substrate.isServicesExist || store.state.substrate.labAccount.verificationStatus !== "Verified") {
            next("/lab")
          }

          else next()
        },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/Lab/Services/Detail")
      },
      {
        path: "/lab/orders",
        name: "lab-dashboard-order-history",
        meta: {
          pageHeader: "Order History",
          breadcrumbs: [
            { text: "Lab", href: "/lab" },
            { text: "Order History", disabled: true }
          ]
        },
        beforeEnter: (to, from, next) => {
          if (!store.state.substrate.isServicesExist || store.state.substrate.labAccount.verificationStatus !== "Verified") {
            next("/lab")
          }

          else next()
        },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/Lab/OrderHistory")
      },
      {
        path: "/lab/orders/:orderId/process",
        name: "lab-dashboard-process-order",
        meta: {
          pageHeader: "Process Order",
          breadcrumbs: [
            { text: "Lab", href: "/lab" },
            { text: "Orders", href: "/lab/orders" },
            { text: "Process Order", disabled: true }
          ]
        },
        beforeEnter: (to, from, next) => {
          if (!store.state.substrate.isServicesExist || store.state.substrate.labAccount.verificationStatus !== "Verified") {
            next("/lab")
          }

          else next()
        },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/Lab/OrderHistory/ProcessOrder")
      },
      {
        path: "/lab/admin",
        name: "lab-dashboard-admin",
        meta: {
          pageHeader: "Admin Dashboard",
          breadcrumbs: [
            { text: "Lab", href: "/lab" },
            { text: "Admin", href: "/lab/admin" },
            { text: "Admin Dashboard", disabled: true }
          ]
        },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/Lab/Admin")
      }
    ]
  }
]

export default labRoutes
