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
                  v-model="email"
                ></v-text-field>
                
                <v-text-field
                  dense
                  label="Lab Name"
                  placeholder="Lab Name"
                  autocomplete="off"
                  outlined
                  :disabled="!isEditable"
                  :rules="nameRules"
                  v-model="labName"
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
                  v-model="country"
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
                  v-model="state"
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
                  v-model="city"
                  outlined
                ></v-autocomplete>
                
                <v-text-field
                  dense
                  label="Address"
                  placeholder="Address"
                  autocomplete="off"
                  outlined
                  v-model="address"
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
                      v-model="phoneNumber"
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
                  v-model="website"
                  :rules="websiteRules"
                  :disabled="!isEditable"
                ></v-text-field>

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
import { updateLab } from "@/lib/polkadotProvider/command/labs"
import { getLocations, getStates, getCities } from "@/lib/api"
import Kilt from "@kiltprotocol/sdk-js"
import { u8aToHex } from "@polkadot/util"
import Certification from "./Certification"
import { uploadFile, getFileUrl } from "@/lib/pinata-proxy"
import serviceHandler from "@/lib/metamask/mixins/serviceHandler"

const englishAlphabet = val => (val && /^[A-Za-z0-9!@#$%^&*\\(\\)\-_=+:;"',.\\/? ]+$/.test(val)) || "This field can only contain English alphabet"

export default {
  name: "LabAccount",
  mixins: [serviceHandler],

  components: { Certification },

  data: () => ({
    email: "",
    labName: "",
    address: "",
    phoneNumber: "",
    phoneCode: null,
    website: "",
    country: "",
    state: "",
    city: "",
    imageUrl: "",
    countries: [],
    states: [],
    cities: [],
    files: [],
    isEditable: false,
    isUploading: false
  }),

  computed: {
    ...mapGetters({
      api: "substrate/getAPI",
      pair: "substrate/wallet",
      labAccount: "substrate/labAccount"
    }),

    ...mapState({
      mnemonic: state => state.substrate.mnemonicData.mnemonic
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
      return !this.country && this.isLoading ? this.loadingPlaceholder : "Select Region"
    },

    computeStateLabel() {
      return !this.state && this.isLoading ? this.loadingPlaceholder : "Select State"
    },

    computeCityLabel() {
      return !this.city && this.isLoading ? this.loadingPlaceholder : "Select City"
    }
  },

  async mounted() {
    const labInfo = this.labAccount.info
    this.email = labInfo.email
    this.labName = labInfo.name
    this.address = labInfo.address
    this.phoneNumber = labInfo.phoneNumber
    this.website = labInfo.website
    this.imageUrl = labInfo.profileImage

    await this.getCountries()
    await this.onCountryChange(labInfo.country)
    await this.onStateChange(labInfo.region) // Region means the state, backend response got region instead state
    await this.onCityChange({ name: labInfo.city })

    const res = await fetch(this.imageUrl)
    const blob = await res.blob() // Gets the response and returns it as a blob
    const file = new File([blob], this.imageUrl?.split("/").pop() ?? "Profile Image File", { type: "image/jpeg" })
    this.files = file
  },

  methods: {
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
      this.state = ""
      this.city = ""

      const { data:
        { data }
      } = await this.dispatch(getStates, selected?.iso2 ?? selectedCountry)

      this.states = data;
      this.country = selected?.iso2 ?? selectedCountry
      this.phoneCode = selected?.phone_code ?? null
    },

    async onStateChange(selectedState) {
      this.city = ""

      const { data:
        { data }
      } = await this.dispatch(getCities, this.country, selectedState)

      this.state = selectedState;
      this.cities = data
    },

    onCityChange({ name }) {
      this.city = name;
    },

    getKiltBoxPublicKey() {
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonic)
      return u8aToHex(cred.boxKeyPair.publicKey)
    },

    async updateLab(){
      if (!this.$refs.form.validate()) {
        return
      }
      try{
        this.isLoading = true
        const boxPublicKey = this.getKiltBoxPublicKey()
        await updateLab(
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
            region: this.state, // Region means the state, backend parameter only accept region instead state
            city: this.city,
            profileImage: this.imageUrl
          },
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
