<style scoped>
.card-header{
    font-size: 14pt;
}
</style>

<template>
   <div>
      <v-container>
        <v-row>
            <v-col cols="10" md="3">
                <v-card class="dg-card" elevation="0" outlined>
                    <v-card-text class="px-8 mt-5">
                        <div class="secondary--text mb-8 card-header">
                            <b>Checklist</b>
                        </div>
                        <Stepper
                            direction="vertical"
                            :stepper-items="stepperItems"
                            size="medium"
                        />
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="10" md="7">
                <v-card class="dg-card" elevation="0" outlined>
                    <v-card-text class="px-8 mt-5">
                        <div class="d-flex mb-8 justify-space-between">
                            <b class="secondary--text card-header">Order Detail</b>
                            <b class="secondary--text h6">{{ this.createdAt  | timestampToDate }}</b>
                        </div>
                        <div class="d-flex justify-space-between">
                            <div class="d-flex align-center">
                                <div>
                                    <v-icon
                                    v-if="_icon"
                                    color="#BA8DBB"
                                    :size="52"
                                    >
                                    {{ _icon }}
                                    </v-icon>
                                    <v-avatar v-else>
                                    <img :src="getImageLink(serviceImage)" />
                                    </v-avatar>
                                </div>
                                <div class="ml-5">
                                    <div style="">
                                      <b>{{ this.serviceName }}</b>
                                    </div>
                                    <div class="text-caption grey--text text--darken-1">
                                      {{ this.serviceDescription.substring(0, 60) }}...
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 ml-5" style="max-width: 50%;">
                                <div class="h6">
                                    <b>Customer Account Number</b>
                                </div>
                                <div class="text-caption grey--text text--darken-1">
                                    {{ this.customerEthAddress }}
                                </div>
                            </div>
                        </div>
                        <div class="mt-6 d-flex justify-space-between">
                            <div class="mt-2 ml-5" style="max-width: 50%;">
                                <div class="h6">
                                    <b>Specimen Number</b>
                                </div>
                                <div class="text-caption grey--text text--darken-1">
                                    {{ this.specimenNumber }}
                                </div>
                            </div>
                            <div class="mt-2 ml-5" style="max-width: 50%;">
                                <div class="h6">
                                    <b>Escrow Address</b>
                                </div>
                                <div class="text-caption grey--text text--darken-1">
                                    {{ this.sellerEthAddress }}
                                </div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>

                <div
                    v-if="showResultDialog">
                    <v-alert 
                        class = "mt-5"
                        type="success"
                    >
                        This order has been completed </v-alert>
                </div>
                <div v-if="showRejectDialog">
                    <v-alert 
                        class = "mt-5"
                        type="danger"
                    >
                        This specimen has been rejected </v-alert>
                </div>
                <ReceiveSpecimen 
                    v-if="showReceiveDialog" 
                    :specimen-number="specimenNumber"
                    @specimenReceived="onSpecimenReceived" />
                <QualityControlSpecimen
                    v-if="showQualityControlDialog"
                    :specimen-number="specimenNumber"
                    :specimen-status="specimenStatus"
                    @qualityControlPassed="onQcCompleted" />
                <GenotypeSpecimen
                    v-if="showGenotypeDialog"
                    :specimen-number="specimenNumber"
                    :specimen-status="specimenStatus"
                    @genotypeFinished="onGenotypeFinished" />
                <ReviewSpecimen 
                    v-if="showReviewDialog"
                    :specimen-number="specimenNumber"
                    @reviewedSpecimen="onSpecimenReviewed"/>
                <ComputeSpecimen
                    v-if="showComputeDialog"
                    :specimen-number="specimenNumber"
                    @computedSpecimen="onSpecimenComputed" />
                <ProcessSpecimen 
                    v-if="showGenomeReportDialog || showResultDialog"
                    :order-id="orderId"
                    :specimen-number="specimenNumber"
                    :specimen-status="specimenStatus"
                    :public-key="publicKey"
                    :is-processed="isOrderProcessed"
                    @resultReady="onResultReady" />

                <DialogAlert
                    :show="cancelledOrderDialog"
                    btnText="Back"
                    textAlert="Order has been cancelled"
                    imgPath="warning.png"
                    imgWidth="50"
                    @toggle="cancelledOrderDialog = $event"
                    @close="$router.push('/lab/orders')"
                ></DialogAlert>
                </v-col>
            </v-row>
      </v-container>
   </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import ReceiveSpecimen from './ReceiveSpecimen'
import QualityControlSpecimen from './QualityControlSpecimen'
import GenotypeSpecimen from './GenotypeSpecimen'
import ReviewSpecimen from './ReviewSpecimen'
import ComputeSpecimen from './ComputeSpecimen'
import ProcessSpecimen from './ProcessSpecimen'
import { getOrdersDetail } from '@/lib/polkadotProvider/query/orders'
import DialogAlert from '@/components/Dialog/DialogAlert'
import Stepper from '@/components/Stepper'

export default {
  name: 'ProcessOrderHistory',
  components: {
    ReceiveSpecimen,
    QualityControlSpecimen,
    GenotypeSpecimen,
    ReviewSpecimen,
    ComputeSpecimen,
    ProcessSpecimen,
    DialogAlert,
    Stepper,
  },
  data: () => ({
    publicKey: "",
    createdAt: "",
    customerEthAddress: "",
    sellerEthAddress: "",
    specimenNumber: "",
    specimenStatus: "",
    isOrderProcessed: false,
    serviceName: "",
    serviceDescription: "",
    serviceImage: "",
    cancelledOrderDialog: false,
    showRejectDialog: false,
    showResultDialog: false,
    genomeFile: "",
    reportFile: "",
    stepperItems: [
        { name: 'Received', selected: false },
        { name: 'QC (DNA prep and extraction)', selected: false },
        { name: 'Genotyping/Sequencing', selected: false },
        { name: 'Review', selected: false },
        { name: 'Compute', selected: false },
        { name: 'Results Ready', selected: false },
    ]
  }),
  async mounted(){
    try {
      // If no order id redirect to order history list
      if (!this.orderId) {
        this.$router.push({ name: 'lab-dashboard-order-history' })
      }
      const order = await getOrdersDetail(this.api, this.orderId)
      if(order.status == "Cancelled"){
          this.cancelledOrderDialog = true
      }
      this.serviceName = order.service_name
      this.serviceDescription = order.service_description
      this.serviceImage = order.service_image
      this.publicKey = order.customer_box_public_key
      this.createdAt = order.created_at
      this.customerEthAddress = order.customer_eth_address ? order.customer_eth_address : "Address not set"
      this.sellerEthAddress = order.seller_eth_address
      this.specimenNumber = order.dna_sample_tracking_id
      this.specimenStatus = order.dna_sample_status
      this.setCheckboxByDnaStatus()
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    async setCheckboxByDnaStatus(){
        if(this.specimenStatus == "Rejected") {
            this.showRejectDialog = true
            this.onQcCompleted()
        }

        if(this.specimenStatus == "Arrived") {
            this.setStepperSelected(["Received"], false)
        }
        
        if(this.specimenStatus == "QualityControlled") {
            this.onQcCompleted()
        }

        if(this.specimenStatus == "GenotypedSequenced") {
            this.onGenotypeFinished()
        }

        if(this.specimenStatus == "Reviewed") {
            this.onSpecimenReviewed()
        }

        if(this.specimenStatus == "Computed") {
            this.onSpecimenComputed()
        }

        if(this.specimenStatus == "ResultReady") {
            this.onResultReady()
        }
    },
    onSpecimenReceived() {
        this.setStepperSelected(["Received"], true)
    },
    onQcCompleted() {
        this.setStepperSelected([
                "Received",
                "QC (DNA prep and extraction)",
            ],
            true
        )
    },
    onGenotypeFinished() {
        this.setStepperSelected([
                "Received",
                "QC (DNA prep and extraction)",
                "Genotyping/Sequencing",
            ],
            true
        )
    },
    onSpecimenReviewed() {
        this.setStepperSelected([
                "Received",
                "QC (DNA prep and extraction)",
                "Genotyping/Sequencing",
                "Review",
            ],
            true
        )
    },
    onSpecimenComputed() {
        this.setStepperSelected([
                "Received",
                "QC (DNA prep and extraction)",
                "Genotyping/Sequencing",
                "Review",
                "Compute",
            ],
            true
        )
    },
    onResultReady() {
        this.showResultDialog = true
        this.setStepperSelected([
                "Received",
                "QC (DNA prep and extraction)",
                "Genotyping/Sequencing",
                "Review",
                "Compute",
                "Results Ready",
            ],
            true
        )
    },
    getImageLink(val){
        if(val && val != ""){
          return val
        }
        return "https://ipfs.io/ipfs/QmaGr6N6vdcS13xBUT4hK8mr7uxCJc7k65Hp9tyTkvxfEr"
    },
    setStepperSelected(names, selected) {
        this.stepperItems = this.stepperItems.map(item => {
            if (names.includes(item.name)) {
                return { ...item, selected }
            }
            return { ...item }
        })
        console.log(this.stepperItems)
    }
  },
  computed: {
    ...mapState ({
        genome: (state) => state.testResult.genome,
        report: (state) => state.testResult.report
    }),
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),
    orderId() {
      return this.$route.params.order_id ? this.$route.params.order_id : ''
    },
    showReceiveDialog(){
        return this.stepperItems.some(item => item.name == "Received" && item.selected == false)
    },
    showQualityControlDialog(){
        return this.stepperItems.some(item => item.name == "Received" && item.selected == true)
            && this.stepperItems.some(item => item.name == "QC (DNA prep and extraction)" && item.selected == false)
            || this.specimenStatus == "Rejected"
    },
    showGenotypeDialog(){
        return this.stepperItems.some(item => item.name == "QC (DNA prep and extraction)" && item.selected == true)
            && this.stepperItems.some(item => item.name == "Genotyping/Sequencing" && item.selected == false)
            && this.specimenStatus != "Rejected"
    },
    showReviewDialog(){
        return this.stepperItems.some(item => item.name == "Genotyping/Sequencing" && item.selected == true)
            && this.stepperItems.some(item => item.name == "Review" && item.selected == false)
    },
    showComputeDialog() {
        return this.stepperItems.some(item => item.name == "Review" && item.selected == true)
            && this.stepperItems.some(item => item.name == "Compute" && item.selected == false)
    },
    showGenomeReportDialog() {
        return this.stepperItems.some(item => item.name == "Compute" && item.selected == true)
            && this.stepperItems.some(item => item.name == "Results Ready" && item.selected == false)
    },
    _icon() {
      return this.serviceImage && (this.serviceImage.startsWith('mdi') || this.serviceImage.startsWith('$'))
        ? this.serviceImage
        : false
    },
  },
}
</script>
