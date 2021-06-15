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
                                    <v-icon color="#BA8DBB" :size="52">
                                      {{ serviceInfo.image }}
                                    </v-icon>
                                </div>
                                <div class="ml-5">
                                    <div style="">
                                      <b>{{ serviceInfo.name }}</b>
                                    </div>
                                    <div class="text-caption grey--text text--darken-1">
                                      {{ serviceInfo.description.substring(0, 60) }}...
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
                    :specimenNumber="specimenNumber"
                    :publicKey="publicKey"
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
import { Keyring } from '@polkadot/keyring'
// import OrderFinished from './OrderFinished'
import ReceiveSpecimen from './ReceiveSpecimen'
import ProcessSpecimen from './ProcessSpecimen'
import { fulfillOrder } from '@/lib/polkadotProvider/command/orders'
import { getOrdersDetail } from '@/lib/polkadotProvider/query/orders'
import { queryDnaSamples } from '@/lib/polkadotProvider/query/geneticTesting'
import { queryServicesById } from '@/lib/polkadotProvider/query/services'

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
    serviceInfo: {
      name: "",
      description: "",
      image: "",
    }
  }),
  async mounted(){
    try {
      // If no order id redirect to order history list
      if (!this.orderId) {
        this.$router.push({ name: 'lab-dashboard-order-history' })
      }
      const order = await getOrdersDetail(this.api, this.orderId)

      await this.getServiceDetail(order.service_id)

      // Get data from route param
      const keyring = new Keyring();
      this.publicKey = keyring.decodeAddress(order.customer_id)
      this.createdAt = order.created_at
      this.customerEthAddress = order.customer_eth_address
      this.sellerEthAddress = order.seller_eth_address
      this.specimenNumber = order.dna_sample_tracking_id
      this.setCheckboxByDnaStatus()
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    async getServiceDetail(serviceId) {
      const service = await queryServicesById(this.api, serviceId)
      this.serviceInfo = { ...service.info }
    },
    async setCheckboxByDnaStatus(){
        const dna = await queryDnaSamples(this.api, this.specimenNumber)

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
        await fulfillOrder(
            this.api,
            this.pair,
            this.orderId,
        )
        this.sentCheckbox = true
      } catch (err) {
        console.log(err)
      }
    }
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
    // showSentDialog(){
    //     return this.sentCheckbox
    // }
  },
}
</script>
