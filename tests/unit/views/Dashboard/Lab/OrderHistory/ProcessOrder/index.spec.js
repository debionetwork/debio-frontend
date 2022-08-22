import { createLocalVue, shallowMount } from "@vue/test-utils"
import ProcessOrder from "@/views/Dashboard/Lab/OrderHistory/ProcessOrder"
import Vuex from "vuex"
import Vuetify from "vuetify"


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
    container = shallowMount(ProcessOrder, {
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
