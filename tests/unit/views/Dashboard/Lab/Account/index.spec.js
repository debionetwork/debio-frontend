import { createLocalVue, shallowMount } from "@vue/test-utils"
import LabAccount from "@/views/Dashboard/Lab/Account"
import Vuex from "vuex"
import Vuetify from "vuetify"
import _ from "lodash"

describe("Dashboard Lab Account Index", () => {
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
    const labAccountDashboard = _.cloneDeep(LabAccount)
    labAccountDashboard.created = jest.fn()
    labAccountDashboard.mounted = jest.fn()

    container = shallowMount(labAccountDashboard, {
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
