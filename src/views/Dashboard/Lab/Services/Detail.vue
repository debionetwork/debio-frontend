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
    <DialogErrorBalance
      :show="isShowError"
      @close="closeDialog"
    />
    <v-container>
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
                          :disabled="isLoading || isUploading"
                          @change="imageUploadEventListener" />
                      </v-avatar>

                  </div>
                    <label style="font-size: 12px;"> Test Category </label>
                    <v-select
                    dense
                    placeholder="Choose Category"
                    v-model="document.category"
                    outlined
                    :disabled="isLoading || isUploading"
                    :items="listCategories"
                    item-text="service_categories"
                    item-value="service_categories"
                    :rules="fieldRequiredRule"
                    ></v-select>

                    <label style="font-size: 12px;"> Type of Biological Sample </label>
                    <v-select
                    dense
                    placeholder="Choose type of Biological Sample"
                    v-model="document.dnaCollectionProcess"
                    outlined
                    :disabled="isLoading || isUploading"
                    :items="dnaCollectionProcessList"
                    item-text="name"
                    item-value="collectionProcess"
                    :rules="fieldRequiredRule"
                    ></v-select>

                    <label style="font-size: 12px;"> Service Name </label>  
                    <v-text-field
                      dense
                      placeholder="Example: BRCA Gene Test"
                      outlined
                      v-model="document.name"
                      :disabled="isLoading || isUploading"
                      :rules="[...fieldRequiredRule, ...serviceNameRules, ...fieldEnglishRules]"
                    ></v-text-field>

                    <div class="d-flex">
                      <v-row>
                        <v-col>
                          <label style="font-size: 12px;"> Price </label>
                          <v-select
                          placeholder="USDT"
                          outlined
                          dense
                          max="30"
                          v-model="document.currency"
                          :disabled="isLoading || isUploading"
                          :items="currencyList"
                          :rules="fieldRequiredRule"
                          ></v-select>
                        </v-col>

                        <v-col>
                          <v-text-field
                            class="mt-6"
                            dense
                            outlined
                            type="number"
                            min="0"
                            step=".001"
                            :hint="priceHint"
                            v-model.number="document.price"
                            :disabled="isLoading || isUploading"
                            :rules="[...fieldRequiredRule, ...decimalRule]"
                          ></v-text-field>
                        </v-col>

                        <v-col>
                          <label style="font-size: 12px;"> QC Price </label>
                          <v-select
                          :disabled="isBiomedical || isLoading || isUploading"
                          placeholder="USDT"
                          outlined
                          dense
                          v-model="document.currency"
                          :items="currencyList"
                          :rules="fieldRequiredRule"
                          ></v-select>
                        </v-col>

                        <v-col>
                          <v-text-field
                            class="mt-6"
                            :disabled="isBiomedical || isLoading || isUploading"
                            dense
                            outlined
                            type="number"
                            min="0"
                            step=".001"
                            :hint="qcPriceHint"
                            v-model.number="document.qcPrice"
                            :rules="[...fieldRequiredRule, ...decimalRule]"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </div>

                    <label style="font-size: 12px;"> Short Description </label>
                    <v-text-field
                      dense
                      label="Short Description"
                      placeholder="BRCA gene test for breast and ovarian cancer risk"
                      outlined
                      v-model="document.description"
                      :disabled="isLoading || isUploading"
                      :rules="[...fieldRequiredRule, ...descriptionRules, ...fieldEnglishRules]"
                    ></v-text-field>
                    
                    <v-row >
                      <v-col cols="8">
                        <label style="font-size: 12px;"> Maximum Duration </label>
                        <v-text-field
                          dense
                          placeholder="14"
                          max="30"
                          outlined
                          type="number"
                          v-model.number="document.duration"
                          :disabled="isLoading || isUploading"
                          :rules="fieldRequiredRule"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="4">
                        <label style="font-size: 12px;"> Duration Type </label>
                        <v-select
                          outlined
                          dense
                          v-model="document.durationType"
                          :disabled="isLoading || isUploading"
                          :items="listExpectedDuration"
                          :rules="fieldRequiredRule"
                        ></v-select>
                      </v-col>
                    </v-row>

                    <label style="font-size: 12px;"> Long Description </label>
                    <v-textarea
                      label="Long Description"
                      placeholder="Example: The BRCA gene test is a genetic test that uses DNA analysis to identify harmful changes (mutations) in either one of the two breast cancer susceptibility genes — BRCA1 and BRCA2."
                      outlined
                      v-model="document.longDescription"
                      :disabled="isLoading || isUploading"
                      :rules="fieldRequiredRule"
                    ></v-textarea>

                    <v-radio-group v-model="document.linkKit">
                      <v-radio label="Yes" value="yes"></v-radio>
                      <v-radio label="No" value="no"></v-radio>
                    </v-radio-group>

                    <label v-if="document.linkKit === 'yes'" style="font-size: 12px;"> Link to Purchase Kit </label>
                    <v-text-field
                      v-if="document.linkKit === 'yes'"
                      dense
                      :disabled="isLoading || isUploading"
                      placeholder="kithub.com/collection/genome-sequencing/"
                      prepend-icon="mdi-file-document"
                      outlined
                      v-model="kitPurchaseLink"
                    />

                    <label style="font-size: 12px;"> Test Result Sample </label>
                    <v-file-input
                      :disabled="isLoading || isUploading"
                      :rules="[...fieldRequiredRule, ...fileInputRules]"
                      accept=".pdf"
                      dense
                      label="Test Result Sample"
                      placeholder="Test Result Sample"
                      prepend-icon="mdi-file-document"
                      outlined
                      v-model="testResultSampleFile"
                      @change="fileUploadEventListener"
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
                      :disabled="isUploading"
                      :loading="isLoading"
                      @click="updateService"
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
import { mapGetters, mapState } from "vuex"
import { uploadFile, getFileUrl } from "@/lib/pinata-proxy"
import { getCategories, getConversionCache, getDNACollectionProcess } from "@/lib/api"
import { queryServicesById } from "@/lib/polkadotProvider/query/services";
import { fromEther, toEther } from "@/lib/balance-format"
import { updateService, updateServiceFee } from "@/lib/polkadotProvider/command/services"
import { generalDebounce } from "@/utils"
import DialogErrorBalance from "@/components/Dialog/DialogErrorBalance"

const englishAlphabet = val => (val && /^[A-Za-z0-9!@#$%^&*\\(\\)\-_=+:;"',.\\/? ]+$/.test(val)) || "This field can only contain English alphabet"

export default {
  name: "EditLabServices",

  components: { DialogErrorBalance },

  data: () => ({
    document: {
      category: "",
      dnaCollectionProcess: "",
      name: "",
      currency: "USN",
      price: 0,
      qcPrice: 0,
      description: "",
      longDescription: "",
      duration: "",
      durationType: "",
      linkKit: null
    },
    kitPurchaseLink: null,
    imageUrl: "",
    testResultSampleUrl: "",
    files: [],
    testResultSampleFile:[],
    isLoading: false,
    usdRate: 0,
    isUploading: false,
    currencyList: ["USN", "USDT"],
    currencyType: "",
    listExpectedDuration: ["Hours", "Days"],
    listCategories: [],
    selectExpectedDuration: "",
    dnaCollectionProcessList: [],
    isBiomedical: false,
    isShowError: false,
    fee: 0
  }),

  computed: {
    ...mapState({
      web3: (state) => state.metamask.web3
    }),

    ...mapGetters({
      api: "substrate/getAPI",
      pair: "substrate/wallet"
    }),

    priceHint() {
      return `${this.document.price} ${this.document.currency} = ${(this.usdRate * this.document.price).toFixed(4)} USD`
    },

    qcPriceHint() {
      return `${this.document.qcPrice} ${this.document.currency} = ${(this.usdRate * this.document.qcPrice).toFixed(4)} USD`
    },

    fieldRequiredRule() {
      return [
        val => !!val || "This field is required"
      ]
    },

    fieldEnglishRules() {
      return [ englishAlphabet ]
    },

    serviceNameRules() {
      return [
        val => (val && val.length <= 50) || "This field only allows 50 characters."
      ]
    },

    decimalRule() {
      return [
        val => /^\d*(\.\d{0,3})?$/.test(val) || this.isBiomedical || "This field only allows 3 decimal characters."
      ]
    },

    descriptionRules() {
      return [
        val => (val && val.length <= 100) || "This field only allows 100 characters."
      ]
    },

    fileInputRules() {
      return [
        value => !Array.isArray(value) || "This field is required",
        value => (!Array.isArray(value) && value?.size < 2000000) || "The total file size uploaded exceeds the maximum file size allowed (2MB)",
        value => (!Array.isArray(value) && value?.type === "application/pdf") || "The files uploaded are not in the supported file formats."
      ]
    }
  },

  watch: {
    category() {
      if (this.document.category == "Covid-19") {
        this.isBiomedical = true
        this.document.qcPrice = "0"
      } else {
        this.isBiomedical = false
      }
    },

    document: {
      deep: true,
      immediate: true,
      handler: generalDebounce( async function() {
        await this.getUpdateServiceFee()
      }, 500)
    },
    
    $route: {
      deep: true,
      immediate: true,
      handler: async function (val) {
        try {
          await this.getService(val.params.id)
        } catch (err) {
          console.error(err)
        }
      }
    }
  },

  async created(){
    this.dnaCollectionProcessList = (await getDNACollectionProcess()).data
    this.id = this.$route.params.id
    await this.getServiceCategory()
    await this.getService(this.$route.params.id)
    this.usdRate = await getConversionCache(this.document.currency, "USD")
  },

  methods: {
    async getService(sid) {
      const detailService = await queryServicesById(this.api, sid)
      const { category, description, dnaCollectionProcess, expectedDuration, image, longDescription, name, pricesByCurrency, testResultSample } = detailService.info

      this.document = {
        category,
        dnaCollectionProcess,
        name,
        description,
        longDescription: longDescription.split("||")[0],
        linkKit: longDescription.split("||")[1],
        currency: pricesByCurrency[0].currency,
        price: Number(await fromEther(pricesByCurrency[0].priceComponents[0].value.replaceAll(",", ""), pricesByCurrency[0].currency)),
        qcPrice: Number(await fromEther(pricesByCurrency[0].additionalPrices[0].value.replaceAll(",", ""), pricesByCurrency[0].currency)),
        duration: expectedDuration.duration,
        durationType: expectedDuration.durationType
      }
      this.imageUrl = image
      this.testResultSampleUrl = testResultSample

      if(this.imageUrl){
        fetch(this.imageUrl)
          .then(res => res.blob()) // Gets the response and returns it as a blob
          .then(blob => {
            this.files.push(new File([blob], this.imageUrl.substring(21)))
          });
      }

      if(this.testResultSampleUrl){
        await fetch(this.testResultSampleUrl)
          .then(res => res.blob()) // Gets the response and returns it as a blob
          .then(blob => {
            const fileName = this.testResultSampleUrl.split("/").pop()
            this.testResultSampleFile = new File([blob], fileName, { type: "application/pdf" })
          });
      }
    },

    async getServiceCategory() {
      const { data : data } = await getCategories()
      this.listCategories =  data
    },

    async getUpdateServiceFee() {
      const { category, dnaCollectionProcess, name, currency, price, qcPrice, description, longDescription, duration, durationType } = this.document
      const service = {
        name,
        pricesByCurrency: [{
          currency,
          totalPrice: await toEther(price + qcPrice, currency),
          priceComponents: [{
            component: "testing_price",
            value: await toEther(price, currency)
          }],
          additionalPrices: [{
            component: "qc_price",
            value: await toEther(qcPrice, currency)
          }]
        }],
        expectedDuration: { duration, durationType },
        category, description, longDescription, dnaCollectionProcess,
        image: this.imageUrl,
        testResultSample: this.testResultSampleUrl
      }
      const fee = await updateServiceFee(this.api, this.pair, this.$route.params.id, service)
      this.fee = this.web3.utils.fromWei(String(fee.partialFee), "ether")
    },

    closeDialog() {
      this.isShowError = false
    },

    async updateService() {
      if(this.isLoading) return // If function already running return.
      if (!this.$refs.addServiceForm.validate()) {
        return
      }
      this.isLoading = true

      const { category, dnaCollectionProcess, name, currency, price, qcPrice, description, longDescription, duration, durationType } = this.document
      const service = {
        name,
        pricesByCurrency: [{
          currency,
          totalPrice: await toEther(price + qcPrice, currency),
          priceComponents: [{
            component: "testing_price",
            value: await toEther(price, currency)
          }],
          additionalPrices: [{
            component: "qc_price",
            value: await toEther(qcPrice, currency)
          }]
        }],
        expectedDuration: { duration, durationType },
        category, description,
        longDescription: this.document.linkKit === "yes" ? longDescription + "||" + this.kitPurchaseLink : longDescription,
        dnaCollectionProcess,
        image: this.imageUrl,
        testResultSample: this.testResultSampleUrl
      }

      try {
        await updateService(
          this.api,
          this.pair,
          this.$route.params.id,
          service,
          () => {
            this.$router.push("/lab/services")
            this.isLoading = false
          }
        )
      } catch (err) {
        if (err.message === "1010: Invalid Transaction: Inability to pay some fees , e.g. account balance too low") {
          this.isShowError = true
        }
      }
    },

    async imageUploadEventListener(file) {
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
        this.imageUrl = link // this is an image file that can be sent to server... (convert img to file path)
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

    async fileUploadEventListener(file) {
      if (!file || file.size >= 2000000) {
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

        this.testResultSampleUrl = link // this is an image file that can be sent to server... (convert img to file path)
        this.isUploading = false
        this.isLoading = false
      }
    },

    selectPicture() {
      this.$refs.fileInput.$refs.input.click()
    }
  }
}
</script>
