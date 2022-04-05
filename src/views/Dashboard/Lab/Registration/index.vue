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
                label="Email"
                placeholder="Email"
                outlined
                v-model="email"
                :disabled="isLabAccountExist"
                :rules="emailRules"
                ></v-text-field>
              
              <v-text-field
                dense
                label="Lab Name"
                placeholder="Lab Name"
                outlined
                v-model="labName"
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
                v-model="country"
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
                :disabled="!country || isLabAccountExist"
                outlined
                v-model="state"
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
                :disabled="!state || isLabAccountExist"
                outlined
                v-model="city"
                :rules="[val => !!val || 'This field is required']"
              ></v-autocomplete>

              <v-text-field
                dense
                label="Address"
                placeholder="Address"
                outlined
                v-model="address"
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
                    v-model="phoneCode"
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
                    v-model="phoneNumber"
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
                v-model="website"
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

                <v-btn
                  color="primary"
                  block
                  large
                  :disabled="isUploading || isLabAccountExist"
                  :loading="isLoading || isUploading"
                  @click="registerLab"
                >Submit</v-btn>
              </v-form>
            </v-card-text>
          </v-card>

          <Certification />

          <v-btn
            :disabled="!isLabAccountExist"
            :loading="isLoading || isUploading"
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
import { registerLab } from "@/lib/polkadotProvider/command/labs"
// import { upload } from "@/lib/ipfs"
import { uploadFile, getFileUrl } from "@/lib/pinata-proxy"
import Certification from "./Certification"
import Stepper from "./Stepper"
import { getLocations, getStates, getCities } from "@/lib/api"
import serviceHandler from "@/lib/metamask/mixins/serviceHandler"
import Kilt from "@kiltprotocol/sdk-js"
import CryptoJS from "crypto-js"
import { u8aToHex } from "@polkadot/util"

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
    country: "",
    state: "",
    city: "",
    countries: [],
    cities: [],
    states: [],
    email: "",
    labName: "",
    address: "",
    phoneCode: "",
    phoneNumber: "",
    website: "",
    imageUrl: "",
    files: null,
    isLoading: false,
    isUploading: false,
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
      mnemonicData: state => state.substrate.mnemonicData
    }),

    citiesSelection() {
      return this.cities
        .filter((c) => c.country == this.country)
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
        value => !!value.size || "This field is required",
        value => value.size < 2000000 || "The total file size uploaded exceeds the maximum file size allowed (2MB)"
      ]
    },

    computeCountryLabel() {
      return !this.country && this.isLoading ? this.loadingPlaceholder : "Select Country"
    },

    computeStateLabel() {
      return !this.state && this.isLoading ? this.loadingPlaceholder : "Select State/Province"
    },

    computeCityLabel() {
      return !this.city && this.isLoading ? this.loadingPlaceholder : "Select City"
    }
  },

  methods: {
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
        this.country = this.labAccount.info.country
        await this.onCountryChange(this.country)
        this.state = this.labAccount.info.region
        await this.onStateChange(this.labAccount.info.region) // Region means the state, backend response got region instead state
        this.city = this.labAccount.info.city
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
      this.state = ""
      this.city = ""

      const { data:
        { data }
      } = await this.dispatch(getStates, selectedCountry?.iso2 ?? selectedCountry)

      this.states = data;
      this.country = selectedCountry?.iso2 ?? selectedCountry;
      this.phoneCode = selectedCountry?.phone_code ?? null;
    },

    async onPhoneCodeChange(selectedCountry) {
      await this.onCountryChange(selectedCountry)
    },

    async onStateChange(selectedState) {
      this.city = ""

      const { data:
        { data }
      } = await this.dispatch(getCities, this.country, selectedState)

      this.cities = data;
      this.state = selectedState;
    },

    onCityChange({ name }) {
      this.city = name;
    },

    async registerLab(){
      if (!this.validating()) {
        return
      }
      try{
        this.isLoading = true
        const cred = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))
        const boxPublicKey = u8aToHex(cred.boxKeyPair.publicKey)

        await this.fileUploadEventListener(this.files)
        await registerLab(
          this.api,
          this.pair,
          {
            boxPublicKey,
            name: this.labName,
            email: this.email,
            address: this.address,
            phoneNumber: this.phoneNumber,
            website: this.website,
            country: this.country,
            region: this.state,
            city: this.city,
            profileImage: this.imageUrl
          },
          async () => {
            this.isLoading = false
            const labAccount = {
              accountId: this.pair.address,
              services: [],
              certifications: [],
              info: {
                boxPublicKey,
                name: this.labName,
                email: this.email,
                address: this.address,
                country: this.country,
                city: this.city,
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
        this.isLoading = true

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
      if (this.labName == "" || this.email == "" || this.address == "" || this.country == "" || this.city == "" || this.state == "") {
        this.$refs.labForm.validate()
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
