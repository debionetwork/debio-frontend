<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
.image-placeholder{
  cursor: pointer;
  border: 1px solid lightgrey;
}
</style>

<template>
  <div>
    <v-container>
      <v-dialog v-model="showModalAlert" persistent width="450">
        <v-card>
          <v-card-title>{{ messageWarning.title }}</v-card-title>
          <v-card-subtitle class="mt-1" v-html="messageWarning.subtitle"></v-card-subtitle>
          <v-card-actions>
            <v-btn
              block color="primary"
              @click="handleRedirect"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
            <v-card class="dg-card" elevation="0" outlined>
              <v-form ref="addServiceForm">
                <v-card-text class="px-8 pb-8 pt-10">              
                  <div class="mt-5 mb-12 justify-space-evenly" align="center">
                      <v-avatar
                        size="125"
                        @click="selectPicture"
                        rounded
                        class="image-placeholder"
                      >
                        <v-img v-if="!imageUrl" src="@/assets/add-image-placeholder.png" alt="image"></v-img>
                        <v-img v-else :src="imageUrl" alt="image"></v-img>
                        <v-file-input 
                          style="display: none"
                          hide-input
                          prepend-icon="mdi-camera"
                          accept="image/*" 
                          ref="fileInput"
                          @change="imageUploadEventListener" />
                      </v-avatar>

                  </div>
                    <v-select
                    dense
                    label="Service Category"
                    placeholder="Service Category"
                    v-model="category"
                    outlined
                    :items="listCategories"
                    item-text="service_categories"
                    item-value="service_categories"
                    :rules="serviceCategoryRules"
                    ></v-select>
                    
                    <v-text-field
                      dense
                      label="Service Name"
                      placeholder="Service Name"
                      outlined
                      v-model="name"
                      :rules="serviceNameRules"
                    ></v-text-field>

                    <div class="d-flex">
                      <v-row>
                        <v-col>
                          <v-select
                          label="Currency"
                          outlined
                          dense
                          max="30"
                          v-model="currencyType"
                          :items="currencyList"
                          :rules="curencyTypeRules"
                          ></v-select>
                        </v-col>
                        <v-col>
                          <v-text-field
                            dense
                            label="Price"
                            placeholder="Price"
                            outlined
                            v-model="price"
                            :rules="priceRules"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-select
                          label="QC Currency"
                          outlined
                          dense
                          v-model="currencyType"
                          :items="currencyList"
                          :rules="qcQurencyTypeRules"
                          ></v-select>
                        </v-col>
                        <v-col>
                          <v-text-field
                            dense
                            label="QC Price"
                            placeholder="QC Price"
                            outlined
                            v-model="qcPrice"
                            :rules="cqPriceRules"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </div>

                    <v-text-field
                      dense
                      label="Short Description"
                      placeholder="Short Description"
                      outlined
                      v-model="description"
                      :rules="descriptionRules"
                    ></v-text-field>
                    
                    <v-row >
                      <v-col cols="8">
                        <v-text-field
                          dense
                          label="Expected Duration"
                          placeholder="Expected Duration"
                          max="30"
                          outlined
                          v-model="expectedDuration"
                          :rules="expectedDurationRules"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <v-select
                          outlined
                          dense
                          v-model="selectExpectedDuration"
                          :items="listExpectedDuration"
                          :rules="expectedDurationRules"
                        ></v-select>
                      </v-col>
                    </v-row>


                    <v-textarea
                      label="Long Description"
                      placeholder="Long Description"
                      outlined
                      v-model="longDescription"
                      :rules="longDescriptionRules"
                    ></v-textarea>

                    <v-file-input
                      :rules="fileInputRules"
                      accept="image/png, image/jpeg, image/bmp, .pdf"
                      dense
                      label="Test Result Sample"
                      placeholder="Test Result Sample"
                      prepend-icon="mdi-file-document"
                      outlined
                      v-model="testResultSampleFile"
                      @change="fileUploadEventListener"
                    ></v-file-input>

                    <v-btn
                      color="primary"
                      block
                      large
                      :disabled="isUploading"
                      :loading="isLoading"
                      @click="createService"
                    >Submit</v-btn>
                </v-card-text>
              </v-form>
            </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { upload } from "@/lib/ipfs"
import { createService } from '@/lib/polkadotProvider/command/services'
import { getCategories } from "@/lib/categories"
import { queryLabsById } from "@/lib/polkadotProvider/query/labs";

export default {
  name: 'AddLabServices',
  data: () => ({
    category: '',
    name: '',
    price: '',
    qcPrice: '',
    description: '',
    longDescription: '',
    imageUrl: "",
    testResultSampleUrl: "",
    statusLab: null,
    messageWarning: {},
    service_flow: "requestTest",
    files: [],
    testResultSampleFile:[],
    listCategories:[],
    sampleFiles:[],
    isLoading: false,
    showModalAlert: false,
    isUploading: false,
    currencyList: ['DAI', 'Ethereum'],
    currencyType: 'DAI',
    listExpectedDuration: ['WorkingDays', 'Hours', 'Days'],
    selectExpectedDuration: 'WorkingDays',
    expectedDuration: '',
  }),

  async mounted() {
    this.prefillValues()
    await this.getServiceCategory()
  },

  computed: {
    ...mapState({
      servicePayload: (state) => state.lab.providePayload,
      api: (state) => state.substrate.api,
      exist: (state) => state.substrate.isLabAccountExist,
      pair: (state) => state.substrate.wallet,
    }),

    serviceCategoryRules() {
      return [
        val => !!val || 'Category is Required'
      ]
    },

    serviceNameRules() {
      return [
        val => !!val || 'Name is Required',
        val => (val && val.length <= 50) || 'Max 50 Character'
      ]
    },

    curencyTypeRules() {
      return [
        val => !!val || 'Currency Type is Required'
      ]
    },

    priceRules() {
      return [
        val => !!val || 'Price is Required',
        val => /^[0-9]+$/.test(val) || 'Price must be Number'
      ]
    },

    qcQurencyTypeRules() {
      return [
        val => !!val || 'QC Currency Type is Required'
      ]
    },
    
    cqPriceRules() {
      return [
        val => !!val || 'QC Price is Required',
        val => /^[0-9]+$/.test(val) || 'QC Price must be Number'
      ]
    },

    descriptionRules() {
      return [
        val => !!val || 'Description is Required',
        val => (val && val.length >= 50) || 'Min 50 Character',
        val => (val && val.length <= 255) || 'Max 255 Character'
      ]
    },

    longDescriptionRules() {
      return [
        val => !!val || 'Long Description is Required',
        val => (val && val.length >= 500) || 'Max 500 Character',
        val => (val && val.length <= 1000) || 'Max 1000 Character'
      ]
    },

    expectedDurationRules() {
      return [
        val => !!val || 'Expected duration is Required'
      ]
    },

    fileInputRules() {
      return [
        value => !value || value.size < 2000000 || 'Image size should be less than 2 MB!',
      ]
    },

  },

  created() {
    this.validate()
  },

  methods: {

    async validate () {
      const currentLab = await queryLabsById(this.api, this.pair.address)
      if (!currentLab) return

      const MESSAGE = Object.freeze({
        UNVERIFIED: {
          title: "Your laboratory account not verified yet",
          subtitle: `
            Please verify your email 
            <strong class="primary--text">${currentLab.info?.email}</strong> 
            / contact to our admin first to add the services
          `
        },
        REJECTED: {
          title: "Your laboratory account Rejected",
          subtitle: "Please contact us"
        },
        REVOKED: {
          title: "Your laboratory account is Revoked",
          subtitle: "Please contact us"
        },
        NOT_EXIST: {
          title: "Your laboratory is not registered yet",
          subtitle: "Please register your lab account"
        },
        CITY_NOT_MATCH: {
          title: "Your location not match with this service",
          subtitle: `Please select service with your location (${currentLab.info.city})`
        }
      })

      if (currentLab.verification_status === "verified") {
        if (currentLab.info?.city !== this.servicePayload?.location) return

        this.showModalAlert = true

        this.messageWarning = MESSAGE["CITY_NOT_MATCH"]

        return
      }

      this.statusLab = currentLab.verification_status

      const compute = !this.exist ? "NOT_EXIST" : currentLab.verification_status.toUpperCase()

      this.messageWarning = MESSAGE[compute]

      this.showModalAlert = true
    },

    async getServiceCategory() {
      const { data : data } = await getCategories()
      this.listCategories =  data
    },

    prefillValues() {
      const checkQuery = Object.keys(this.servicePayload).length
      if (!checkQuery) return

      const {
        name,
        category,
        qcValue,
        currencyValue,
        currencyType,
        descriptionShort,
        descriptionLong,
        durationType,
        durationValue,
        service_flow
      } = this.servicePayload

      this.name = name
      this.category = category
      this.price = currencyValue
      this.qcPrice = qcValue
      this.description = descriptionShort
      this.longDescription = descriptionLong
      this.currencyType = currencyType
      this.selectExpectedDuration = durationType
      this.expectedDuration = durationValue
      this.service_flow = service_flow
    },

    async createService() {
      if(this.isLoading) return // If function already running return.
      if (!this.$refs.addServiceForm.validate()) {
        return
      }
      this.isLoading = true
      await createService(
        this.api,
        this.pair,
        {
          name: this.name,
          prices_by_currency: [
            {
              currency: this.currencyType,
              price_components: [
                {
                  component: "component_1",
                  value: this.price
                }
              ],
              additional_prices: [
                {
                  component: "qc_component",
                  value: this.qcPrice
                }
              ],
            },
          ],
          expected_duration: { 
            duration: this.expectedDuration, 
            duration_type: this.selectExpectedDuration
          },
          category: this.category,
          description: this.description,
          test_result_sample: this.testResultSampleUrl,
          long_description: this.longDescription,
          image: this.imageUrl,
          service_flow: this.service_flow
        },
        () => {
          this.$router.push('/lab/services')
          this.$store.dispatch("lab/setProvideService", {})
          this.isLoading = false
        }
      )
    },

    imageUploadEventListener(file) {
      this.isUploading = true
      this.isLoading = true
      this.imageUrl = ""
      if (file) {
        if (file.name.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsArrayBuffer(file)

        const context = this
        fr.addEventListener('load', async () => {
          // Upload
          const uploaded = await upload({
            fileChunk: fr.result,
            fileType: file.type,
            fileName: file.name,
          })
          context.imageUrl = `https://ipfs.io/ipfs/${uploaded.ipfsPath[0].data.path}` // this is an image file that can be sent to server... (convert img to file path)
          context.isUploading = false
          context.isLoading = false
        })
      }
    },

    fileUploadEventListener(file) {
      if (!file || file.size >= 2000000) {
        return
      }
      this.isUploading = true
      this.isLoading = true
      this.testResultSampleUrl = ""
      if (file) {
        if (file.name.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsArrayBuffer(file)

        const context = this
        fr.addEventListener('load', async () => {
          // Upload
          const uploaded = await upload({
            fileChunk: fr.result,
            fileType: file.type,
            fileName: file.name,
          })
          context.testResultSampleUrl = `https://ipfs.io/ipfs/${uploaded.ipfsPath[0].data.path}` // this is an image file that can be sent to server... (convert img to file path)
          context.isUploading = false
          context.isLoading = false
        })
      }
    },

    handleRedirect() {
      const REDIRECT_TO = Object.freeze({
        UNVERIFIED: {
          name: "lab-dashboard"
        },
        REJECTED: {
          name: "lab-dashboard"
        },
        REVOKED: {
          name: "lab-dashboard"
        },
        NOT_EXIST: {
          name: "lab-registration-services"
        }
      })

      const compute = !this.exist ? "NOT_EXIST" : this.statusLab.toUpperCase()

      this.$router.push(REDIRECT_TO[compute])
    },

    selectPicture() {
      this.$refs.fileInput.$refs.input.click()
    }
  },
}
</script>