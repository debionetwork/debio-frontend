<template>
  <div>
    <v-card class="dg-card mt-5" elevation="0" outlined>
      <v-card-text class="px-8 mt-5">
        <div class="d-flex justify-space-between align-center">
        <div>
          <b class="secondary--text text-h6">Certifications</b>
          <span> (e.g. ISO 17025:2017, ISO 9001, etc.)</span>
        </div>
        <v-btn :disabled="!isLabAccountExist" small :dark="isLabAccountExist" color="#75DEE4" fab style="border-radius:10px;" @click="openCertificationDialog">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        </div>
        <div v-if="!labAccount || labAccount.certifications.length == 0">
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
        <div v-if="labAccount && labAccount.certifications.length > 0 && !isLoading" class="mt-5">
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

            <DialogErrorBalance
              :show="isShowError"
              @close="closeDialog"
            />
            <div>{{ cert.info.month }} {{ cert.info.year }} • {{ cert.info.issuer }}</div>
            <div class="mt-3 mb-3">{{ cert.info.description }}</div>
            <div v-if="cert.info.supportingDocument" class="mt-3 mb-3">
              <a :href="cert.info.supportingDocument" class="support-url" target="_blank">
                <v-icon class="mx-1" small>mdi-file-document</v-icon>
                Supporting Documents
              </a>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <Dialog :show="confirmDeleteDialog" @close="confirmDeleteDialog = false" :width='400'>
      <template v-slot:title>
        <div></div>
      </template>
      <template v-slot:body>
        <div class="d-flex justify-center pb-1 pt-1">
            <v-img v-bind:src="require('@/assets/alert-circle.png')" max-width="75" />
        </div>
        <div align="center" class="pb-1">Are you sure you want to delete this certification?</div>
        <div align="center" class= "ml-5 mr-5 pb-1 d-flex justify-space-between mt-5" >
          <div>
            <span style="font-size: 12px"> Estimated Transaction Weight </span>
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
      </template>
      <template v-slot:actions>
        <v-col col="12" md="6">
            <Button @click="confirmDelete" elevation="2" :loading="isDeleting" dark>Yes</Button>
        </v-col>
        <v-col col="12" md="6">
            <Button @click="confirmDeleteDialog = false" elevation="2" color="purple" dark>No</Button>
        </v-col>
      </template>
    </Dialog>

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
            v-model="certificationInfo.title"
            :rules="titleRules"
          ></v-text-field>
          <v-text-field
            dense
            label="Issuer"
            placeholder="Issuer"
            outlined
            v-model="certificationInfo.issuer"
            :rules="issuerRules"
          ></v-text-field>
          <div class="d-flex justify-space-between align-center">
            <div class="mr-1">
              <v-select
                dense
                label="Month"
                :items="selectMonths"
                outlined
                v-model="certificationInfo.month"
                :rules="monthRules"
              ></v-select>
            </div>
            <div class="ml-1">
              <v-select
                dense
                label="Year"
                :items="selectYears"
                outlined
                v-model="certificationInfo.year"
                :rules="yearRules"
              ></v-select>
            </div>
          </div>
          <v-textarea
            outlined
            label="Description"
            v-model="certificationInfo.description"
            :rules="descriptionRules"
          ></v-textarea>
          <v-file-input
              dense
            label="Supporting Document"
            placeholder="Supporting Document"
            prepend-icon="mdi-file-document"
            outlined
            @change="fileUploadEventListener"
            :rules="supportingDocumentsRules"
            show-size
            v-model="files"
            accept="application/pdf, application/msword, image/png, image/jpeg,"
          ></v-file-input>
        </v-form>
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
import { mapGetters, mapState } from "vuex"
import { createCertification, createCertificationFee, updateCertification, updateCertificationFee, deleteCertification, deleteCertificationFee } from "@/lib/polkadotProvider/command/labs/certifications"
import serviceHandler from "@/mixins/serviceHandler"
import Dialog from "@/components/Dialog"
import Button from "@/components/Button"
import { uploadFile, getFileUrl } from "@/lib/pinata-proxy"
import { generalDebounce } from "@/utils"
import DialogErrorBalance from "@/components/Dialog/DialogErrorBalance"

const englishAlphabet = val => (val && /^[A-Za-z0-9!@#$%^&*\\(\\)\-_=+:;"',.\\/? ]+$/.test(val)) || "This field can only contain English alphabet"

export default {
  name: "Certification",

  components: {
    Dialog,
    Button,
    DialogErrorBalance
  },

  mixins: [serviceHandler],

  data: () => ({
    certificationInfo: {
      title: "",
      issuer: "",
      month: "",
      year: "",
      description: "",
      supportingDocument: ""
    },
    certId: "", // for update certification
    certSupportingDocumentsUrl: "",
    selectMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    certificationDialog: false,
    isUploading: false,
    isEditCertificationDialog: false,
    files: [],
    confirmDeleteDialog: false,
    certificationData: null,
    fee: "",
    isDeleting: false,
    isShowError: false
  }),

  computed: {
    ...mapGetters({
      api: "substrate/getAPI",
      pair: "substrate/wallet",
      labAccount: "substrate/labAccount",
      isLabAccountExist: "substrate/isLabAccountExist"
    }),

    ...mapState({
      web3: (state) => state.metamask.web3,
      lastEventData: (state) => state.substrate.lastEventData
    }),

    selectYears() {
      const years = []
      const thisYear = new Date().getFullYear()
      for (let i = thisYear; i >= 2000; i--) {
        years.push(String(i))
      }
      return years
    },

    supportingDocumentsRules(){
      return [
        file => !file || file.size <= 2_000_000 || "The total file size uploaded exceeds the maximum file size allowed (2MB)"
      ]
    },

    titleRules() {
      return [
        val => !!val || "This field is required",
        val => (val && val.length <= 50) || "This field only allows 50 characters",
        englishAlphabet
      ]
    },

    issuerRules() {
      return [
        val => !!val || "This field is required",
        val => (val && val.length <= 100) || "This field only allows 100 characters",
        englishAlphabet
      ]
    },

    monthRules() {
      return [
        val => !!val || "This field is required"
      ]
    },

    yearRules() {
      return [
        val => !!val || "This field is required"
      ]
    },

    descriptionRules() {
      return [
        val => !!val || "This field is required",
        val => (val && val.length <= 255) || "This field only allows 255 characters",
        englishAlphabet
      ]
    }

  },

  watch: {
    certificationInfo: {
      deep: true,
      immediate: true,
      handler: generalDebounce(async function() {
        if (this.isEditCertificationDialog) {
          await this.getUpdateCertificationFee()
          return
        }
        await this.getCreateCertificationFee()
      }, 500)
    },

    lastEventData() {
      if (this.lastEventData) {
        const dataEvent = JSON.parse(this.lastEventData.data.toString())
        if (this.lastEventData.method === "CertificationDeleted") {
          if (dataEvent[1] === this.pair.address) {
            this.isDeleting = false
            this.confirmDeleteDialog = false
          }
        }
      }      
    }
  },

  methods: {
    openCertificationDialog() {
      this.certificationDialog = true
    },

    closeCertificationDialog() {
      this.isLoading = false
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

    async getCreateCertificationFee() {
      this.certificationInfo.supportingDocument = this.certSupportingDocumentsUrl
      const fee = await createCertificationFee(this.api, this.pair, this.certificationInfo)
      this.fee = this.web3.utils.fromWei(String(fee.partialFee), "ether")
    },

    async getUpdateCertificationFee() {
      const fee = await updateCertificationFee(this.api, this.pair, this.certId, this.certificationInfo)
      this.fee = this.web3.utils.fromWei(String(fee.partialFee), "ether")
    },

    async getDeleteCertificationFee() {
      const fee = await deleteCertificationFee(this.api, this.pair, this.certId)
      this.fee = this.web3.utils.fromWei(String(fee.partialFee), "ether")
    },

    async addCertification() {
      if (!this.$refs.certificationForm.validate()) {
        return
      }

      try {
        this.certificationInfo.supportingDocument = this.certSupportingDocumentsUrl
        await this.dispatch(createCertification, this.api, this.pair, this.certificationInfo, () => {
          this.closeCertificationDialog()
        })
      } catch (error) {
        this.closeCertificationDialog()
        this.isLoading = false
        if (error.message === "1010: Invalid Transaction: Inability to pay some fees , e.g. account balance too low") {
          this.isShowError = true
        }
      }
    },

    async editCertification(cert) {
      const { title, issuer, month, year, description, supportingDocument} = cert.info
      this.certId = cert.id
      this.certificationInfo = { title, issuer, month, year, description, supportingDocument }

      const res = await fetch(this.certificationInfo.supportingDocument)
      const blob = await res.blob() // Gets the response and returns it as a blob
      const type = blob.type
      const file = new File([blob], this.certificationInfo.supportingDocument.substring(21), {type})
      
      this.files = file
      this.certificationDialog = true
      this.isEditCertificationDialog = true
    },

    async updateCertification() {
      if (!this.$refs.certificationForm.validate()) {
        return
      }

      try {
        if (this.certSupportingDocumentsUrl) {
          this.certificationInfo.supportingDocument = this.certSupportingDocumentsUrl
        }

        await this.dispatch(updateCertification, this.api, this.pair, this.certId, this.certificationInfo, () => {
          this.closeCertificationDialog()
        })
      } catch (error) {
        this.closeCertificationDialog()
        this.isLoading = false
        if (error.message === "1010: Invalid Transaction: Inability to pay some fees , e.g. account balance too low") {
          this.isShowError = true
        }
      }
    },

    async deleteCertification(cert) {
      this.certId = cert.id
      this.getDeleteCertificationFee()
      this.confirmDeleteDialog = true
      this.certificationData = cert
    },

    async confirmDelete() {
      try {
        this.isDeleting = true
        await this.dispatch(deleteCertification, this.api, this.pair, this.certId)
      } catch (error) {
        this.isDeleting = false
        if (error.message === "1010: Invalid Transaction: Inability to pay some fees , e.g. account balance too low") {
          this.isConfirmDeleteDialog = false
          this.isShowError = true
        }
      }
    },

    async fileUploadEventListener(file) {
      this.certSupportingDocumentsUrl = ""
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

        this.certSupportingDocumentsUrl = link
        this.isUploading = false
        this.isLoading = false
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

    closeDialog() {
      this.isLoading = false
      this.isDeleting = false
      this.isShowError = false
      this.showDeletePrompt = false
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
