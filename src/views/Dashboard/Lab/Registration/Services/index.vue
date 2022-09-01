<template>
  <div>
    <DialogErrorBalance
      :show="isShowError"
      @close="closeDialog"
    />
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
                        :disabled="isLoading || isUploading"
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
                  label="Test Category"
                  placeholder="Genome Sequencing"
                  v-model="document.category"
                  outlined
                  :items="listCategories"
                  :disabled="isLoading || isUploading"
                  item-text="service_categories"
                  item-value="service_categories"
                  :rules="fieldRequiredRule"
                  ></v-select>

                  <v-select
                    dense
                    label="Type of Biological Sample"
                    placeholder="SALIVA - SALIVA COLLECTION PROCESS"
                    v-model="document.dnaCollectionProcess"
                    outlined
                    :disabled="isLoading || isUploading"
                    :items="dnaCollectionProcessList"
                    item-text="name"
                    item-value="collectionProcess"
                    :rules="fieldRequiredRule"
                  ></v-select>
                  
                  <v-text-field
                    dense
                    label="Service Name"
                    placeholder="Service Name"
                    :disabled="isLoading || isUploading"
                    outlined
                    v-model="document.name"
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
                        :disabled="isLoading || isUploading"
                        v-model="document.currency"
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
                          v-model.number="document.price"
                          :hint="priceHint"
                          :disabled="isLoading || isUploading"
                          :rules="priceRules"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-select
                        label="QC Currency"
                        outlined
                        dense
                        v-model="document.currency"
                        :disabled="isLoading || isUploading"
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
                          :disabled="isLoading || isUploading"
                          :hint="qcPriceHint"
                          v-model.number="document.qcPrice"
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
                    v-model="document.description"
                    :disabled="isLoading || isUploading"
                    :rules="descriptionRules"
                  ></v-text-field>
                  
                  <v-row >
                    <v-col cols="8">
                      <v-text-field
                        dense
                        label="Maximum Duration"
                        placeholder="Maximum Duration"
                        min="0"
                        max="30"
                        outlined
                        type="number"
                        v-model.number="document.duration"
                        :disabled="isLoading || isUploading"
                        :rules="expectedDurationRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        label="Duration Type"
                        outlined
                        dense
                        v-model="document.durationType"
                        :disabled="isLoading || isUploading"
                        :items="listExpectedDuration"
                        :rules="fieldRequiredRule"
                      ></v-select>
                    </v-col>
                  </v-row>


                  <v-textarea
                    label="Long Description"
                    placeholder="Long Description"
                    outlined
                    v-model="document.longDescription"
                    :disabled="isLoading || isUploading"
                    :rules="longDescriptionRules"
                  ></v-textarea>

                  <v-file-input
                    :rules="fileInputRules"
                    :disabled="isLoading || isUploading"
                    accept="image/png, image/jpeg, image/bmp, application/pdf"
                    dense
                    label="Test Result Sample"
                    placeholder="Test Result Sample"
                    prepend-icon="mdi-file-document"
                    outlined
                    v-model="testResultSampleFile"
                    @change="fileUploadEventListener"
                    show-size
                  ></v-file-input>

                  <div class= "d-flex justify-space-between" >
                    <div class="mb-5">
                      <span
                        style="font-size: 12px"
                      > Estimated Transaction Weight </span>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              color="primary"
                              size="14"
                              v-bind="attrs"
                              v-on="on"
                            > mdi-alert-circle-outline
                            </v-icon>
                          </template>
                          <span style="font-size: 10px;">Total fee paid in DBIO to execute this transaction.</span>
                        </v-tooltip>
                    </div>
                    <span style="font-size: 12px;">
                      {{ Number(fee).toFixed(4) }} DBIO
                    </span>
                  </div>

                  <v-btn
                    color="primary"
                    block
                    large
                    :loading="isLoading || isUploading"
                    @click="triggerCreateOrUpdate"
                  >Save</v-btn>
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
            :loading="isSubmiting"
            @click="dialogStake = true"
          >proceed</v-btn>
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

    <DialogStake 
      :show="dialogStake" 
      @close="dialogStake = false" 
      @submit="handleStakeLab" 
      :loading="stakeLoading || isSubmiting" 
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import { uploadFile, getFileUrl } from "@/lib/pinata-proxy"
import { createService, updateService, createServiceFee, updateServiceFee } from "@/lib/polkadotProvider/command/services"
import { getCategories, getConversionCache, getDNACollectionProcess } from "@/lib/api"
import List from "./List"
import Stepper from "../Stepper"
import { stakeLab } from "@/lib/polkadotProvider/command/labs"
import DialogAlert from "@/components/Dialog/DialogAlert"
import DialogStake from "@/components/Dialog/DialogStake"
import serviceHandler from "@/mixins/serviceHandler"
import { toEther } from "@/lib/balance-format"
import { sendEmailRegisteredLab } from "@/lib/api/lab"
import rulesHandler from "@/constants/rules"
import { generalDebounce } from "@/utils"
import DialogErrorBalance from "@/components/Dialog/DialogErrorBalance"

export default {
  name: "LabRegistrationServices",

  mixins: [
    serviceHandler
  ],

  components: { 
    List,
    Stepper,
    DialogAlert,
    DialogErrorBalance,
    DialogStake
  },

  data: () => ({
    serviceId: "",
    currentDAIprice: 0,
    document: {
      category: "",
      dnaCollectionProcess: "",
      name: "",
      currency: "DAI",
      price: 0,
      qcPrice: 0,
      description: "",
      longDescription: "",
      duration: "",
      durationType: "Days"
    },
    imageUrl: "",
    testResultSampleUrl: "",
    files: [],
    testResultSampleFile:[],
    listCategories:[],
    sampleFiles:[],
    isLoading: false,
    isSubmiting: false,
    isUploading: false,
    currencyList: ["DAI", "Ethereum"],
    listExpectedDuration: [
      { text: "Working Days", value: "WorkingDays" },
      { text: "Hours", value: "Hours" },
      { text: "Days", value: "Days" }
    ],
    isEdit: false,
    stepperItems: [
      { name: "Lab Information", selected: true},
      { name: "Lab Services", selected: false}
    ],
    dialogAlert: false,
    dnaCollectionProcessList: [],
    isBiomedical: false,
    fee: 0,
    isShowError: false,
    dialogStake: false,
    stakeLoading: false
  }),

  async created() {
    this.dnaCollectionProcessList = (await getDNACollectionProcess()).data
    await this.getServiceCategory()
    const { daiToUsd } = await getConversionCache()
    this.currentDAIprice = daiToUsd ?? 1
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      web3: (state) => state.metamask.web3,
      isLabExist: state => state.substrate.isLabAccountExist,
      isServicesExist: state => state.substrate.isServicesExist,
      lastBlockData: (state) => state.substrate.lastBlockData
    }),

    ...mapGetters({
      pair: "substrate/wallet"
    }),

    priceHint() {
      return `${this.document.price} ${this.document.currency} = ${(this.currentDAIprice * this.document.price).toFixed(4)} USD`
    },

    qcPriceHint() {
      return `${this.document.qcPrice} ${this.document.currency} = ${(this.currentDAIprice * this.document.qcPrice).toFixed(4)} USD`
    },

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
        val => /^\d*(\.\d{0,4})?$/.test(val) || this.isBiomedical || "This field only allows 4 decimal characters."
      ]
    },
    
    cqPriceRules() {
      return [
        rulesHandler.FIELD_REQUIRED,
        val => /^\d*(\.\d{0,4})?$/.test(val) || this.isBiomedical || "This field only allows 4 decimal characters."
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
        rulesHandler.FIELD_REQUIRED
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

  watch: {
    document: {
      deep: true,
      immediate: true,
      handler: generalDebounce(async function() {
        await this.getFee()
      }, 500)
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

    async gotoDashboard() {
      await this.$store.dispatch("substrate/getLabAccount")
      this.$router.push({ name: "lab-dashboard" })
    },

    async handleStakeLab() {
      this.isSubmiting = true
      this.stakeLoading = true

      try {
        await stakeLab(this.api, this.pair)
        const {labAccount} = await this.$store.dispatch("substrate/getLabAccount")
        
        if (this.isLabExist && labAccount.verificationStatus === "Unverified") {
          await sendEmailRegisteredLab(this.wallet.address)

          this.$store.dispatch("substrate/addAnyNotification", {
            address: this.wallet.address,
            dataAdd: {
              message: "You've successfully submitted your account verification.",
              data: labAccount,
              route: null,
              params: null
            },
            block: this.lastBlockData?.block.header.number,
            role: "lab"
          })
        }
        this.dialogAlert = true
      } catch (error) {
        console.error(error)
      }

      this.isSubmiting = false
      this.stakeLoading = false
    },

    setServices() {
      this.$store.state.substrate.isServicesExist = true
    },

    clearServicesForm() {
      this.$refs.serviceForm.resetValidation()
      this.document = {
        category: "",
        dnaCollectionProcess: "",
        name: "",
        currency: "DAI",
        price: 0,
        qcPrice: 0,
        description: "",
        longDescription: "",
        duration: "",
        durationType: "Days"
      },
      this.testResultSampleFile = ""
      this.imageUrl = ""
      this.fee = 0
    },

    async prefillServicesForm(service) {
      window.scrollTo({
        top: 100,
        behavior: "smooth"
      })

      const formatPrice = price => {
        return this.web3.utils.fromWei(String(price.replaceAll(",", ""), "ether"))
      }

      const { category, description, dnaCollectionProcess, expectedDuration, image, longDescription, name, pricesByCurrency, testResultSample } = service.info
      this.serviceId = service.id

      this.document = { 
        category, 
        dnaCollectionProcess, 
        name, 
        description, 
        longDescription,
        currency: pricesByCurrency[0].currency,
        price: formatPrice(pricesByCurrency[0].priceComponents[0].value),
        qcPrice: formatPrice(pricesByCurrency[0].additionalPrices[0].value),
        duration: expectedDuration.duration,
        durationType: expectedDuration.durationType
      }

      this.testResultSampleUrl = testResultSample
      this.imageUrl = image

      const res = await fetch(testResultSample)
      const blob = await res.blob() // Gets the response and returns it as a blob
      const file = new File([blob], `${name} Test result sample`, {type: "application/pdf"})
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

    async getFee() {
      const { category, dnaCollectionProcess, name, currency, price, qcPrice, description, longDescription, duration, durationType } = this.document
      const newService = {
        name,
        pricesByCurrency: [{
          currency,
          totalPrice: await toEther(price + qcPrice),
          priceComponents: [{
            component: "testing_price",
            value: await toEther(price)
          }],
          additionalPrices: [{
            component: "qc_price",
            value: await toEther(qcPrice)
          }]
        }],
        expectedDuration: { duration, durationType },
        category, description, longDescription, dnaCollectionProcess,
        image: this.imageUrl,
        testResultSample: this.testResultSampleUrl
      }

      let fee
      if (this.isEdit){
        fee = await updateServiceFee(this.api, this.wallet, this.serviceId, newService)
        this.fee = this.web3.utils.fromWei(String(fee.partialFee), "ether")
        return
      }

      fee = await createServiceFee(this.api, this.wallet, newService)
      this.fee = this.web3.utils.fromWei(String(fee.partialFee), "ether")
    },

    async handleCreateService() {
      const flow = "RequestTest"
      const { category, dnaCollectionProcess, name, currency, price, qcPrice, description, longDescription, duration, durationType } = this.document
      const newService = {
        name,
        pricesByCurrency: [{
          currency,
          totalPrice: await toEther(price + qcPrice),
          priceComponents: [{
            component: "testing_price",
            value: await toEther(price)
          }],
          additionalPrices: [{
            component: "qc_price",
            value: await toEther(qcPrice)
          }]
        }],
        expectedDuration: { duration, durationType },
        category, description, longDescription, dnaCollectionProcess,
        image: this.imageUrl,
        testResultSample: this.testResultSampleUrl
      }
      try {
        await this.dispatch(
          createService, this.api, this.wallet, newService, flow, () => {
            this.setServices()
            this.clearServicesForm()

            this.isLoading = false
            this.stepperItems = [
              { name: "Lab Information", selected: true},
              { name: "Lab Services", selected: true}
            ]
          }
        )
      } catch (err) {
        if (err.message === "1010: Invalid Transaction: Inability to pay some fees , e.g. account balance too low") {
          this.isShowError = true
        }
      }
    },

    closeDialog() {
      this.isShowError = false
    },

    async updateService() {
      const { category, dnaCollectionProcess, name, currency, price, qcPrice, description, longDescription, duration, durationType } = this.document
      const newService = {
        name,
        pricesByCurrency: [{
          currency,
          totalPrice: await toEther(price + qcPrice),
          priceComponents: [{
            component: "testing_price",
            value: await toEther(price)
          }],
          additionalPrices: [{
            component: "qc_price",
            value: await toEther(qcPrice)
          }]
        }],
        expectedDuration: { duration, durationType },
        category, description, longDescription, dnaCollectionProcess,
        image: this.imageUrl,
        testResultSample: this.testResultSampleUrl
      }

      await this.dispatch( updateService, this.api, this.wallet, this.serviceId, newService, () => {
        this.clearServicesForm()
        this.isLoading = false
      })
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
          size: dataFile.size,
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
          size: dataFile.size,
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
