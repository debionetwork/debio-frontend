<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
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
                :rules="emailRules"
                ></v-text-field>
              
              <v-text-field
                dense
                label="Lab Name"
                placeholder="Lab Name"
                outlined
                v-model="labName"
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
                :rules="[val => !!val || 'Country is Required']"
              ></v-autocomplete>

              <v-autocomplete
                dense
                :items="states"
                item-text="name"
                item-value="state_code"
                @change="onStateChange"
                :label="computeStateLabel"
                :disabled="!country"
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
                :disabled="!state"
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
                  accept="image/png, image/jpeg"
                ></v-file-input>

                <v-btn
                  color="primary"
                  block
                  large
                  :disabled="isUploading"
                  :loading="isLoading || isUploading"
                  @click="registerLab"
                >Submit</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
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
import Kilt from "@kiltprotocol/sdk-js"
import { u8aToHex } from "@polkadot/util"
import { upload } from "@/lib/ipfs"
import { getLocations, getStates, getCities } from "@/lib/location"
import serviceHandler from "@/lib/metamask/mixins/serviceHandler"


export default {
  name: 'LabRegistration',
  mixins: [serviceHandler],

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
    imageUrl: "",
    files: [],
    isLoading: false,
    isUploading: false,
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
      mnemonic: state => state.substrate.mnemonicData.mnemonic,
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
        val => (val && val.length <= 180) || 'Max 180 Character'
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

  async mounted() {
    await this.getCountries();
  },

  methods: {
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

    getKiltBoxPublicKey() {
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonic)
      return u8aToHex(cred.boxKeyPair.publicKey)
    },

    async registerLab(){
      if (!this.validating()) {
        return
      }
      try{
        this.isLoading = true
        const ethAddress = await getWalletAddress()
        const box_public_key = this.getKiltBoxPublicKey()
        await registerLab(
          this.api,
          this.pair,
          {
            box_public_key,
            name: this.labName,
            email: this.email,
            address: this.address,
            country: this.country,
            region: this.state,
            city: this.city,
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
                this.$router.push('/lab/account')
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
