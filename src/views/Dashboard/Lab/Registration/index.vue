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
                :label="computeCountryLabel"
                outlined
                v-model="country"
                :disabled="isLabAccountExist"
                :rules="[val => !!val || 'Country is Required']"
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
                :rules="[val => !!val || 'Region is Required']"
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
                :rules="[val => !!val || 'City is Required']"
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

              <v-text-field
                dense
                label="Phone Number"
                placeholder="Phone Number"
                outlined
                v-model="phoneNumber"
                :rules="phoneNumberRules"
                :disabled="isLabAccountExist"
              ></v-text-field>

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
                  @change="fileUploadEventListener"
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
import { setEthAddress } from "@/lib/polkadotProvider/command/userProfile"
import { getWalletAddress } from "@/lib/metamask/wallet"
import { upload } from "@/lib/ipfs"
import Certification from "./Certification"
import Stepper from "./Stepper"
import { getLocations, getStates, getCities } from "@/lib/location"
import serviceHandler from "@/lib/metamask/mixins/serviceHandler"


export default {
  name: 'LabRegistration',

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
    phoneNumber: "",
    website: "",
    imageUrl: "",
    files: [],
    isLoading: false,
    isUploading: false,
    stepperItems: [
      { name: 'Lab Information', selected: true},
      { name: 'Lab Verification', selected: false},
    ]
  }),

  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
      labAccount: 'substrate/labAccount',
      isLabAccountExist: 'substrate/isLabAccountExist',
    }),

    ...mapState({
      locationContract: state => state.ethereum.contracts.contractLocation,
      degenicsContract: state => state.ethereum.contracts.contractDegenics,
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
        val => !!val || 'E-mail is required',
        val => /.+@.+\..+/.test(val) || 'E-mail must be valid',
      ]
    },

    nameRules() {
      return [
        val => !!val || 'Name is Required',
        val => (val && val.length >= 8) || 'Min 8 Character'
      ]
    },

    addressRules() {
      return [
        val => !!val || 'Address is Required',
        val => (val && val.length <= 180) || 'Max 180 Characters'
      ]
    },

    phoneNumberRules() {
      return [
        val => !!val || 'Phone Number is Required',
        val => /^\+?([0-9]{10,15})$/.test(val) || 'Phone Number must be valid',
        val => (val && val.length <= 15) || 'Max 15 Digits'
      ]
    },

    websiteRules() {
      return [
        val => !!val || 'Website URL is Required',
        val => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(val) || 'Website URL must be valid', //eslint-disable-line
        val => (val && val.length <= 2048) || 'Max 2048 Characters'
      ]
    },

    fileInputRules() {
      return [
        value => !value || value.size < 2000000 || 'Image size should be less than 2 MB!',
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

  methods: {
    gotoServicesPage() {
      this.$router.push({ name: "lab-registration-services" })
    },

    async setData() {
      if(this.isLabAccountExist){
        this.labName = this.labAccount.info.name
        this.email = this.labAccount.info.email
        this.address = this.labAccount.info.address
        this.phoneNumber = this.labAccount.info.phone_number
        this.website = this.labAccount.info.website
        this.country = this.labAccount.info.country
        await this.onCountryChange(this.country)
        this.state = this.labAccount.info.region
        await this.onStateChange(this.labAccount.info.region) // Region means the state, backend response got region instead state
        this.city = this.labAccount.info.city
        await this.onCityChange({ name: this.labAccount.info.city })
        this.imageUrl = this.labAccount.info.profile_image

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
      } = await this.dispatch(getStates, selectedCountry)

      this.states = data;
      this.country = selectedCountry;
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
        const ethAddress = await getWalletAddress()
        const box_public_key = this.mnemonicData.publicKey

        await registerLab(
          this.api,
          this.pair,
          {
            box_public_key,
            name: this.labName,
            email: this.email,
            address: this.address,
            phone_number: this.phoneNumber,
            website: this.website,
            country: this.country,
            region: this.state,
            city: this.city,
            profile_image: this.imageUrl
          },
          async () => {
            await setEthAddress(
              this.api,
              this.pair,
              ethAddress,
              () => {
                this.isLoading = false
                const labAccount = {
                  account_id: this.pair.address,
                  services: [],
                  certifications: [],
                  info: {
                    box_public_key,
                    name: this.labName,
                    email: this.email,
                    address: this.address,
                    country: this.country,
                    city: this.city,
                    profile_image: this.imageUrl,
                  }
                }
                this.setLabAccount(labAccount)
              }
            )
          }
        )
      }
      catch(e){
        console.error(e)
      }
    },

    fileUploadEventListener(file) {
      if (file && file.name) {
        if (file.name.lastIndexOf(".") <= 0) {
          return
        }
        this.isUploading = true
        this.isLoading = true

        const fr = new FileReader()
        fr.readAsArrayBuffer(file)

        const context = this
        fr.addEventListener("load", async () => {
          // Upload
          const uploaded = await upload({
            fileChunk: fr.result,
            fileType: file.type,
            fileName: file.name,
          })
          context.imageUrl = `https://ipfs.io/ipfs/${uploaded.ipfsPath[0].data.path}` // this is an image file that can be sent to server...
          context.isUploading = false
          context.isLoading = false
        })
      }
      else {
        this.files = []
        this.imageUrl = ""
      }
    },

    validating() {
      if (this.labName == "" || this.email == "" || this.imageUrl == "" || this.address == "" || this.country == "" || this.city == "" || this.state == "") {
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
