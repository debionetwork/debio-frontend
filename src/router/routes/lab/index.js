const labRoutes = [ 
    {
        path: '/lab',
        component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Lab/Dashboard'),
        children: [
            {
                path: '/',
                name: 'lab-orders',
                meta: {
                    pageHeader: 'Orders',
                },
                component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Lab')
            },
            {
                path: '/lab/registration',
                name: 'lab-registration',
                meta: {
                pageHeader: 'Lab Registration',
                breadcrumbs: [
                    { text: 'Home', href: '/' },
                    { text: 'Lab Registration', disabled: true }
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
                ]
                },
                component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Lab/Process')
            },
        ]
    },
]

export default labRoutes