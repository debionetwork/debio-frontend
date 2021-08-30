const requestServicesRoute = [
  {
    path: '/request-service',
    name: 'request-lab',
    meta: { public: true },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "" */ '../../views/Dashboard/Lab/RequestLab')
  },
]

export default requestServicesRoute