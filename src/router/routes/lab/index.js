const labRoutes = [ 
    {
        path: '/lab',
        name: 'lab',
        component: () => import(/* webpackChunkName */ '../../../views/Dashboard'),
        children: [
        {
            path: '/',
            name: 'lab',
            meta: {
            pageHeader: 'Orders',
            },
            component: () => import(/* webpackChunkName */ '../../../views/Dashboard/Lab')
        },
        {
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