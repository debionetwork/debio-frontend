import { createLocalVue, shallowMount } from "@vue/test-utils"
import Breadcrumbs from "@/views/Dashboard/Breadcrumbs"
import Vuex from "vuex"
import Vuetify from "vuetify"
import _ from "lodash"

describe("Dashboard Breadcrumbs", () => {
  let container
  let localVue = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(Vuetify)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    // Arrange
    const breadcrumbs = _.cloneDeep(Breadcrumbs)
    breadcrumbs.created = jest.fn()
    breadcrumbs.mounted = jest.fn()

    container = shallowMount(breadcrumbs, {
      localVue,
      vuetify: new Vuetify(),
      mocks : {
        $route: {}
      },
      store: new Vuex.Store({
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
