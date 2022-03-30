import { createLocalVue, shallowMount } from "@vue/test-utils"
import AddLabServices from "@/views/Dashboard/Lab/Services/Add"
import Vuex from "vuex"
import Vuetify from "vuetify"
import _ from "lodash"

describe("Dashboard Lab Services Add Index", () => {
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
    const addLabServicesDashboard = _.cloneDeep(AddLabServices)
    addLabServicesDashboard.created = jest.fn()
    addLabServicesDashboard.mounted = jest.fn()

    container = shallowMount(addLabServicesDashboard, {
      localVue,
      vuetify: new Vuetify(),
      store: new Vuex.Store({
        state: {
          substrate: {
            api: "API",
            wallet: "WALLET",
            mnemonicData: "oil spend nation obey lecture behave lake diary reward forest gym apple"
          },
          lab: {
            providePayload: "PROVIDE_PAYLOAD"
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
