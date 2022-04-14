import { createLocalVue, shallowMount } from "@vue/test-utils"
import ProcessSpecimen from "@/views/Dashboard/Lab/OrderHistory/ProcessOrder/ProcessSpecimen"
import Vuex from "vuex"
import Vuetify from "vuetify"
import _ from "lodash"

describe("Dashboard Lab Order History Process Order Process Specimen Index", () => {
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
    const processSpecimen = _.cloneDeep(ProcessSpecimen)
    processSpecimen.created = jest.fn()
    processSpecimen.mounted = jest.fn()

    container = shallowMount(processSpecimen, {
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
