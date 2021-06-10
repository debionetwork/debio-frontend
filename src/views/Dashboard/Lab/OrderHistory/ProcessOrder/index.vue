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
                            <b class="secondary--text h6">{{ this.createdAt }}</b>
                        </div>
                        <div class="d-flex justify-space-between">
                            <div class="d-flex align-center">
                                <div>
                                    <v-icon color="#BA8DBB" :size="52">
                                        mdi-test-tube
                                    </v-icon>
                                </div>
                                <div class="ml-5">
                                    <div class="text-h6">
                                        <b>Supplement</b>
                                    </div>
                                    <div class="text-caption grey--text text--darken-1">
                                        Supplement recommendation based on your genes
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
                    @processWetwork="wetworkCheckbox = true"
                    @uploadGenome="uploadedGenomeCheckbox = true"
                    @uploadReport="uploadedReportCheckbox = true"
                    @submitTestResult="sentCheckbox = true" />
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
  }),
  mounted(){
    // Get data from route param
    const keyring = new Keyring();
    this.publicKey = keyring.decodeAddress(this.$route.params.item.customer_id)
    this.createdAt = this.$route.params.item.created_at
    this.customerEthAddress = this.$route.params.item.customer_eth_address
    this.sellerEthAddress = this.$route.params.item.seller_eth_address
    this.specimenNumber = this.$route.params.item.dna_sample_tracking_id
  },
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),
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