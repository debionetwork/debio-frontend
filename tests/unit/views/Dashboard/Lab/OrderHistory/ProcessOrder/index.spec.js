import { createLocalVue, shallowMount } from "@vue/test-utils"
import ProcessOrder from "@/views/Dashboard/Lab/OrderHistory/ProcessOrder"
import Vuex from "vuex"
import Vuetify from "vuetify"
import _ from "lodash"

describe("Dashboard Lab Order History Process Order Index", () => {
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
    const processOrder = _.cloneDeep(ProcessOrder)
    processOrder.computed.orderId = jest.fn()
    processOrder.created = jest.fn()
    processOrder.mounted = jest.fn()

    container = shallowMount(processOrder, {
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
            configApp: {
              escrowETHAddress: "escrowETHAddress"
            },
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
