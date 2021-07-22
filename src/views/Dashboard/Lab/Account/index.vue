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
              <div class="secondary--text mb-10 text-h6">
                <b>Lab Account Information</b>
              </div>

              <v-form>
              <!-- <v-file-input
                dense
                label="Profile Image"
                placeholder="Profile Image"
                prepend-icon="mdi-image"
                outlined
                v-model="files"
              ></v-file-input> -->

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
                label="Select Country"
                autocomplete="new-password"
                v-model="country"
                outlined
              ></v-autocomplete>

              <v-autocomplete
                dense
                :items="regions"
                item-text="1"
                item-value="0"
                @change="onRegionChange"
                label="Select Region"
                :disabled="!country"
                autocomplete="new-password"
                v-model="region"
                outlined
              ></v-autocomplete>

              <v-autocomplete
                dense
                :items="cities"
                item-text="1"
                item-value="0"
                @change="onCityChange"
                label="Select City"
                :disabled="!region"
                autocomplete="new-password"
                v-model="city"
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

                <v-btn
                  color="primary"
                  block
                  large
                  @click="updateLab"
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
                <v-btn small dark color="#75DEE4" fab style="border-radius:10px;" @click="openCertificationDialog">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
              <div v-if="labAccount.certifications.length == 0">
                You don’t have any certifications
              </div>
              <div v-if="isLoading" class="mt-5">
                <v-skeleton-loader 
                  v-for="data in labAccount.certifications"
                  :key="data.idx"
                  type="list-item-three-line"
                  min-width="200"
                ></v-skeleton-loader>
              </div>
              <div v-if="labAccount.certifications.length > 0 && !isLoading" class="mt-5">
                <div
                  v-for="(cert, idx) in labAccount.certifications"
                  :key="cert.id"
                  :style="idx < (labAccount.certifications.length - 1) && 'border-bottom: 1px solid #555454;'"
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
                  <div v-if="cert.info.supporting_document" class="mt-3 mb-3">
                    <a :href="cert.info.supporting_document" class="support-url" target="_blank">
                      <v-icon class="mx-1" small>mdi-file-document</v-icon>
                      Supporting Documents
                    </a>
                  </div>
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
          <v-file-input
            dense
            label="Supporting Document"
            placeholder="Supporting Document"
            prepend-icon="mdi-file-document"
            outlined
            v-model="supportingDocuments"
            @change="fileUploadEventListener"
          ></v-file-input>
        </v-form>
      </template>
      <template v-slot:actions>
        <Button @click="submitCertification" :loading="isLoading" :disabled="isUploading" color="primary" dark>
          Save
        </Button>
      </template>
    </Dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { updateLab } from '@/lib/polkadotProvider/command/labs'
import { createCertification, updateCertification, deleteCertification } from '@/lib/polkadotProvider/command/labs/certifications'
import countryData from "@/assets/json/country.json"
import cityData from "@/assets/json/city.json"
import Kilt from '@kiltprotocol/sdk-js'
import { u8aToHex } from '@polkadot/util'
import Dialog from '@/components/Dialog'
import Button from '@/components/Button'
import { upload } from "@/lib/ipfs/upload"

updateCertification
deleteCertification

export default {
  name: 'LabAccount',
  components: {
    Dialog,
    Button,
  },
  async mounted() {
    const labInfo = this.labAccount.info
    this.email = labInfo.email
    this.labName = labInfo.name
    this.address = labInfo.address
    
    await this.getCountries()
    this.country = labInfo.country
    this.regions = Object.entries(cityData[labInfo.country].divisions)
    this.cities = Object.entries(cityData[labInfo.country].divisions)
    this.region = labInfo.city
    this.city = labInfo.city
  },
  data: () => ({
    email: "",
    labName: "",
    address: "",
    country: "",
    region: "",
    city: "",
    supportingDocumentsUrl: "",
    countries: [],
    regions: [],
    cities: [],
    supportingDocuments: [],
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
    selectYears() {
      const years = []
      const thisYear = new Date().getFullYear()
      for (let i = thisYear; i >= 2000; i--) {
        years.push(String(i))
      }
      return years
    }
  },
  methods: {
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
    async updateLab(){
      try{
        const box_public_key = this.getKiltBoxPublicKey()
        await updateLab(
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
          }
        )
      }
      catch(err){
        console.error(err)
      }
    },
    openCertificationDialog() {
      this.certificationDialog = true
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
          supporting_document: this.supportingDocumentsUrl
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
      this.supportingDocumentsUrl = cert.info.supporting_document
    
      if(this.supportingDocumentsUrl){
        fetch(this.supportingDocumentsUrl)
          .then(res => res.blob()) // Gets the response and returns it as a blob
          .then(blob => {
            this.supportingDocuments.push(new File([blob], this.supportingDocumentsUrl.substring(21)))
        });
      }

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
          supporting_document: this.supportingDocumentsUrl
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
          context.supportingDocumentsUrl = `https://ipfs.io/ipfs/${uploaded.ipfsPath[0].data.path}` // this is an image file that can be sent to server...
          context.isUploading = false
          context.isLoading = false
        })
      }
      else {
        this.supportingDocuments = []
        this.supportingDocumentsUrl = ""
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
