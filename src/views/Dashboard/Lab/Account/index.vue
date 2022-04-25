<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-text class="px-8 mt-5">
              <div class="d-flex justify-space-between align-center">
                <div class="secondary--text text-h6">
                  <b>Lab Account Information</b>
                </div>
                <v-btn small dark color="#75DEE4" fab style="border-radius:10px;" @click="isEditable = !isEditable">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </div>

              <v-form class="mt-5" ref="form">
                <v-container :class="imageUrl ? 'mb-2 d-flex align-center' : ''">
                  <v-avatar
                    class="mr-2"
                    rounded
                    size="150"
                    v-if="imageUrl">
                    <img :src="imageUrl" />
                  </v-avatar>
                  <v-file-input
                    dense
                    label="Logo Image"
                    prepend-icon="mdi-image"
                    outlined
                    :disabled="!isEditable"
                    @change="fileUploadEventListener"
                    :rules="rules"
                    v-model="files"
                    show-size
                  ></v-file-input>
                </v-container>

                <v-text-field
                  dense
                  label="Email"
                  placeholder="Email"
                  autocomplete="off"
                  outlined
                  :disabled="!isEditable"
                  :rules="emailRules"
                  v-model="document.email"
                ></v-text-field>
                
                <v-text-field
                  dense
                  label="Lab Name"
                  placeholder="Lab Name"
                  autocomplete="off"
                  outlined
                  :disabled="!isEditable"
                  :rules="nameRules"
                  v-model="document.name"
                ></v-text-field>

                <v-autocomplete
                  dense
                  :items="countries"
                  item-text="name"
                  item-value="iso2"
                  @change="onCountryChange"
                  return-object
                  :label="computeCountryLabel"
                  autocomplete="off"
                  v-model="document.country"
                  disabled
                  :rules="isRequired"
                  outlined
                ></v-autocomplete>

                <v-autocomplete
                  dense
                  :items="states"
                  item-text="name"
                  item-value="state_code"
                  @change="onStateChange"
                  :label="computeStateLabel"
                  disabled
                  :rules="isRequired"
                  autocomplete="off"
                  v-model="document.region"
                  outlined
                ></v-autocomplete>

                <v-autocomplete
                  dense
                  :items="cities"
                  item-text="name"
                  item-value="name"
                  return-object
                  @change="onCityChange"
                  :label="computeCityLabel"
                  disabled
                  :rules="isRequired"
                  autocomplete="off"
                  v-model="document.city"
                  outlined
                ></v-autocomplete>
                
                <v-text-field
                  dense
                  label="Address"
                  placeholder="Address"
                  autocomplete="off"
                  outlined
                  v-model="document.address"
                  disabled
                  :rules="addressRules"
                ></v-text-field>

                <v-row>
                  <v-col md="3" class="pr-0">
                    <v-autocomplete
                      dense
                      return-object
                      :items="countries"
                      item-text="phone_code"
                      item-value="phone_code"
                      label="Phone code"
                      outlined
                      v-model="phoneCode"
                      :disabled="!isEditable"
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
                      :disabled="!isEditable"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-text-field
                  dense
                  label="Website"
                  placeholder="Website"
                  autocomplete="off"
                  outlined
                  v-model="document.website"
                  :rules="websiteRules"
                  :disabled="!isEditable"
                ></v-text-field>

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
                  :disabled="isUploading || !isEditable"
                  @click="updateLab"
                >Submit</v-btn>
              </v-form>
            </v-card-text>
          </v-card>

          <Certification />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import { updateLab, updateLabFee } from "@/lib/polkadotProvider/command/labs"
import { getLocations, getStates, getCities } from "@/lib/api"
import Kilt from "@kiltprotocol/sdk-js"
import CryptoJS from "crypto-js"
import { u8aToHex } from "@polkadot/util"
import Certification from "./Certification"
import { uploadFile, getFileUrl } from "@/lib/pinata-proxy"
import serviceHandler from "@/lib/metamask/mixins/serviceHandler"
import { generalDebounce } from "@/utils"

const englishAlphabet = val => (val && /^[A-Za-z0-9!@#$%^&*\\(\\)\-_=+:;"',.\\/? ]+$/.test(val)) || "This field can only contain English alphabet"

export default {
  name: "LabAccount",
  mixins: [serviceHandler],

  components: { Certification },

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
    phoneCode: null,
    imageUrl: "",
    countries: [],
    states: [],
    cities: [],
    files: [],
    isEditable: false,
    isUploading: false,
    verificationStatus: "",
    isVerify: false,
    fee: 0
  }),

  computed: {
    ...mapGetters({
      api: "substrate/getAPI",
      pair: "substrate/wallet",
      labAccount: "substrate/labAccount"
    }),

    ...mapState({
      mnemonic: state => state.substrate.mnemonicData,
      web3: state => state.metamask.web3
    }),

    citiesSelection() {
      return this.cities
        .filter((c) => c.country == this.country)
        .map((c) => ({ value: c.city, text: c.city, country: c.country }));
    },
    
    rules(){
      return [
        file => !file || file.size <= 3_097_152 || "The total file size uploaded exceeds the maximum file size allowed (3MB)",
        file => !file || file.type == "image/jpg" || file.type == "image/jpeg" || "Document type should be image/jpg/jpeg"
      ]
    },

    isRequired () {
      return [
        val => !!val || "This field is required"
      ]
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
        englishAlphabet,
        val => /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/.test(val) || "This field can only contain number",
        val => (val && val.length <= 12) || "This field only allows 12 characters"
      ]
    },

    websiteRules() {
      return [
        val => !!val || "This field is required",
        val => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&/=]*)/.test(val) || "Website is invalid. It should contain protocol (https://) followed by a domain",
        val => (val && val.length <= 255) || "This field only allows 255 characters"
      ]
    },

    computeCountryLabel() {
      return !this.document.country && this.isLoading ? this.loadingPlaceholder : "Select Country"
    },

    computeStateLabel() {
      return !this.document.region && this.isLoading ? this.loadingPlaceholder : "Select State"
    },

    computeCityLabel() {
      return !this.document.city && this.isLoading ? this.loadingPlaceholder : "Select City"
    }
  },

  watch: {
    mnemonic(val) {
      if (val) this.getKiltBoxPublicKey()
    },

    document: {
      deep: true,
      immediate: true,
      handler: generalDebounce(async function() {
        if (this.mnemonic) await this.getUpdateLabFee()
      }, 500)
    }
  },

  async created() {
    await this.getLabInfo()
  },

  methods: {
    async getLabInfo() {
      const { address, city, country, email, name, phoneNumber, profileImage, region, website } = this.labAccount.info
      this.document = { 
        name, 
        email, 
        address, 
        phoneNumber, 
        website
      }

      this.verificationStatus = this.labAccount.verificationStatus

      await this.getCountries()
      await this.onCountryChange(country)
      await this.onStateChange(region)
      await this.onCityChange({ name: city})
      this.imageUrl = profileImage

      const res = await fetch(this.imageUrl)
      const blob = await res.blob() // Gets the response and returns it as a blob
      const file = new File([blob], this.imageUrl?.split("/").pop() ?? "Profile Image File", { type: "image/jpeg" })
      this.files = file
    },

    async getCountries() {
      const { data:
        { data }
      } = await this.dispatch(getLocations)

      this.countries = data;
    },

    async onCountryChange(selectedCountry) {
      const selected = typeof selectedCountry !== "string"
        ? selectedCountry
        : this.countries.find(country => country.iso2 === selectedCountry)
      this.document.region = ""
      this.document.city = ""

      const { data:
        { data }
      } = await this.dispatch(getStates, selected?.iso2 ?? selectedCountry)

      this.states = data;
      this.document.country = selected?.iso2 ?? selectedCountry
      this.phoneCode = selected?.phone_code ?? null
    },

    async onStateChange(selectedState) {
      this.document.city = ""

      const { data:
        { data }
      } = await this.dispatch(getCities, this.document.country, selectedState)

      this.document.region = selectedState;
      this.cities = data
    },

    onCityChange({ name }) {
      this.document.city = name;
    },

    getKiltBoxPublicKey() {
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonic.toString(CryptoJS.enc.Utf8))
      return u8aToHex(cred.boxKeyPair.publicKey)
    },

    async getUpdateLabFee() {
      const boxPublicKey = this.getKiltBoxPublicKey()
      const { name, email, address, phoneNumber, website, country, city, region } = this.document
      const fee = await updateLabFee(
        this.api, this.pair, { boxPublicKey, name, email, address, phoneNumber, website, country, city, region, profileImage: this.imageUrl}
      )

      this.fee = this.web3.utils.fromWei(String(fee.partialFee), "ether")
    },

    async updateLab(){
      if (!this.$refs.form.validate()) {
        return
      }
      try{
        this.isLoading = true
        const boxPublicKey = this.getKiltBoxPublicKey()
        const { name, email, address, phoneNumber, website, country, city, region } = this.document

        await updateLab(
          this.api, this.pair, { boxPublicKey, name, email, address, phoneNumber, country, website, region, city, profileImage: this.imageUrl },
          () => {
            this.isLoading = false
            this.isEditable = false
          }
        )
      }
      catch(err){
        console.error(err)
      }
    },
    
    async fileUploadEventListener(file) {
      this.imageUrl = ""
      if (!this.$refs.form.validate()) {
        return
      }
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
        this.files = []
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
    }
  }
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
.support-url{
  text-decoration: none;
  color: gray;
}
</style>
