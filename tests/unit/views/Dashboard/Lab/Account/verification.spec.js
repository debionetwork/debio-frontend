import { createLocalVue, shallowMount } from "@vue/test-utils"
import LabVerification from "@/views/Dashboard/Lab/Account/Verification"
import Vuex from "vuex"
import Vuetify from "vuetify"
import _ from "lodash"

describe("Dashboard Lab Account Verification", () => {
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
    const labVerificationDashboard = _.cloneDeep(LabVerification)
    labVerificationDashboard.created = jest.fn()
    labVerificationDashboard.mounted = jest.fn()

    container = shallowMount(labVerificationDashboard, {
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
