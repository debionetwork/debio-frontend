import globalFunctions from "@/lib/functions";

const customerRoutes = [{
  path: '/customer',
  component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Customer/Dashboard'),
  beforeEnter: globalFunctions.checkIsLoggedIn,
  children: [
    {
      path: '/',
      name: 'customer-home',
      meta: {
        pageHeader: 'Home',
      },
      component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Customer/Home')
    },
    {
      path: '/order-history',
      name: 'order-history',
      meta: {
        pageHeader: 'Order history',
        breadcrumbs: [
          { text: 'Home', href: '/' },
          { text: 'Order History', disabled: true }
        ]
      },
      component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Customer/OrderHistory')
    },
    {
      path: '/order-history-detail/:number',
      name: 'order-history-detail',
      meta: {
        pageHeader: 'Order Detail',
        breadcrumbs: [
          { text: 'Home', href: '/' },
          { text: 'Order History', href: '/order-history' },
          { text: 'Order Detail', disabled: true },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Customer/OrderHistoryDetail')
    },
    {
      path: '/order-history-detail/:number/dna-collection-instructions',
      name: 'dna-collection-instructions',
      meta: {
        pageHeader: 'DNA Collection Instructions',
        breadcrumbs: [
          { text: 'Home', href: '/' },
          { text: 'Order History', href: '/order-history' },
          { text: 'Order Detail', href: '/order-history-detail/:number' },
          { text: 'DNA Collection Instructions', disabled: true },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Customer/DnaCollectionInstructions')
    },
    {
      path: '/result-test/:number',
      name: 'result-test',
      meta: {
        pageHeader: 'Test Result',
        breadcrumbs: [
          { text: 'Home', href: '/' },
          { text: 'Order History', href: '/order-history' },
          { text: 'Test Result', disabled: true }
        ]
      },
      component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Customer/TestResult/result.vue')
    },
    {
      path: '/customer/request-test',
      name: 'request-test',
      meta: {
        pageHeader: 'Request a Test',
        breadcrumbs: [
          { text: 'Home', href: '/' },
          { text: 'Request a Test', disabled: true },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Customer/RequestTest')
    },
    {
      path: '/request-test/checkout',
      name: 'request-test-checkout',
      meta: {
        pageHeader: 'Checkout',
        breadcrumbs: [
          { text: 'Home', href: '/' },
          { text: 'Request a Test', href: '/request-test' },
          { text: 'Checkout', disabled: true },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Customer/RequestTestCheckout')
    },
    {
      path: '/request-test/receipt',
      name: 'request-test-receipt',
      meta: {
        pageHeader: 'Your Order Receipt',
        breadcrumbs: [
          { text: 'Home', href: '/' },
          { text: 'Request a Test', href: '/request-test' },
          { text: 'Receipt', disabled: true },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Customer/RequestTestReceipt')
    },
    {
      path: '/result-test-all',
      name: 'all-test-result',
      meta: {
        pageHeader: 'Test Results',
        breadcrumbs: [
          { text: 'Home', href: '/' },
          { text: 'Test Results', disabled: true },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Customer/TestResult')
    },
    {
      path: '/genome-files',
      name: 'genome-files',
      meta: {
        pageHeader: 'Genome Files',
        breadcrumbs: [
          { text: 'Home', href: '/' },
          { text: 'Genome Files', disabled: true },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Customer/GenomeFiles')
    },
  ]
},
]

export default customerRoutes