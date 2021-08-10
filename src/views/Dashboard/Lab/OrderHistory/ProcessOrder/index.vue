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
                    <v-checkbox
                        v-model="receivedCheckbox"
                        label="Received"
                        disabled
                    ></v-checkbox>
                    <v-checkbox
                        v-model="wetworkCheckbox"
                        label="Wetwork"
                        disabled
                    ></v-checkbox>
                    <v-checkbox
                        v-model="uploadedGenomeCheckbox"
                        label="Raw Data"
                        disabled
                    ></v-checkbox>
                    <v-checkbox
                        v-model="uploadedReportCheckbox"
                        label="Report"
                        disabled
                    ></v-checkbox>
                    <v-checkbox
                        v-model="sentCheckbox"
                        label="Sent"
                        disabled
                    ></v-checkbox>
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
                <SpecimenRejected
                    v-if="isStatusRejected"
                    :rejectMessage="rejectMessage"
                />
                <ReceiveSpecimen 
                    v-if="showReceiveDialog" 
                    :specimen-number="specimenNumber"
                    @specimenReceived="receivedCheckbox = true" />
                <QualityControlSpecimen
                    v-if="showQualityControlDialog"
                    :specimen-number="specimenNumber"
                    @qualityControlPassed="qualityControl = true" 
                    @specimentRejected="isStatusRejected = true"/>
                <WetworkSpecimen
                    v-if="showWetworkDialog && !isStatusRejected"
                    :specimen-number="specimenNumber"
                    @wetworkFinished="wetworkCheckbox = true" />
                <ProcessSpecimen 
                    v-if="showGenomeReportDialog && !isStatusRejected"
                    :order-id="orderId"
                    :specimen-number="specimenNumber"
                    :public-key="publicKey"
                    :is-processed="isOrderProcessed"
                    :wetwork-checkbox="wetworkCheckbox"
                    @processWetwork="wetworkCheckbox = true"
                    @uploadGenome="uploadedGenomeCheckbox = true"
                    @uploadReport="uploadedReportCheckbox = true"
                    @submitTestResult="submitTestResult" />
                
            </v-col>
        </v-row>
      </v-container>
   </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ReceiveSpecimen from './ReceiveSpecimen'
import QualityControlSpecimen from './QualityControlSpecimen'
import WetworkSpecimen from './WetworkSpecimen'
import ProcessSpecimen from './ProcessSpecimen'
import { getOrdersDetail } from '@/lib/polkadotProvider/query/orders'
import SpecimenRejected from './SpecimenRejected'

export default {
  name: 'ProcessOrderHistory',
  components: {
    ReceiveSpecimen,
    QualityControlSpecimen,
    WetworkSpecimen,
    ProcessSpecimen,
    SpecimenRejected,
  },
  data: () => ({
    receivedCheckbox: false,
    qualityControl: false,
    wetworkCheckbox: false,
    uploadedGenomeCheckbox: false,
    uploadedReportCheckbox: false,
    sentCheckbox: false,
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
    isStatusRejected: false,// Params if order rejected 
    rejectMessage: {
        title: '',
        description: '',
    },
  }),
  async mounted(){
    try {
      // If no order id redirect to order history list
      if (!this.orderId) {
        this.$router.push({ name: 'lab-dashboard-order-history' })
      }
      const order = await getOrdersDetail(this.api, this.orderId)
      this.serviceName = order.service_name
      this.serviceDescription = order.service_description
      this.serviceImage = order.service_image
      this.publicKey = order.customer_box_public_key
      this.createdAt = order.created_at
      this.customerEthAddress = order.customer_eth_address ? order.customer_eth_address : "Address not set"
      this.sellerEthAddress = order.seller_eth_address
      this.specimenNumber = order.dna_sample_tracking_id
      this.specimenStatus = order.dna_sample_status
      this.rejectMessage = order.dna_sample_message
      this.setCheckboxByDnaStatus()
      this.checkStatus(this.specimenStatus)
      console.log(order.status, '<= order status')//deleted soon
      console.log(this.specimenStatus, '<= specimen status')//deleted soon
      console.log(order, '<= order')//deleted soon
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    async setCheckboxByDnaStatus(){
        console.log(this.specimenStatus, '<= specimen status / dna status')
        console.log(this.isStatusRejected, '<= IS FAILED')
        if(this.specimenStatus == "Rejected") {
            return
        }

        if(this.specimenStatus == "Arrived") {
            this.receivedCheckbox = true
        }

        if(this.specimenStatus == "Extracted") {
            this.receivedCheckbox = true
            this.qualityControl = true
        }

        if(this.specimenStatus == "Computed") {
            this.receivedCheckbox = true
            this.qualityControl = true
            this.wetworkCheckbox = true
        }

        if(this.specimenStatus == "Genotyped") {
            this.receivedCheckbox = true
            this.qualityControl = true
            this.wetworkCheckbox = true
            this.uploadedGenomeCheckbox = true
        }

        if(this.specimenStatus == "Reviewed") {
            this.receivedCheckbox = true
            this.qualityControl = true
            this.wetworkCheckbox = true
            this.uploadedReportCheckbox = true
        }

        if(this.specimenStatus == "Success") {
            this.receivedCheckbox = true
            this.wetworkCheckbox = true
            this.uploadedGenomeCheckbox = true
            this.uploadedReportCheckbox = true
            this.sentCheckbox = true
            this.isOrderProcessed = true
        }
    },
    async submitTestResult(){
      try {
        console.log('Submitting test result!')
        this.sentCheckbox = true
      } catch (err) {
        console.log(err)
      }
    },
    getImageLink(val){
        if(val && val != ""){
          return val
        }
        return "https://ipfs.io/ipfs/QmaGr6N6vdcS13xBUT4hK8mr7uxCJc7k65Hp9tyTkvxfEr"
    },
    checkStatus(status) {
        console.log('masuk check status')
        console.log(status)
        console.log(this.isStatusRejected, 'sebelum kondisi')
        if (status == "Failed") {
            this.isStatusRejected = true
        } else {
            this.isStatusRejected = false
        }
        console.log(this.isStatusRejected, 'setelah kondisi')
    },
    // rejectSpecimenMessage(data) {
    //     console.log(data, '<= data')
    //     console.log(data.title, '<= title')
    //     console.log(data.description, '<= description') gimana caranya kalo udah keupdate messagenya langsung keupdate juga page nya
    //     // this.rejectMessage.title = data.title
    //     // this.rejectMessage.description = data.description
    // },
  },
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),
    orderId() {
      return this.$route.params.order_id ? this.$route.params.order_id : ''
    },
    showReceiveDialog(){
        return !this.receivedCheckbox
    },
    showQualityControlDialog(){
        return this.receivedCheckbox && !this.qualityControl
    },
    showWetworkDialog(){
        return this.qualityControl && !this.wetworkCheckbox
    },
    showGenomeReportDialog(){
        return this.wetworkCheckbox
    },
    _icon() {
      return this.serviceImage && (this.serviceImage.startsWith('mdi') || this.serviceImage.startsWith('$'))
        ? this.serviceImage
        : false
    },
  },
}
</script>
