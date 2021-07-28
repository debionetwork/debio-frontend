<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-text class="px-8 mt-5">
              <v-form>
              <v-text-field
                dense
                label="Email"
                placeholder="Email"
                autocomplete="new-password"
                outlined
                v-model="email"
                ></v-text-field>
              
              <v-text-field
                dense
                label="Lab Name"
                placeholder="Lab Name"
                autocomplete="new-password"
                outlined
                v-model="labName"
                ></v-text-field>

              <v-autocomplete
                dense
                :items="countries"
                item-text="name"
                item-value="alpha-2"
                @change="onCountryChange"
                autocomplete="new-password"
                label="Select Country"
                outlined
              ></v-autocomplete>

              <v-autocomplete
                dense
                :items="regions"
                item-text="1"
                item-value="0"
                @change="onRegionChange"
                autocomplete="new-password"
                label="Select Region"
                :disabled="!country"
                outlined
              ></v-autocomplete>

              <v-autocomplete
                dense
                :items="cities"
                item-text="1"
                item-value="0"
                @change="onCityChange"
                autocomplete="new-password"
                label="Select City"
                :disabled="!region"
                outlined
              ></v-autocomplete>
              
              <v-text-field
                dense
                label="Address"
                placeholder="Address"
                autocomplete="new-password"
                outlined
                v-model="address"
                ></v-text-field>
                              
                <v-file-input
                  dense
                  label="Profile Image"
                  placeholder="Profile Image"
                  prepend-icon="mdi-image"
                  outlined
                  v-model="files"
                  @change="fileUploadEventListener"
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
import countryData from "@/assets/json/country.json"
import cityData from "@/assets/json/city.json"
import Kilt from "@kiltprotocol/sdk-js"
import { u8aToHex } from "@polkadot/util"
import { upload } from "@/lib/ipfs"


export default {
  name: 'LabRegistration',
  data: () => ({
    country: "",
    region: "",
    city: "",
    countries: [],
    cities: [],
    regions: [],
    email: "",
    labName: "",
    address: "",
    imageUrl: "",
    files: [],
    isLoading: false,
    isUploading: false,
  }),
  async mounted() {
    await this.getCountries();
  },
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
  },
  methods: {
    setLabAccount(labAccount) {
      this.$store.state.substrate.labAccount = labAccount
      this.$store.state.substrate.isLabAccountExist = true
    },
    async getCountries() {
      this.countries = countryData;
    },
    onCountryChange(selectedCountry) {
      this.country = selectedCountry;
      this.regions = Object.entries(cityData[this.country].divisions);
    },
    onRegionChange(selectedRegion) {
      this.region = selectedRegion;
      this.cities = Object.entries(cityData[this.country].divisions);
    },
    onCityChange(selectedCity) {
      this.city = selectedCity;
    },
    getKiltBoxPublicKey() {
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonic)
      return u8aToHex(cred.boxKeyPair.publicKey)
    },
    async registerLab(){
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
            region: this.region,
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
                this.$router.push('/lab')
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
  }
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
