<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
          <!-- <v-card class="dg-card mb-10" elevation="0" outlined>
            <div class="secondary--text mt-5 ml-8"><b>Your Account is not verified</b></div>
            <v-card-text class="px-8">
                <p class="black--text">
                    We recommend that you go through the hospital verification process in order to receive the verified badge
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
              <div class="secondary--text text-h6">
                <b>Hospital Account Information</b>
              </div>
              <v-container v-if="image" class="mb-10 mt-5">
                  <img :src="image" class="rounded-xl" min-width="150" height="150" />
              </v-container>
              <v-form>
                <v-file-input
                  dense
                  label="Profile Image"
                  placeholder="Profile Image"
                  prepend-icon="mdi-image"
                  outlined
                  v-model="files"
                  @change="fileUploadEventListener"
                  :rules="[val => !!val || 'Image is Required']"
                ></v-file-input>

                <v-text-field
                  dense
                  label="Email"
                  placeholder="Email"
                  outlined
                  v-model="email"
                  :rules="[val => !!val || 'Email is Required']"
                ></v-text-field>
                
                <v-text-field
                  dense
                  label="Hospital Name"
                  placeholder="Hospital Name"
                  outlined
                  v-model="hospitalName"
                  :rules="[val => !!val || 'Name is Required']"
                ></v-text-field>

                <v-autocomplete
                  dense
                  :items="countries"
                  item-text="name"
                  item-value="code"
                  @change="onCountryChange"
                  label="Select Country"
                  v-model="country"
                  outlined
                  :rules="[val => !!val || 'Country is Required']"
                ></v-autocomplete>

                <v-autocomplete
                  dense
                  :items="regions"
                  item-text="name"
                  item-value="code"
                  @change="onRegionChange"
                  label="Select Region"
                  :disabled="!country"
                  v-model="region"
                  outlined
                  :rules="[val => !!val || 'Region is Required']"
                ></v-autocomplete>

                <v-autocomplete
                  dense
                  :items="cities"
                  item-text="name"
                  item-value="code"
                  @change="onCityChange"
                  label="Select City"
                  :disabled="!region"
                  v-model="city"
                  outlined
                  :rules="[val => !!val || 'City is Required']"
                ></v-autocomplete>
                
                <v-text-field
                  dense
                  label="Address"
                  placeholder="Address"
                  outlined
                  v-model="address"
                  :rules="[val => !!val || 'Address is Required']"
                ></v-text-field>

                <v-btn
                  color="primary"
                  block
                  large
                  :loading="isLoading"
                  @click="updateHospital"
                >Submit</v-btn>
              </v-form>
            </v-card-text>
          </v-card>

          <v-card class="dg-card mt-5" elevation="0" outlined>
            <v-card-text class="px-8 mt-5">
              <div class="d-flex justify-space-between align-center">
                <div class="secondary--text text-h6">
                  <b>Certifications</b>
                </div>
                <v-btn small dark color="#75DEE4" fab style="border-radius:10px;" @click="certificationDialog = true">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
              <div v-if="hospitalAccount.certifications.length == 0">
                You don’t have any certifications
              </div>
              <div v-if="isLoading" class="mt-5">
                <v-skeleton-loader 
                  v-for="data in hospitalAccount.certifications"
                  :key="data.idx"
                  type="list-item-three-line"
                  min-width="200"
                ></v-skeleton-loader>
              </div>
              <div v-if="hospitalAccount.certifications.length > 0 && !isLoading" class="mt-5">
                <div
                  v-for="(cert, idx) in hospitalAccount.certifications"
                  :key="cert.id"
                  :style="idx < (hospitalAccount.certifications.length - 1) && 'border-bottom: 1px solid #555454;'"
                  class="my-3"
                >
                  <div class="d-flex justify-space-between align-center" style="width: 100%;">
                    <div class=""><b>{{ cert.info.title }}</b></div>
                    <div class="d-flex">
                      <v-icon class="mx-1" small @click="editCertification(cert)">mdi-pencil</v-icon>
                      <v-icon class="mx-1" small @click="deleteCertification(cert)">mdi-delete</v-icon>
                    </div>
                  </div>
                  <div>{{ cert.info.month }} {{ cert.info.year }} • {{ cert.info.issuer }}</div>
                  <div class="mt-3 mb-3">{{ cert.info.description }}</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <Dialog :show="certificationDialog" @close="closeCertificationDialog">
      <template v-slot:title>
        <div class="secondary--text h6">
          {{ isEditCertificationDialog ? "Edit" : "Add" }} Certification
        </div>
      </template>
      <template v-slot:body>
        <v-form ref="certificationForm">
          <v-text-field
            dense
            label="Title"
            placeholder="Title"
            outlined
            v-model="certTitle"
            :rules="[val => !!val || 'Title is required']"
            ></v-text-field>
          <v-text-field
            dense
            label="Issuer"
            placeholder="Issuer"
            outlined
            v-model="certIssuer"
            :rules="[val => !!val || 'Issuer is required']"
            ></v-text-field>
          <div class="d-flex justify-space-between align-center">
            <div class="mr-1">
              <v-select
                dense
                label="Month"
                :items="selectMonths"
                outlined
                v-model="certMonth"
                :rules="[val => !!val || 'Month is required']"
                ></v-select>
            </div>
            <div class="ml-1">
              <v-select
                dense
                label="Year"
                :items="selectYears"
                outlined
                v-model="certYear"
                :rules="[val => !!val || 'Year is required']"
                ></v-select>
            </div>
          </div>
          <v-textarea
            outlined
            label="Description"
            v-model="certDescription"
            :rules="[val => !!val || 'Description is required']"
          ></v-textarea>
        </v-form>
      </template>
      <template v-slot:actions>
        <Button @click="submitCertification" :loading="isLoading" color="primary" dark>
          Save
        </Button>
      </template>
    </Dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { updateHospital } from '@/lib/polkadotProvider/command/hospitals'
import { createCertification, updateCertification, deleteCertification } from '@/lib/polkadotProvider/command/hospitals/certifications'
import { upload } from "@/lib/ipfs/upload"
import Dialog from '@/components/Dialog'
import Button from '@/components/Button'
import { getLocation } from "@/lib/api"

export default {
  name: 'HospitalAccount',
  components: {
    Dialog,
    Button,
  },
  async mounted() {
    const hospitalInfo = this.hospitalAccount.info
    this.email = hospitalInfo.email
    this.hospitalName = hospitalInfo.name
    this.address = hospitalInfo.address
    this.image = hospitalInfo.profile_image
    
    await this.getCountries()
    this.country = hospitalInfo.country
    this.regions = await getLocation(this.country, null);
    this.region = hospitalInfo.region
    this.cities = await getLocation(this.country, this.region);
    this.city = hospitalInfo.city

    if(this.image){
      const res = await fetch(this.image)
      const blob = await res.blob() // Gets the response and returns it as a blob
      this.files.push(new File([blob], this.image.substring(21)))
    }
  },
  data: () => ({
    email: "",
    hospitalName: "",
    address: "",
    country: "",
    region: "",
    city: "",
    countries: [],
    regions: [],
    cities: [],
    image: "",
    files: [],
    certifications: [],
    certificationDialog: false,
    certId: "", // for update certification
    certTitle: "",
    certIssuer: "",
    certMonth: "",
    certYear: "",
    certDescription: "",
    selectMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    isLoading: false,
    isUploading: false,
    isEditCertificationDialog: false,
  }),
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
      hospitalAccount: 'substrate/hospitalAccount',
    }),
    ...mapState({
      countryData: state => state.auth.countryData,
    }),
    citiesSelection() {
      return this.cities
        .filter((c) => c.country == this.country)
        .map((c) => ({ value: c.city, text: c.city, country: c.country }));
    },
    selectYears() {
      const years = []
      const thisYear = new Date().getFullYear()
      for (let i = thisYear; i >= 2000; i--) {
        years.push(String(i))
      }
      return years
    },
  },
  methods: {
    async getCountries() {
      this.countries = this.countryData;
    },
    async onCountryChange(selectedCountry) {
      this.country = selectedCountry;
      this.regions = await getLocation(this.country, null);
    },
    async onRegionChange(selectedRegion) {
      this.region = selectedRegion;
      this.cities = await getLocation(this.country, this.region);
    },
    onCityChange(selectedCity) {
      this.city = selectedCity;
    },
    async updateHospital(){
      try{
        this.isLoading = true
        await updateHospital(
          this.api,
          this.pair,
          {
            name: this.hospitalName,
            email: this.email,
            profile_image: this.image,
            address: this.address,
            country: this.country.trim(),
            city: this.city.trim(),
          },
          () => {
            this.isLoading = false
          }
        )
      }
      catch(err){
        console.error(err)
      }
    },
    fileUploadEventListener(file) {
      this.isUploading = true
      this.isLoading = true
      if (file) {
        if (file.name.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsArrayBuffer(file)

        const context = this
        fr.addEventListener('load', async () => {
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
        this.image = ''
      }
    },
    closeCertificationDialog() {
      this.certId = ""
      this.certificationDialog = false
      this.isEditCertificationDialog = false
      this.$refs.certificationForm.reset()
    },
    async submitCertification() {
      if (!this.certId) {
        await this.addCertification()
        return
      }
      await this.updateCertification()
    },
    async addCertification() {
      if (!this.$refs.certificationForm.validate()) {
        return
      }
      try {
        this.isLoading = true
        const certificationInfo = {
          title: this.certTitle,
          issuer: this.certIssuer,
          month: this.certMonth,
          year: this.certYear,
          description: this.certDescription,
        }

        await createCertification(this.api, this.pair, certificationInfo, () => {
          this.closeCertificationDialog()
          this.isLoading = false
        })
      } catch (err) {
        console.log(err)
        this.isLoading = false
      }
    },
    editCertification(cert) {
      this.certId = cert.id
      this.certTitle = cert.info.title
      this.certIssuer = cert.info.issuer
      this.certMonth = cert.info.month
      this.certYear = cert.info.year
      this.certDescription = cert.info.description

      this.certificationDialog = true
      this.isEditCertificationDialog = true
    },
    async updateCertification() {
      if (!this.$refs.certificationForm.validate()) {
        return
      }

      try {
        this.isLoading = true

        const certificationInfo = {
          title: this.certTitle,
          issuer: this.certIssuer,
          month: this.certMonth,
          year: this.certYear,
          description: this.certDescription,
        }

        await updateCertification(this.api, this.pair, this.certId, certificationInfo, () => {
          this.closeCertificationDialog()
          this.isLoading = false
        })
      } catch (err) {
        console.log(err)
        this.isLoading = false
      }
    },
    async deleteCertification(cert) {
      const isConfirmed = confirm("Are you sure you want to delete this certification?")
      if (isConfirmed) {
        this.isLoading = true

        await deleteCertification(this.api, this.pair, cert.id, () => {
          this.isLoading = false
        })
      }
      return
    },
  }
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
