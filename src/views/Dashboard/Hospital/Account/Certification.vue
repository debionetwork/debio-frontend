<template>
    <div>
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
                    @change="fileUploadEventListener"
                    :rules="supportingDocumentsRules"
                    show-size
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
import { mapGetters } from "vuex"
import { createCertification, updateCertification, deleteCertification } from "@/lib/polkadotProvider/command/hospitals/certifications"
import serviceHandler from "@/mixins/serviceHandler"
import Dialog from '@/components/Dialog'
import Button from '@/components/Button'
import { upload } from "@/lib/ipfs"

export default {
  name: 'HospitalCertification',
  components: {
    Dialog,
    Button,
  },
  mixins: [serviceHandler],
  data: () => ({
    certId: "", // for update certification
    certTitle: "",
    certIssuer: "",
    certMonth: "",
    certYear: "",
    certDescription: "",
    certSupportingDocumentsUrl: "",
    selectMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    certificationDialog: false,
    isUploading: false,
    isEditCertificationDialog: false,
  }),
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
      hospitalAccount: 'substrate/hospitalAccount',
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
        file => !file || file.type == 'application/pdf' || 'Document type should be application/pdf',
        file => !file || file.size <= 10_097_152 || 'Document size should be less than 10 MB!',
      ]
    }
  },
  methods: {
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
      const certificationInfo = {
        title: this.certTitle,
        issuer: this.certIssuer,
        month: this.certMonth,
        year: this.certYear,
        description: this.certDescription,
        supporting_document: this.certSupportingDocumentsUrl
      }
      await this.dispatch(createCertification, this.api, this.pair, certificationInfo, () => {
        this.closeCertificationDialog()
      })
    },
    
    editCertification(cert) {
      this.certId = cert.id
      this.certTitle = cert.info.title
      this.certIssuer = cert.info.issuer
      this.certMonth = cert.info.month
      this.certYear = cert.info.year
      this.certDescription = cert.info.description
      this.certSupportingDocumentsUrl = cert.info.supporting_document

      this.certificationDialog = true
      this.isEditCertificationDialog = true
    },

    async updateCertification() {
      if (!this.$refs.certificationForm.validate()) {
        return
      }
      const certificationInfo = {
        title: this.certTitle,
        issuer: this.certIssuer,
        month: this.certMonth,
        year: this.certYear,
        description: this.certDescription,
        supporting_document: this.certSupportingDocumentsUrl
      }
      await this.dispatch(updateCertification, this.api, this.pair, this.certId, certificationInfo, () => {
        this.closeCertificationDialog()
      })
    },

    async deleteCertification(cert) {
      const isConfirmed = confirm("Are you sure you want to delete this certification?")
      if (isConfirmed) {
        await this.dispatch(deleteCertification, this.api, this.pair, cert.id)
      }
    },

    fileUploadEventListener(file) {
      this.certSupportingDocumentsUrl = ""
      if (!this.$refs.certificationForm.validate()) {
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
          context.certSupportingDocumentsUrl = `https://ipfs.io/ipfs/${uploaded.ipfsPath[0].data.path}` // this is an image file that can be sent to server...
          context.isUploading = false
          context.isLoading = false
        })
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