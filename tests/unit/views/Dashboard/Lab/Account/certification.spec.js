import { createLocalVue, shallowMount } from "@vue/test-utils"
import LabCertification from "@/views/Dashboard/Lab/Account/Certification"
import Vuex from "vuex"
import Vuetify from "vuetify"
import _ from "lodash"

describe("Dashboard Lab Account Certification", () => {
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
    const labCertificationDashboard = _.cloneDeep(LabCertification)
    labCertificationDashboard.created = jest.fn()
    labCertificationDashboard.mounted = jest.fn()

    container = shallowMount(labCertificationDashboard, {
      localVue,
      vuetify: new Vuetify(),
      store: new Vuex.Store({
        getters: {
          "substrate/labAccount" : () => {
            return {
              certifications: []
            };
          }
        },
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
