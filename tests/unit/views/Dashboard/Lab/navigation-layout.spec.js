import { createLocalVue, shallowMount } from "@vue/test-utils"
import Dashboard from "@/views/Dashboard/Lab/NavigationLayout"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from 'vue-router'
import _ from 'lodash'

describe("Dashboard Lab Navigation Layout", () => {
  let container
  let localVue = null
  
  const router = new VueRouter({routes: [
    {path: '/lab', name: 'lab' },
  ]})

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(Vuetify)
    localVue.use(VueRouter)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    // Arrange
    const dashboard = _.cloneDeep(Dashboard)

    container = shallowMount(dashboard, {
      localVue,
      vuetify: new Vuetify(),
      router: router,
      store: new Vuex.Store({
        getters: {
          'substrate/wallet' : () => {
            return false;
          }
        },
        state: {
          substrate: {
            api: "API",
            wallet: "WALLET",
            mnemonicData: "oil spend nation obey lecture behave lake diary reward forest gym apple"
          },
          auth: {
            loadingData: "LOADING"
          },
          metamask: {
            web3: "WEB3"
          }
        }
      })
    })

    // Assert
    expect(container.exists()).toBe(true)
  })
})
