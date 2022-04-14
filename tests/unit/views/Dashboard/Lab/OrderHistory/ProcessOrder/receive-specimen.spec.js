import { createLocalVue, shallowMount } from "@vue/test-utils"
import ReceiveSpecimen from "@/views/Dashboard/Lab/OrderHistory/ProcessOrder/ReceiveSpecimen"
import Vuex from "vuex"
import Vuetify from "vuetify"
import _ from "lodash"

describe("Dashboard Lab Order History Process Order Process Specimen Receive Specimen", () => {
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
    const receiveSpecimen = _.cloneDeep(ReceiveSpecimen)
    receiveSpecimen.created = jest.fn()
    receiveSpecimen.mounted = jest.fn()

    container = shallowMount(receiveSpecimen, {
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
