import globalFunctions from "@/lib/functions";

const customerRoutes = [{
  path: '/customer',
  component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer'),
  beforeEnter: globalFunctions.checkIsLoggedIn,
  children: [
    {
      path: '/',
      name: 'customer-home',
      meta: {
        pageHeader: 'Home',
        drawerButtons: [
          { text: "Dashboard", disabled: false, active: true, route: { name: "customer-home" } },
          { text: "Request Test", disabled: false, route: { name: "request-test" } },
          { text: "Test Results", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", disabled: false, route: { name: "order-history" } },
          { text: "EMR", subText: "(Electronic Medical Record)", disabled: false, route: { name: "documents" } },
          { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/Home')
    },
    {
      path: '/customer/service-request',
      name: 'service-request',
      meta: {
        pageHeader: 'Service Request',
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", disabled: false, route: { name: "request-test" } },
          { text: "Test Results", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", active: true, disabled: false, route: { name: "order-history" } },
          { text: "EMR", disabled: false, route: { name: "documents" } },
          { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/RequestTest/ServiceRequest.vue')
    },
    {
      path: '/customer/order-history',
      name: 'order-history',
      meta: {
        pageHeader: 'Order history',
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", disabled: false, route: { name: "request-test" } },
          { text: "Test Results", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", active: true, disabled: false, route: { name: "order-history" } },
          { text: "EMR", subText: "(Electronic Medical Record)", disabled: false, route: { name: "documents" } },
          { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/OrderHistory.vue')
    },
    {
      path: '/customer/order-history-detail/:number',
      name: 'order-history-detail',
      meta: {
        pageHeader: 'Order Detail',
        breadcrumbs: [
          { text: 'Order History', href: '/customer/order-history' },
          { text: 'Order Detail', disabled: true },
        ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", disabled: false, route: { name: "request-test" } },
          { text: "Test Results", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", active: true, disabled: false, route: { name: "order-history" } },
          { text: "EMR", subText: "(Electronic Medical Record)", disabled: false, route: { name: "documents" } },
          { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/OrderHistoryDetail')
    },
    {
      path: '/customer/order-history-detail/:number/dna-collection-instructions',
      name: 'dna-collection-instructions',
      meta: {
        pageHeader: 'DNA Collection Instructions',
        breadcrumbs: [
          { text: 'Home', href: '/customer' },
          { text: 'Order History', href: '/customer/order-history' },
          { text: 'Order Detail', href: '/customer/order-history-detail/:number' },
          { text: 'DNA Collection Instructions', disabled: true },
        ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", disabled: false, route: { name: "request-test" } },
          { text: "Test Results", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", active: true, disabled: false, route: { name: "order-history" } },
          { text: "EMR", subText: "(Electronic Medical Record)", disabled: false, route: { name: "documents" } },
          { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/DnaCollectionInstructions.vue')
    },
    {
      path: '/customer/result-test/:number',
      name: 'result-test',
      meta: {
        pageHeader: 'Test Result',
        breadcrumbs: [
          { text: 'Home', href: '/customer' },
          { text: 'Test Results', href: 'all-test-result' },
          { text: 'Result', disabled: true }
        ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", disabled: false, route: { name: "request-test" } },
          { text: "Test Results", active: true, disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", disabled: false, route: { name: "order-history" } },
          { text: "EMR", subText: "(Electronic Medical Record)", disabled: false, route: { name: "documents" } },
          { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/TestResult/result.vue')
    },
    {
      path: '/customer/request-test',
      name: 'request-test',
      meta: {
        pageHeader: 'Request a Test',
        // breadcrumbs: [
        //   { text: 'Home', href: '/customer' },
        //   { text: 'Request a Test', disabled: true },
        // ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", active: true, disabled: false, route: { name: "request-test" } },
          { text: "Test Results", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", disabled: false, route: { name: "order-history" } },
          { text: "EMR", subText: "(Electronic Medical Record)", disabled: false, route: { name: "documents" } },
          { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/RequestTest')
    },
    {
      path: '/customer/request-test/find-lab',
      name: 'find-lab',
      meta: {
        pageHeader: 'Find Lab',
        breadcrumbs: [
          { text: 'Request Test', href: '/customer/request-test' },
          { text: 'Find Lab', href: '/customer/request-test/find-lab' },
        ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", active: true, disabled: false, route: { name: "request-test" } },
          { text: "Test Results", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", disabled: false, route: { name: "order-history" } },
          { text: "EMR", subText: "(Electronic Medical Record)", disabled: false, route: { name: "documents" } },
          { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/RequestTest/FindLab')
    },
    {
      path: '/customer/request-test/find-test',
      name: 'find-test',
      meta: {
        pageHeader: 'Find Test',
        breadcrumbs: [
          { text: 'Request Test', href: '/customer/request-test' },
          { text: 'Find Test', href: '/customer/request-test/find-test' },
        ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", active: true, disabled: false, route: { name: "request-test" } },
          { text: "Test Results", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", disabled: false, route: { name: "order-history" } },
          { text: "EMR", subText: "(Electronic Medical Record)", disabled: false, route: { name: "documents" } },
          { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/RequestTest/FindTest')
    },
    {
      path: '/customer/request-test/find-test/select-category',
      name: 'select-category',
      meta: {
        pageHeader: 'Select your service category',
        breadcrumbs: [
          { text: 'Request Test', href: '/customer/request-test' },
          { text: 'Find Test', href: '/customer/request-test/find-test' },
          { text: 'Select Category', href: '/customer/request-test/find-test/select-category' },
        ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", active: true, disabled: false, route: { name: "request-test" } },
          { text: "Test Results", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", disabled: false, route: { name: "order-history" } },
          { text: "EMR", subText: "(Electronic Medical Record)", disabled: false, route: { name: "documents" } },
          { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/RequestTest/SelectCategory')
    },
    {
      path: '/customer/request-test/find-test/select-category/select-lab',
      name: 'select-lab',
      meta: {
        pageHeader: 'Select Lab',
        breadcrumbs: [
          { text: 'Request Test', href: '/customer/request-test' },
          { text: 'Find Test', href: '/customer/request-test/find-test' },
          { text: 'Select Category', href: '/customer/request-test/find-test/select-category' },
          { text: 'Select Lab', href: '/customer/request-test/find-test/select-category/select-lab' },
        ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", active: true, disabled: false, route: { name: "request-test" } },
          { text: "Test Results", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", disabled: false, route: { name: "order-history" } },
          { text: "EMR", subText: "(Electronic Medical Record)", disabled: false, route: { name: "documents" } },
          { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/RequestTest/SelectLab')
    },

    {
      path: '/customer/request-test/checkout',
      name: 'request-test-checkout',
      meta: {
        pageHeader: 'Checkout',
        breadcrumbs: [
          { text: 'Request a Test', href: '/customer/request-test' },
          { text: 'Checkout', disabled: true },
        ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", active: true, disabled: false, route: { name: "request-test" } },
          { text: "Test Results", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", disabled: false, route: { name: "order-history" } },
          { text: "EMR", subText: "(Electronic Medical Record)", disabled: false, route: { name: "documents" } },
          { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/RequestTestCheckout')
    },
    {
      path: '/customer/request-test/receipt',
      name: 'request-test-receipt',
      meta: {
        pageHeader: 'Your Order Receipt',
        breadcrumbs: [
          { text: 'Home', href: '/customer' },
          { text: 'Request a Test', href: '/customer/request-test' },
          { text: 'Checkout', href: '/customer/request-test/checkout' },
          { text: 'Receipt', disabled: true },
        ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", active: true, disabled: false, route: { name: "request-test" } },
          { text: "Test Results", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", disabled: false, route: { name: "order-history" } },
          { text: "EMR", subText: "(Electronic Medical Record)", disabled: false, route: { name: "documents" } },
          { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/RequestTestReceipt.vue')
    },
    {
      path: '/customer/result-test-all',
      name: 'all-test-result',
      meta: {
        pageHeader: 'Test Results',
        breadcrumbs: [
          { text: 'Home', href: '/customer' },
          { text: 'Test Results', disabled: true },
        ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", disabled: false, route: { name: "request-test" } },
          { text: "Test Results", active: true, disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", disabled: false, route: { name: "order-history" } },
          { text: "EMR", subText: "(Electronic Medical Record)", disabled: false, route: { name: "documents" } },
          { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/TestResult')
    },
    {
      path: '/customer/genome-files',
      name: 'genome-files',
      meta: {
        pageHeader: 'Genome Files',
        breadcrumbs: [
          { text: 'Home', href: '/customer' },
          { text: 'Genome Files', disabled: true },
        ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", disabled: true },
          { text: "Test Results", disabled: true },
          { text: "Order History", disabled: true },
          { text: "EMR", subText: "(Electronic Medical Record)", disabled: false, route: { name: "documents" } },
          { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/GenomeFiles.vue')
    },
    {
      path: '/customer/documents',
      name: 'documents',
      meta: {
        pageHeader: 'EMR (Electronic Medical Record)',
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", disabled: false, route: { name: "request-test" } },
          { text: "Test Results", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", disabled: false, route: { name: "order-history" } },
          { text: "EMR", subText: "(Electronic Medical Record)", active: true, disabled: false, route: { name: "documents" } },
          { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/Documents/DocumentsList.vue')
    },
    {
      path: '/customer/document-detail/:number/:type',
      name: 'document-detail',
      meta: {
        pageHeader: 'Document Detail',
        breadcrumbs: [
          { text: 'EMR', href: '/customer/documents' },
          { text: 'Document Detail', disabled: true },
        ],
        drawerButtons: [
          { text: "Dashboard", disabled: false, route: { name: "customer-home" } },
          { text: "Request Test", disabled: false, route: { name: "request-test" } },
          { text: "Test Results", disabled: false, route: { name: "all-test-result" } },
          { text: "Order History", disabled: false, route: { name: "order-history" } },
          { text: "EMR", subText: "(Electronic Medical Record)", active: true, disabled: false, route: { name: "documents" } },
          { text: "Customer Care", href: "https://docs.debio.network/getting-started" },
        ]
      },
      component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/Documents/DocumentResult.vue')
    },
  ]
},
]

export default customerRoutes