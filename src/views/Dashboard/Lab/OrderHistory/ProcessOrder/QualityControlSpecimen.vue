<template>
    <div class="mt-5">
        <v-btn v-if="specimenStatus != 'Rejected'"
            color="primary"
            block
            @click="qcDialog = true"
        >Complete QC Process</v-btn>

        <Dialog :show="qcDialog" @close="qcDialog = false">
            <template v-slot:title>
                <div></div>
            </template>
            <template v-slot:body>
                <div class="d-flex justify-center pb-5 pt-5">
                    <v-img v-bind:src="require('@/assets/debio-logo.png')" max-width="50" />
                </div>
                <div align="center" class="pb-5">Are you sure you want to complete the QC Process?</div>
            </template>
            <template v-slot:actions>
                <v-col col="12" md="6">
                    <Button @click="closeQcDialog" elevation="2" dark>Yes</Button>
                </v-col>
                <v-col col="12" md="6">
                    <Button @click="qcDialog = false" elevation="2" color="purple" dark>No</Button>
                </v-col>
            </template>
        </Dialog>

        <Dialog :show="qcCompletionDialog" @close="qcCompletionDialog = false">
            <template v-slot:title>
                <div></div>
            </template>
            <template v-slot:body>
                <div class="d-flex justify-center pb-5 pt-5">
                    <v-img v-bind:src="require('@/assets/debio-logo.png')" max-width="50" />
                </div>
                <div align="center" class="pb-5">QC process has been completed. Do you want to proceed to Genotyping/Sequencing Process?</div>
            </template>
            <template v-slot:actions>
                <div>
                    <Button :loading="isLoading" @click="closeQcCompletionDialogProceed" class="mb-4" elevation="2" dark>Yes, Proceed to Genotyping/Sequencing Process</Button>
                    <Button :disabled="isLoading" @click="closeQcCompletionDialogReject" elevation="2" color="purple" dark>No, Reject Specimen</Button>
                </div>
            </template>
        </Dialog>

        <Dialog :show="rejectionDialog" @close="rejectionDialog = false">
            <template v-slot:title>
                <div></div>
            </template>
            <template v-slot:body>
                <div class="d-flex justify-center pb-5 pt-5">
                    <v-img v-bind:src="require('@/assets/debio-logo.png')" max-width="50" />
                </div>
                <div align="center" class="pb-5">Are you sure you want to reject specimen?</div>
            </template>
            <template v-slot:actions>
                <v-col col="12" md="6">
                    <Button @click="closeRejectionDialog" elevation="2" dark>Yes</Button>
                </v-col>
                <v-col col="12" md="6">
                    <Button @click="rejectionDialog = false" elevation="2" color="purple" dark>No</Button>
                </v-col>
            </template>
        </Dialog>

        <Dialog :show="rejectionStatementDialog" @close="rejectionStatementDialog = false">
            <template v-slot:title>
                <div class="secondary--text h6">
                    Message Details
                </div>
            </template>
            <template v-slot:body>
                <v-form ref="rejectForm">
                    <v-text-field
                        dense
                        label="Title"
                        placeholder="Title"
                        outlined
                        v-model="rejectionTitle"
                        :rules="[val => !!val || 'Title is required']"
                        ></v-text-field>
                    <v-textarea
                        outlined
                        label="Description"
                        v-model="rejectionDescription"
                        :rules="[val => !!val || 'Description is required']"
                    ></v-textarea>
                </v-form>
            </template>
            <template v-slot:actions>
                <Button @click="closeRejectionStatementDialog" color="primary" dark>
                    Send
                </Button>
            </template>
        </Dialog>

        <Dialog :width="600" :show="rejectionConfirmationDialog" @close="rejectionConfirmationDialog = false">
            <template v-slot:title>
                <div class="secondary--text h6">
                    Are you sure you want to send this rejection message?
                </div>
            </template>
            <template v-slot:body>
                <v-card class="confirmation-background mb-2">
                    <v-card-title>
                        {{rejectionTitle}}
                    </v-card-title>
                    <v-card-text>
                        {{rejectionDescription}}
                    </v-card-text>
                </v-card>
            </template>
            <template v-slot:actions>
                <div>
                    <Button class="mb-4"  @click="submitRejectionStatementDialog" :loading="isLoading" color="primary" dark>
                        Yes, send message to customer
                    </Button>
                    <Button :disabled="isLoading" @click="backToRejectionStatementDialog" color="purple" dark>
                        No, back to message editor
                    </Button>
                </div>
            </template>
        </Dialog>

        <DialogAlert
            :show="rejectionAlertDialog"
            btnText="Continue"
            textAlert="Specimen has been rejected"
            imgPath="success.png"
            imgWidth="50"
            @toggle="rejectionAlertDialog = $event"
            @close="$router.push('/lab/orders')"
        ></DialogAlert>

        <div v-if="specimenStatus == 'Rejected'">
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-text class="px-8 mt-5">
              <div class="d-flex mb-8 justify-space-between">
                <b class="secondary--text card-header">Message Details</b>
              </div>
              <div class="mt-5 ml-5 mb-5">
                <div class="h6 mb-2">
                  Title
                </div>
                <div class="h4">
                  <b>{{rejectionTitle}}</b>
                </div>
              </div>
              <div class="mt-5 ml-5 mb-5">
                <div class="h6 mb-2">
                  Description
                </div>
                <div class="h4">
                  <b>{{rejectionDescription}}</b>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { rejectDnaSample, processDnaSample } from '@/lib/polkadotProvider/command/geneticTesting'
import { queryDnaSamples } from '@/lib/polkadotProvider/query/geneticTesting'
import Dialog from '@/components/Dialog'
import DialogAlert from '@/components/Dialog/DialogAlert'
import Button from '@/components/Button'

export default {
  name: 'ProcessSpecimen',
  components: {
    Dialog,
    DialogAlert,
    Button,
  },
  props: {
    specimenNumber: String,
    specimenStatus: String
  },
  data: () => ({
    isLoading: false,
    qcDialog: false,
    qcCompletionDialog: false,
    rejectionDialog: false,
    rejectionStatementDialog: false,
    rejectionConfirmationDialog: false,
    rejectionTitle: '',
    rejectionDescription: '',
    rejectionAlertDialog: false,
  }),
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),
  },
  async mounted() {
    try {
      const dnaSample = await queryDnaSamples(this.api, this.specimenNumber)
      if (dnaSample) {
        this.rejectionTitle = dnaSample.rejected_title
        this.rejectionDescription = dnaSample.rejected_description
      }
    } catch (err) {
      console.log(err)
    }
  },
  methods:{
    closeQcDialog(){
      this.qcDialog = false
      this.qcCompletionDialog = true
    },
    async closeQcCompletionDialogProceed(){
      this.isLoading = true
      await processDnaSample(
        this.api,
        this.pair,
        this.specimenNumber,
        "QualityControlled",
        () => {
            this.isLoading = false
            this.qcCompletionDialog = false
            this.$emit('qualityControlPassed')
        }
      )
    },
    closeQcCompletionDialogReject(){
      this.qcCompletionDialog = false
      this.rejectionDialog = true
    },
    closeRejectionDialog(){
      this.rejectionDialog = false
      this.rejectionStatementDialog = true
    },
    closeRejectionStatementDialog(){
      if (!this.$refs.rejectForm.validate()) {
        return
      }
      this.rejectionStatementDialog = false
      this.rejectionConfirmationDialog = true
    },
    backToRejectionStatementDialog(){
      this.rejectionConfirmationDialog = false
      this.rejectionStatementDialog = true
    },
    async submitRejectionStatementDialog(){
      if (!this.$refs.rejectForm.validate()) {
        return
      }
      this.isLoading = true
      await rejectDnaSample(
        this.api,
        this.pair,
        {
          tracking_id: this.specimenNumber,
          rejected_title: this.rejectionTitle,
          rejected_description: this.rejectionDescription,
        },
        () => {
          this.isLoading = false
          this.rejectionConfirmationDialog = false
          this.rejectionAlertDialog = true
          this.$emit('rejectSpecimen')
        }
      )
      this.processDnaSample()
    },
    async processDnaSample() {
      this.isProcessing = true
      await processDnaSample(
        this.api,
        this.pair,
        this.specimenNumber,
        "Rejected",
        () => {
          this.isProcessing = false
        }
      )
    },
  },
}
</script>

<style scoped>
.confirmation-background{
    background: #E6E6E6;
}
</style>