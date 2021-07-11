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
                        label="Genome"
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
                <ReceiveSpecimen 
                    v-if="showReceiveDialog" 
                    :specimenNumber="specimenNumber" 
                    @specimenReceived="receivedCheckbox = true" />
                <ProcessSpecimen 
                    v-if="showGenomeReportDialog"
                    :order-id="orderId"
                    :specimen-number="specimenNumber"
                    :public-key="publicKey"
                    :is-processed="isOrderProcessed"
                    :wetwork-checkbox="wetworkCheckbox"
                    @processWetwork="wetworkCheckbox = true"
                    @uploadGenome="uploadedGenomeCheckbox = true"
                    @uploadReport="uploadedReportCheckbox = true"
                    @submitTestResult="submitTestResult" />
                <!-- <OrderFinished v-if="showSentDialog" /> -->
            </v-col>
        </v-row>
      </v-container>
   </div>
</template>

<script>
import { mapGetters } from 'vuex'
//import { Keyring } from '@polkadot/keyring'
// import OrderFinished from './OrderFinished'
import ReceiveSpecimen from './ReceiveSpecimen'
import ProcessSpecimen from './ProcessSpecimen'
import { getOrdersDetail } from '@/lib/polkadotProvider/query/orders'
import { queryDnaSamples } from '@/lib/polkadotProvider/query/geneticTesting'

export default {
  name: 'ProcessOrderHistory',
  components: {
    ReceiveSpecimen,
    ProcessSpecimen,
    // OrderFinished,
  },
  data: () => ({
    receivedCheckbox: false,
    wetworkCheckbox: false,
    uploadedGenomeCheckbox: false,
    uploadedReportCheckbox: false,
    sentCheckbox: false,
    publicKey: "",
    createdAt: "",
    customerEthAddress: "",
    sellerEthAddress: "",
    specimenNumber: "",
    isOrderProcessed: false,
    serviceName: "",
    serviceDescription: "",
    serviceImage: "",
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
      this.setCheckboxByDnaStatus()
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    async setCheckboxByDnaStatus(){
        const dna = await queryDnaSamples(this.api, this.specimenNumber)
        if(!dna) return

        if(dna.status == "Received") {
            this.receivedCheckbox = true
        }

        if(dna.status == "Rejected") {
            this.receivedCheckbox = true
        }

        if(dna.status == "Processing") {
            this.receivedCheckbox = true
            this.wetworkCheckbox = true
        }

        if(dna.status == "Success") {
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
    showGenomeReportDialog(){
        return this.receivedCheckbox
        // return this.receivedCheckbox && !this.sentCheckbox
    },
    _icon() {
      return this.serviceImage && (this.serviceImage.startsWith('mdi') || this.serviceImage.startsWith('$'))
        ? this.serviceImage
        : false
    },
  },
}
</script>
