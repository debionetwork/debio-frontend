<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="7">
          <v-card class="dg-card" elevation="0" outlined>
            <v-form ref="serviceForm">
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
                  :rules="fieldRequiredRule"
                  ></v-select>

                  <v-select
                    dense
                    label="Type of Biological Sample"
                    placeholder="Type of Biological Sample"
                    v-model="biologicalType"
                    outlined
                    :items="listBiologicalType"
                    item-text="dnaCollectionProcess"
                    item-value="dnaCollectionProcess"
                    :rules="fieldRequiredRule"
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
                        :rules="fieldRequiredRule"
                        ></v-select>
                      </v-col>
                      <v-col>
                        <v-text-field
                          dense
                          label="Price"
                          placeholder="e.g. 20.005"
                          type="number"
                          min="0"
                          step=".001"
                          outlined
                          v-model.number="price"
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
                        :rules="fieldRequiredRule"
                        ></v-select>
                      </v-col>
                      <v-col>
                        <v-text-field
                          dense
                          label="QC Price"
                          placeholder="e.g. 20.005"
                          type="number"
                          min="0"
                          step=".001"
                          outlined
                          v-model.number="qcPrice"
                          :rules="cqPriceRules"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </div>

                  <div class="grey--text mb-6">
                    *Every transaction fee includes a 5% service charge.
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
                        min="0"
                        max="30"
                        outlined
                        type="number"
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
                        :rules="fieldRequiredRule"
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
                    show-size
                  ></v-file-input>

                  <v-btn
                    color="primary"
                    block
                    large
                    :disabled="isUploading"
                    :loading="isLoading"
                    @click="triggerCreateOrUpdate"
                  >Submit</v-btn>
              </v-card-text>
            </v-form>
          </v-card>

          <List 
            @add-service="clearServicesForm"
            @edit-service="prefillServicesForm"
            @delete-service="setDeleteLoading"
          />

          <v-btn
            :disabled="!isServicesExist"
            color="primary"
            block
            large
            class="mt-5 mb-3"
            :loading="isLoading || isUploading"
            @click="actionAlert"
          >Submit</v-btn>
        </v-col>
        <v-col cols="5">
          <Stepper
            stepper-description="You need to complete all the steps to verify your account"
            :stepper-items="stepperItems"
          />
        </v-col>
      </v-row>
    </v-container>

    <DialogAlert
      :show="dialogAlert"
      btnText="Continue"
      textAlert="You have been submitted your lab registration request, we will inform you as soon as possible"
      imgPath="success.png"
      imgWidth="75"
      @toggle="dialogAlert = $event"
      @close="gotoDashboard"
    ></DialogAlert>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { uploadFile, getFileUrl } from "@/lib/pinata-proxy"
import { createService, updateService } from "@/lib/polkadotProvider/command/services"
import { getCategories } from "@/lib/api"
import List from "./List"
import Stepper from "../Stepper"
import { queryLabsById } from "@/lib/polkadotProvider/query/labs"
import DialogAlert from "@/components/Dialog/DialogAlert"
import serviceHandler from "@/mixins/serviceHandler"
import { toEther } from "@/lib/balance-format"
import { sendEmailRegisteredLab } from "@/lib/api/lab"
import rulesHandler from "@/constants/rules"


export default {
  name: "LabRegistrationServices",

  mixins: [
    serviceHandler
  ],

  components: { 
    List,
    Stepper,
    DialogAlert
  },

  data: () => ({
    serviceId: "",
    category: "",
    name: "",
    price: "",
    qcPrice: "",
    description: "",
    longDescription: "",
    imageUrl: "",
    testResultSampleUrl: "",
    files: [],
    testResultSampleFile:[],
    listCategories:[],
    sampleFiles:[],
    isLoading: false,
    isUploading: false,
    currencyList: ["DAI", "Ethereum"],
    currencyType: "DAI",
    listExpectedDuration: [
      {text: "Hours", value: "Hours"},
      {text: "Days", value: "Days"}
    ],
    selectExpectedDuration: "Days",
    expectedDuration: "",
    isEdit: false,
    stepperItems: [
      { name: "Lab Information", selected: true},
      { name: "Lab Services", selected: false}
    ],
    dialogAlert: false,
    biologicalType: "",
    listBiologicalType: [
      "Blood Cells - Dried Blood Spot Collection Process",
      "Epithelial Cells - Buccal Swab Collection Process",
      "Fecal Matters - Stool Collection Process",
      "Saliva - Saliva Collection Process",
      "Urine - Clean Catch Urine Collection Process"
    ],
    isBiomedical: false
  }),

  async mounted() {
    await this.getServiceCategory()
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      web3: (state) => state.metamask.web3,
      isLabExist: state => state.substrate.isLabAccountExist,
      isServicesExist: state => state.substrate.isServicesExist
    }),

    fieldRequiredRule() {
      return [
        rulesHandler.FIELD_REQUIRED
      ]
    },

    serviceNameRules() {
      return [
        rulesHandler.FIELD_REQUIRED,
        rulesHandler.ENGLISH_ALPHABET,
        rulesHandler.MAX_CHARACTER(50)
      ]
    },

    priceRules() {
      return [
        rulesHandler.FIELD_REQUIRED,
        val => (val && val != 0) || "Value on this field cannot 0",
        val => /^\d*(\.\d{0,3})?$/.test(val) || this.isBiomedical || "This field only allows 3 decimal characters."
      ]
    },
    
    cqPriceRules() {
      return [
        rulesHandler.FIELD_REQUIRED,
        val => /^\d*(\.\d{0,3})?$/.test(val) || this.isBiomedical || "This field only allows 3 decimal characters."
      ]
    },

    descriptionRules() {
      return [
        rulesHandler.FIELD_REQUIRED,
        rulesHandler.ENGLISH_ALPHABET,
        rulesHandler.MAX_CHARACTER(100)
      ]
    },

    longDescriptionRules() {
      return [
        rulesHandler.FIELD_REQUIRED,
        rulesHandler.ENGLISH_ALPHABET,
        rulesHandler.MAX_CHARACTER(255)

      ]
    },

    expectedDurationRules() {
      return [
        rulesHandler.FIELD_REQUIRED,
        val => (val && val != 0) || "Value on this field cannot 0"
      ]
    },

    fileInputRules() {
      return [
        value => !Array.isArray(value) || "This field is required",
        value => (!!value && value.size < 2000000) || "The total file size uploaded exceeds the maximum file size allowed (2MB)",
        value => (!!value && value.type === "application/pdf") || "The files uploaded are not in the supported file formats."
      ]
    }

  },

  methods: {

    async getServiceCategory() {
      const { data : data } = await getCategories()
      this.listCategories =  data
    },

    setDeleteLoading(isLoading){
      this.isLoading = isLoading
      if (!this.isServicesExist) {
        this.stepperItems = [
          { name: "Lab Information", selected: true},
          { name: "Lab Services", selected: false}
        ]
      }
    },

    gotoDashboard() {
      this.$router.push({ name: "lab-dashboard" })
    },

    async actionAlert() {
      const currentLab = await queryLabsById(this.api, this.wallet.address)

      if (this.isLabExist && currentLab.verificationStatus === "Unverified") {
        await sendEmailRegisteredLab(this.wallet.address)

        this.$store.dispatch("substrate/addAnyNotification", {
          address: this.wallet.address,
          dataAdd: {
            message: "Congrats! You have been submitted your account verification.",
            data: currentLab,
            route: null,
            params: null
          },
          role: "lab"
        })

        this.dialogAlert = true
      }
    },

    setServices() {
      this.$store.state.substrate.isServicesExist = true
    },

    clearServicesForm() {
      this.$refs.serviceForm.resetValidation()
      this.name = ""
      this.currencyType = "DAI"
      this.price = ""
      this.qcPrice = ""
      this.expectedDuration = ""
      this.selectExpectedDuration = "WorkingDays"
      this.category = ""
      this.description = ""
      this.testResultSampleUrl = ""
      this.longDescription = ""
      this.imageUrl = ""
      this.testResultSampleFile = []
      this.biologicalType = ""
    },

    async prefillServicesForm(service) {
      window.scrollTo({
        top: 100,
        behavior: "smooth"
      })

      const formatPrice = price => {
        return this.web3.utils.fromWei(String(price.replaceAll(",", ""), "ether"))
      }

      this.serviceId = service.id
      this.name = service.info.name
      this.currencyType = service.info.pricesByCurrency[0].currency.toUpperCase()
      this.price = formatPrice(service.info.pricesByCurrency[0].priceComponents[0].value)
      this.qcPrice = formatPrice(service.info.pricesByCurrency[0].additionalPrices[0].value)
      this.expectedDuration = service.info.expectedDuration.duration
      this.selectExpectedDuration = service.info.expectedDuration.durationType
      this.category = service.info.category
      this.biologicalType = service.info.dnaCollectionProcess
      this.description = service.info.description
      this.testResultSampleUrl = service.info.testResultSample
      this.longDescription = service.info.longDescription
      this.imageUrl = service.info.image

      const res = await fetch(service.info.testResultSample)
      const blob = await res.blob() // Gets the response and returns it as a blob
      const file = new File([blob], `${service.info.name} Test result sample`, {type: "application/pdf"})
      this.testResultSampleFile = file

      this.isEdit = true
    },

    async triggerCreateOrUpdate() {
      if(this.isLoading) return // If function already running return.
      if (!this.$refs.serviceForm.validate()) {
        return
      }
      this.isLoading = true
      
      if(this.isEdit) {
        await this.updateService()
        this.isEdit = false
        return
      }

      await this.handleCreateService()
    },

    async handleCreateService() {
      await this.dispatch(
        createService,
        this.api,
        this.wallet,
        {
          name: this.name,
          pricesByCurrency: [
            {
              currency: this.currencyType,
              totalPrice: await toEther(this.price + this.qcPrice),
              priceComponents: [
                {
                  component: "testing_price",
                  value: await toEther(this.price)
                }
              ],
              additionalPrices: [
                {
                  component: "qc_price",
                  value: await toEther(this.qcPrice)
                }
              ]
            }
          ],
          expectedDuration: { 
            duration: this.expectedDuration, 
            durationType: this.selectExpectedDuration
          },
          category: this.category,
          description: this.description,
          testResultSample: this.testResultSampleUrl,
          longDescription: this.longDescription,
          image: this.imageUrl,
          dnaCollectionProcess: this.biologicalType
        },
        "RequestTest",
        () => {
          this.setServices()
          this.clearServicesForm()

          this.isLoading = false
          this.stepperItems = [
            { name: "Lab Information", selected: true},
            { name: "Lab Services", selected: true}
          ]
        }
      )
    },

    async updateService() {
      await this.dispatch(
        updateService,
        this.api,
        this.wallet,
        this.serviceId,
        {
          name: this.name,
          pricesByCurrency: [
            {
              currency: this.currencyType,
              priceComponents: [
                {
                  component: "testing_price",
                  value: await toEther(this.price)
                }
              ],
              additionalPrices: [
                {
                  component: "qc_price",
                  value: await toEther(this.qcPrice)
                }
              ]
            }
          ],
          expectedDuration: { 
            duration: this.expectedDuration, 
            durationType: this.selectExpectedDuration
          },
          category: this.category,
          description: this.description,
          testResultSample: this.testResultSampleUrl,
          longDescription: this.longDescription,
          image: this.imageUrl,
          dnaCollectionProcess: this.biologicalType
        },
        () => {
          this.isLoading = false
          this.clearServicesForm()
        }
      )
    },

    async imageUploadEventListener(file) {
      if(!file || file.length === 0) {
        return
      }
      this.isUploading = true
      this.isLoading = true
      this.imageUrl = ""
      if (file) {
        if (file.name.lastIndexOf(".") <= 0) {
          return
        }
        const dataFile = await this.setupFileReader(file)

        const result = await uploadFile({
          title: dataFile.name,
          type: dataFile.type,
          file: dataFile
        })

        const link = getFileUrl(result.IpfsHash)

        this.imageUrl = link
        this.isUploading = false
        this.isLoading = false
      }
    },

    async fileUploadEventListener(file) {
      if (!file || file.size >= 2000000 || file.length === 0) {
        return
      }
      this.isUploading = true
      this.isLoading = true
      this.testResultSampleUrl = ""
      if (file) {
        if (file.name.lastIndexOf(".") <= 0) {
          return
        }
        const dataFile = await this.setupFileReader(file)

        const result = await uploadFile({
          title: dataFile.name,
          type: dataFile.type,
          file: dataFile
        })

        const link = getFileUrl(result.IpfsHash)

        this.testResultSampleUrl = link
        this.isUploading = false
        this.isLoading = false
      }
    },

    setupFileReader(value) {
      return new Promise((resolve, reject) => {
        const file = value
        const fr = new FileReader()

        fr.onload = async function () {
          resolve(value)
        }

        fr.onerror = reject

        fr.readAsArrayBuffer(file)
      })
    },

    selectPicture() {
      this.$refs.fileInput.$refs.input.click()
    }
  }
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
