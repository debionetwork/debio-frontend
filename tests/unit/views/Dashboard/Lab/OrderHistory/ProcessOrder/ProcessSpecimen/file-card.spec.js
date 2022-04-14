import { createLocalVue, shallowMount } from "@vue/test-utils"
import FileCard from "@/views/Dashboard/Lab/OrderHistory/ProcessOrder/ProcessSpecimen/FileCard"
import Vuex from "vuex"
import Vuetify from "vuetify"
import _ from "lodash"

describe("Dashboard Lab Order History Process Order Process Specimen File Card", () => {
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
    const fileCard = _.cloneDeep(FileCard)
    fileCard.created = jest.fn()
    fileCard.mounted = jest.fn()

    container = shallowMount(fileCard, {
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
