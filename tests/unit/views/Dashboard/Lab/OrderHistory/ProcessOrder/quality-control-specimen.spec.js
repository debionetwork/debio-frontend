import { createLocalVue, shallowMount } from "@vue/test-utils"
import QualityControlSpecimen from "@/views/Dashboard/Lab/OrderHistory/ProcessOrder/QualityControlSpecimen"
import Vuex from "vuex"
import Vuetify from "vuetify"
import _ from "lodash"

describe("Dashboard Lab Order History Process Order Process Specimen Quality Control Specimen", () => {
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
    const qualityControlSpecimen = _.cloneDeep(QualityControlSpecimen)
    qualityControlSpecimen.created = jest.fn()
    qualityControlSpecimen.mounted = jest.fn()

    container = shallowMount(qualityControlSpecimen, {
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
