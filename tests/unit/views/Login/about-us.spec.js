import { createLocalVue, shallowMount } from "@vue/test-utils"
import AboutUs from "@/views/Login/AboutUs"
import Vuex from "vuex"
import Vuetify from "vuetify"
import _ from "lodash"

describe("Login About Us", () => {
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
    const aboutUs = _.cloneDeep(AboutUs)
    aboutUs.created = jest.fn()
    aboutUs.mounted = jest.fn()

    container = shallowMount(aboutUs, {
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
