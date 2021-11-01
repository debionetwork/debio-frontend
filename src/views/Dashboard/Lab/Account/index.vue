<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
          <!-- <v-card class="dg-card mb-10" elevation="0" outlined>
            <div class="secondary--text mt-5 ml-8"><b>Your Account is not verified</b></div>
            <v-card-text class="px-8">
                <p class="black--text">
                    We recommend that you go through the lab verification process in order to receive the verified badge
                    <v-icon 
                      inline
                      color="primary"
                      :size="16"
                    >mdi-check-decagram</v-icon>.
                    <br>
                    Otherwise, you can skip this step and do this later.
                </p>
                <v-btn
                    color="primary"
                    block
                    medium>Verify Account</v-btn>
            </v-card-text>
          </v-card> -->

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
                  v-model="email"
                ></v-text-field>
                
                <v-text-field
                  dense
                  label="Lab Name"
                  placeholder="Lab Name"
                  autocomplete="off"
                  outlined
                  :disabled="!isEditable"
                  v-model="labName"
                ></v-text-field>

                <v-autocomplete
                  dense
                  :items="countries"
                  item-text="name"
                  item-value="iso2"
                  @change="onCountryChange"
                  :label="computeCountryLabel"
                  autocomplete="off"
                  v-model="country"
                  :disabled="!isEditable"
                  outlined
                ></v-autocomplete>

                <v-autocomplete
                  dense
                  :items="states"
                  item-text="name"
                  item-value="state_code"
                  @change="onStateChange"
                  :label="computeStateLabel"
                  :disabled="(!country || !isEditable)"
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
                  :disabled="(!state || !isEditable)"
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
                  :disabled="!isEditable"
                ></v-text-field>

                <v-text-field
                  dense
                  label="Phone Number"
                  placeholder="Phone Number"
                  autocomplete="off"
                  outlined
                  v-model="phoneNumber"
                  :rules="phoneNumberRules"
                  :disabled="!isEditable"
                ></v-text-field>

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
import { getLocations, getStates, getCities } from "@/lib/location"
import Kilt from "@kiltprotocol/sdk-js"
import { u8aToHex } from "@polkadot/util"
import Certification from "./Certification"
import { upload } from "@/lib/ipfs"
import serviceHandler from "@/lib/metamask/mixins/serviceHandler"

export default {
  name: 'LabAccount',
  mixins: [serviceHandler],

  components: { Certification },

  data: () => ({
    email: "",
    labName: "",
    address: "",
    phoneNumber: "",
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
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
      labAccount: 'substrate/labAccount',
    }),

    ...mapState({
      mnemonic: state => state.substrate.mnemonicData.mnemonic,
    }),

    citiesSelection() {
      return this.cities
        .filter((c) => c.country == this.country)
        .map((c) => ({ value: c.city, text: c.city, country: c.country }));
    },
    
    rules(){
      return [
        file => !file || file.size <= 3_097_152 || 'Document size should be less than 3 MB!',
        file => !file || file.type == 'image/jpg' || file.type == 'image/jpeg' || 'Document type should be image/jpg',
      ]
    },

    phoneNumberRules() {
      return [
        val => !!val || 'Phone Number is Required',
        val => /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/.test(val) || 'Phone Number must be valid',
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
    this.phoneNumber = labInfo.phone_number
    this.website = labInfo.website
    this.imageUrl = labInfo.profile_image

    await this.getCountries()
    await this.onCountryChange(labInfo.country)
    await this.onStateChange(labInfo.region) // Region means the state, backend response got region instead state
    await this.onCityChange({ name: labInfo.city })

    const res = await fetch(this.imageUrl)
    const blob = await res.blob() // Gets the response and returns it as a blob
    const file = new File([blob], this.imageUrl.substring(21), {type: "image/jpeg"})
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
      this.state = ""
      this.city = ""

      const { data:
        { data }
      } = await this.dispatch(getStates, selectedCountry)

      this.country = selectedCountry;
      this.states = data;
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
        const box_public_key = this.getKiltBoxPublicKey()
        await updateLab(
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
            region: this.state, // Region means the state, backend parameter only accept region instead state
            city: this.city,
            profile_image: this.imageUrl,
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
    
    fileUploadEventListener(file) {
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
