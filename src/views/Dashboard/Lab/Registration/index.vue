<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="7">
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-text class="px-8 mt-5">
              <v-form
                lazy-validation
                ref="labForm">
              <v-text-field
                dense
                label="Email on registration"
                placeholder="Email"
                outlined
                v-model="document.email"
                :disabled="isLabAccountExist"
                :rules="emailRules"
                ></v-text-field>
              
              <v-text-field
                dense
                label="Lab Name"
                placeholder="Lab Name"
                outlined
                v-model="document.name"
                :disabled="isLabAccountExist"
                :rules="nameRules"
                ></v-text-field>

              <v-autocomplete
                dense
                :items="countries"
                item-text="name"
                item-value="iso2"
                @change="onCountryChange"
                return-object
                :label="computeCountryLabel"
                outlined
                v-model="document.country"
                :disabled="isLabAccountExist"
                :rules="[val => !!val || 'This field is required']"
              ></v-autocomplete>

              <v-autocomplete
                dense
                :items="states"
                item-text="name"
                item-value="state_code"
                @change="onStateChange"
                :label="computeStateLabel"
                :disabled="!document.country || isLabAccountExist"
                outlined
                v-model="document.region"
                :rules="[val => !!val || 'This field is required']"
              ></v-autocomplete>

              <v-autocomplete
                dense
                :items="cities"
                item-text="name"
                item-value="name"
                return-object
                @change="onCityChange"
                :label="computeCityLabel"
                :disabled="!document.region || isLabAccountExist"
                outlined
                v-model="document.city"
                :rules="[val => !!val || 'This field is required']"
              ></v-autocomplete>

              <v-text-field
                dense
                label="Address"
                placeholder="Address"
                outlined
                v-model="document.address"
                :rules="addressRules"
                :disabled="isLabAccountExist"
              ></v-text-field>
              <v-row>
                <v-col md="3" class="pr-0">
                  <v-autocomplete
                    dense
                    @change="onPhoneCodeChange"
                    return-object
                    :items="countries"
                    item-text="phone_code"
                    item-value="phone_code"
                    label="Phone code"
                    outlined
                    v-model="document.phoneCode"
                    :disabled="isLabAccountExist"
                    :rules="[val => !!val || 'Phone code is Required']"
                  ></v-autocomplete>
                </v-col>
                <v-col>
                  <v-text-field
                    dense
                    label="Phone Number"
                    placeholder="Phone Number"
                    outlined
                    v-model="document.phoneNumber"
                    :rules="phoneNumberRules"
                    :disabled="isLabAccountExist"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-text-field
                dense
                label="Website"
                placeholder="Website"
                outlined
                v-model="document.website"
                :rules="websiteRules"
                :disabled="isLabAccountExist"
              ></v-text-field>

                <v-file-input
                  dense
                  label="Profile Image"
                  placeholder="Profile Image"
                  prepend-icon="mdi-image"
                  outlined
                  v-model="files"
                  :rules="fileInputRules"
                  :disabled="isLabAccountExist"
                  show-size
                  accept="image/png, image/jpeg"
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
                  :disabled="isLabAccountExist"
                  :loading="isLoading && !isLabAccountExist"
                  @click="registerLab"
                >Submit</v-btn>
              </v-form>
            </v-card-text>
          </v-card>

          <Certification />

          <v-btn
            :disabled="!isLabAccountExist"
            color="primary"
            block
            large
            class="mt-5 mb-3"
            @click="gotoServicesPage"
          >Next</v-btn>
        </v-col>
        <v-col cols="5">
          <Stepper
            stepper-description="You need to complete all the steps to verify your account"
            :stepper-items="stepperItems"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import { registerLab, registerLabFee } from "@/lib/polkadotProvider/command/labs"
import { uploadFile, getFileUrl } from "@/lib/pinata-proxy"
import Certification from "./Certification"
import Stepper from "./Stepper"
import { getLocations, getStates, getCities } from "@/lib/api"
import serviceHandler from "@/lib/metamask/mixins/serviceHandler"
import Kilt from "@kiltprotocol/sdk-js"
import CryptoJS from "crypto-js"
import { u8aToHex } from "@polkadot/util"
import { generalDebounce } from "@/utils"


const englishAlphabet = val => (val && /^[A-Za-z0-9!@#$%^&*\\(\\)\-_=+:;"',.\\/? ]+$/.test(val)) || "This field can only contain English alphabet"

export default {
  name: "LabRegistration",

  mixins: [serviceHandler],

  components: { 
    Certification,
    Stepper  
  },

  async mounted() {
    await this.getCountries();
    await this.setData();
  },

  data: () => ({
    document: {
      name: "",
      email: "",
      address: "",
      phoneNumber: "",
      website: "",
      country: "",
      region: "",
      city: ""
    },
    boxPublicKey: null,
    countries: [],
    cities: [],
    states: [],
    phoneCode: "",
    files: null,
    isLoading: false,
    isUploading: false,
    fee: 0,
    stepperItems: [
      { name: "Lab Information", selected: false},
      { name: "Lab Services", selected: false}
    ]
  }),

  computed: {
    ...mapGetters({
      api: "substrate/getAPI",
      pair: "substrate/wallet",
      labAccount: "substrate/labAccount",
      isLabAccountExist: "substrate/isLabAccountExist"
    }),

    ...mapState({
      web3: (state) => state.metamask.web3,
      mnemonicData: state => state.substrate.mnemonicData
    }),

    citiesSelection() {
      return this.cities
        .filter((c) => c.country == this.document.country)
        .map((c) => ({ value: c.city, text: c.city, country: c.country }));
    },

    selectedLab() {
      if (!this.labAccount) {
        return;
      }
      return this.labs.filter((l) => l.labAccount == this.labAccount)[0];
    },

    emailRules() {
      return [
        val => !!val || "This field is required",
        val => /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(val) || "Email is invalid. It should contain @ followed by a domain",
        val => (val && val.length <= 255) || "This field only allows 255 characters",
        val => (val && /^[A-Za-z0-9 ]?[A-Za-z0-9@. ]+$/.test(val)) || "This field only allows Alphabetic characters."
      ]
    },

    nameRules() {
      return [
        val => !!val || "This field is required",
        val => (val && val.length <= 100) || "This field only allows 100 characters",
        englishAlphabet
      ]
    },

    addressRules() {
      return [
        val => !!val || "This field is required",
        val => (val && val.length <= 255) || "This field only allows 255 characters",
        englishAlphabet
      ]
    },

    phoneNumberRules() {
      return [
        val => !!val || "This field is required",
        val => /^\+?([0-9]{10,15})$/.test(val) || "This field can only contain number",
        val => (val && val.length <= 12) || "This field only allows 12 characters"
      ]
    },

    websiteRules() { 
      return [
        val => !!val || "This field is required",
        englishAlphabet,
        val => (val && val.length <= 255) || "This field only allows 255 characters",
        val => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&/=]*)/.test(val) || "Website is invalid. It should contain protocol (https://) followed by a domain"
      ]
    },

    fileInputRules() {
      return [
        value => !!value || "This field is required",
        value => (value && value.size < 2000000) || "The total file size uploaded exceeds the maximum file size allowed (2MB)"
      ]
    },

    computeCountryLabel() {
      return !this.document.country && this.isLoading ? this.loadingPlaceholder : "Select Country"
    },

    computeStateLabel() {
      return !this.document.region && this.isLoading ? this.loadingPlaceholder : "Select State/Province"
    },

    computeCityLabel() {
      return !this.document.city && this.isLoading ? this.loadingPlaceholder : "Select City"
    }
  },

  watch: {
    document: {
      deep: true,
      immediate: true,
      handler: generalDebounce(async function() {
        await this.getRegisterLabFee()
      }, 500)
    }
  },

  async created() {
    if (this.mnemonicData) this.initialData()
  },

  methods: {
    initialData(){
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))
      this.boxPublicKey = u8aToHex(cred.boxKeyPair.publicKey)
    },

    gotoServicesPage() {
      this.$router.push({ name: "lab-registration-services" })
    },

    async setData() {
      if(this.isLabAccountExist){
        this.labName = this.labAccount.info.name
        this.email = this.labAccount.info.email
        this.address = this.labAccount.info.address
        this.phoneNumber = this.labAccount.info.phoneNumber
        this.website = this.labAccount.info.website
        this.document.country = this.labAccount.info.country
        await this.onCountryChange(this.document.country)
        this.document.region = this.labAccount.info.region
        await this.onStateChange(this.labAccount.info.region) // Region means the state, backend response got region instead state
        this.document.city = this.labAccount.info.city
        await this.onCityChange({ name: this.labAccount.info.city })
        this.imageUrl = this.labAccount.info.profileImage

        const res = await fetch(this.imageUrl)
        const blob = await res.blob() // Gets the response and returns it as a blob
        const file = new File([blob], this.imageUrl.substring(21), {type: "image/jpeg"})
        this.files = file
      }
    },

    setLabAccount(labAccount) {
      this.$store.state.substrate.labAccount = labAccount
      this.$store.state.substrate.isLabAccountExist = true
    },

    async getCountries() {
      const { data:
        { data }
      } = await this.dispatch(getLocations)

      this.countries = data;
    },

    async onCountryChange(selectedCountry) {
      this.document.region = ""
      this.document.city = ""

      const { data:
        { data }
      } = await this.dispatch(getStates, selectedCountry?.iso2 ?? selectedCountry)

      this.states = data;
      this.document.country = selectedCountry?.iso2 ?? selectedCountry;
      this.document.phoneCode = selectedCountry?.phone_code ?? null;
    },

    async onPhoneCodeChange(selectedCountry) {
      await this.onCountryChange(selectedCountry)
    },

    async onStateChange(selectedState) {
      this.document.city = ""

      const { data:
        { data }
      } = await this.dispatch(getCities, this.document.country, selectedState)

      this.cities = data;
      this.document.region = selectedState;
    },

    onCityChange({ name }) {
      this.document.city = name;
    },

    async registerLab(){

      if (!this.validating()) {
        return
      }
      try{
        const { name, email, address, phoneNumber, website, country, city, region } = this.document
        this.isLoading = true

        await this.fileUploadEventListener(this.files)
        await registerLab(
          this.api,
          this.pair,
          {
            boxPublicKey: this.boxPublicKey,
            name,
            email,
            address,
            phoneNumber,
            website,
            country,
            region,
            city,
            profileImage: this.imageUrl
          },
          async () => {
            const labAccount = {
              accountId: this.pair.address,
              services: [],
              certifications: [],
              info: {
                boxPublicKey: this.boxPublicKey,
                name,
                email,
                address,
                country,
                city: city,
                profileImage: this.imageUrl
              }
            }
            this.setLabAccount(labAccount)
            this.stepperItems = [
              { name: "Lab Information", selected: true},
              { name: "Lab Services", selected: false}
            ]
          }
        )
      }
      catch(e){
        console.error(e)
      }
    },

    async fileUploadEventListener(file) {
      if (file && file.name) {
        if (file.name.lastIndexOf(".") <= 0) {
          return
        }
        this.isUploading = true

        const dataFile = await this.setupFileReader(file)

        const result = await uploadFile({
          title: dataFile.name,
          type: dataFile.type,
          file: dataFile
        })

        const link = getFileUrl(result.IpfsHash)

        this.imageUrl = link
        this.isUploading = false
      }
      else {
        this.files = null
        this.imageUrl = ""
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

    validating() {
      if (this.document.name == "" || this.document.email == "" || this.document.address == "" || this.document.country == "" || this.document.city == "" || this.document.state == "" || this.files == null) {
        this.$refs.labForm.validate()
        return false
      }
      return true
    },

    async getRegisterLabFee() {
      const { name, email, address, phoneNumber, website, country, city, region } = this.document
      const txWeight = await registerLabFee(
        this.api,
        this.pair,
        {
          boxPublicKey: this.boxPublicKey,
          name,
          email,
          address,
          phoneNumber,
          website,
          country,
          region,
          city,
          profileImage: this.imageUrl
        }
      )
      this.fee = this.web3.utils.fromWei(String(txWeight.partialFee), "ether")
    }
  }
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
