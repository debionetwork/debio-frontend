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
                  :rules="[val => !!val || 'Email is Required']"
                  ></v-text-field>
                
                <v-text-field
                  dense
                  label="Hospital Name"
                  placeholder="Hospital Name"
                  autocomplete="new-password"
                  outlined
                  v-model="hospitalName"
                  :rules="[val => !!val || 'Name is Required']"
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
                  :rules="[val => !!val || 'Country is Required']"
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
                  :rules="[val => !!val || 'Region is Required']"
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
                  :rules="[val => !!val || 'City is Required']"
                ></v-autocomplete>
                
                <v-text-field
                  dense
                  label="Address"
                  placeholder="Address"
                  autocomplete="new-password"
                  outlined
                  v-model="address"
                  :rules="[val => !!val || 'Address is Required']"
                  ></v-text-field>
                  
                
                <v-file-input
                  dense
                  label="Profile Image"
                  placeholder="Profile Image"
                  prepend-icon="mdi-image"
                  autocomplete="new-password"
                  outlined
                  v-model="files"
                  @change="fileUploadEventListener"
                  :rules="[val => !!val || 'Image is Required']"
                ></v-file-input>

                <v-btn
                  color="primary"
                  block
                  large
                  :disabled="isUploading"
                  :loading="isLoading"
                  @click="registerHospital"
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
import { registerHospital } from "@/lib/polkadotProvider/command/hospitals"
import { setEthAddress } from "@/lib/polkadotProvider/command/userProfile"
import { getWalletAddress } from "@/lib/metamask/wallet"
import countryData from "@/assets/json/country.json"
import cityData from "@/assets/json/city.json"
import { upload } from "@/lib/ipfs"

export default {
  name: "HospitalRegistration",
  data: () => ({
    country: "",
    region: "",
    city: "",
    countries: [],
    cities: [],
    regions: [],
    email: "",
    hospitalName: "",
    address: "",
    image: "",
    files: [],
    isLoading: false,
    isUploading: false,
  }),
  async mounted() {
    await this.getCountries();
  },
  computed: {
    ...mapGetters({
      api: "substrate/getAPI",
      pair: "substrate/wallet",
      hospitalAccount: "substrate/hospitalAccount",
      isHospitalAccountExist: "substrate/isHospitalAccountExist",
    }),
    ...mapState({
      locationContract: state => state.ethereum.contracts.contractLocation,
      degenicsContract: state => state.ethereum.contracts.contractDegenics,
    }),
    citiesSelection() {
      return this.cities
        .filter((c) => c.country == this.country)
        .map((c) => ({ value: c.city, text: c.city, country: c.country }));
    },
    selectedHospital() {
      if (!this.hospitalAccount) {
        return;
      }
      return this.hospitals.filter((l) => l.hospitalAccount == this.hospitalAccount)[0];
    },
  },
  methods: {
    setHospitalAccount() {
      this.$store.state.substrate.isHospitalAccountExist = true
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
    async registerHospital(){
      try{
        this.isLoading = true
        const ethAddress = await getWalletAddress()
        await setEthAddress(
          this.api,
          this.pair,
          ethAddress,
          async () => {
            await registerHospital(
              this.api,
              this.pair,
              {
                name: this.hospitalName,
                email: this.email,
                profile_image: this.image,
                address: this.address,
                country: this.country,
                city: this.city,
              },
              async () => {
                this.setHospitalAccount()
                this.isLoading = false
                this.$router.push("/hospital")
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
      this.isUploading = true
      this.isLoading = true
      if (file) {
        if (file.name.lastIndexOf(".") <= 0) {
          return
        }
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
          context.image = `https://ipfs.io/ipfs/${uploaded.ipfsPath[0].data.path}` // this is an image file that can be sent to server...
          context.isUploading = false
          context.isLoading = false
        })
      }
      else {
        this.files = []
        this.image = ""
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
