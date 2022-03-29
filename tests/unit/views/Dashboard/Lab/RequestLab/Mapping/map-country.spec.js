import { createLocalVue, shallowMount } from "@vue/test-utils"
import MapCountry from "@/views/Dashboard/Lab/RequestLab/Mapping/MapCountry"
import Vuex from "vuex"
import Vuetify from "vuetify"
import _ from "lodash"

describe("Request Lab Mapping Search Bar", () => {
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
    const mapCountryDashboard = _.cloneDeep(MapCountry)
    mapCountryDashboard.mixins = []
    mapCountryDashboard.created = jest.fn()
    mapCountryDashboard.mounted = jest.fn()

    container = shallowMount(mapCountryDashboard, {
      localVue,
      vuetify: new Vuetify(),
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
