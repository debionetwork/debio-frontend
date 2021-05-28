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
                        v-model="checkbox"
                        label="Received"
                    ></v-checkbox>
                    <v-checkbox
                        v-model="checkbox"
                        label="Wetwork"
                    ></v-checkbox>
                    <v-checkbox
                        v-model="checkbox"
                        label="Genome"
                    ></v-checkbox>
                    <v-checkbox
                        v-model="checkbox"
                        label="Report"
                    ></v-checkbox>
                    <v-checkbox
                        v-model="checkbox"
                        label="Sent"
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
                <v-card class="dg-card mt-5" elevation="0" outlined>
                    <v-card-text class="d-flex px-8 mt-5">
                        <v-text-field
                            dense
                            label="Confirm Specimen Number"
                            placeholder="Confirm Specimen Number"
                            outlined
                            :rules="[confirmSpecimenNumberRule(specimenNumber)]"
                            v-model="confirmSpecimenNumber"
                            ></v-text-field>

                        <v-btn
                            class="ml-5"
                            style="width: 35%"
                            color="primary"
                            large
                            @click="receiveDnaSample"
                            >RECEIVE SPECIMEN</v-btn>
                    </v-card-text>
                </v-card>
                <div>
                    <v-checkbox
                        v-model="checkbox"
                        label="Wetwork is done"
                    ></v-checkbox>
                    <div class="d-flex justify-space-evenly">
                        <v-btn
                            class="mb-3 mr-3"
                            style="width: 50%"
                            color="primary"
                            large
                            >UPLOAD GENOME</v-btn>
                        <v-btn
                            class="mb-3 mr-3"
                            style="width: 50%"
                            color="primary"
                            large
                            >UPLOAD REPORT</v-btn>
                    </div>
                    <div class="d-flex justify-space-evenly">
                        <v-btn
                            class="mb-3 mr-3"
                            style="width: 50%"
                            color="primary"
                            large
                            @click="updateLab"
                            >SEND</v-btn>
                        <v-btn
                            class="mb-3 mr-3"
                            style="width: 50%"
                            color="primary"
                            large
                            @click="rejectDnaSample"
                            >REJECT</v-btn>
                    </div>
                </div>
                <div>
                    <div class="d-flex mb-8 justify-space-between">
                        <div style="width: 50%;">
                            <b class="secondary--text card-header">Genome Files</b>
                            <v-card class="d-flex pa-2 justify-space-between">
                                <b>Genome.txt</b>
                                <v-icon>
                                    mdi-eye
                                </v-icon>
                            </v-card>
                        </div>
                        <div class="ml-5" style="width: 50%;">
                            <b class="secondary--text card-header">Report Files</b>
                            <v-card class="d-flex pa-2 justify-space-between">
                                <b>Report.txt</b>
                                <v-icon>
                                    mdi-eye
                                </v-icon>
                            </v-card>
                        </div>
                    </div>
                    <v-alert
                        type="success"
                        >Specimen Processed</v-alert>
                </div>
            </v-col>
        </v-row>
      </v-container>
   </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { processDnaSample, receiveDnaSample, rejectDnaSample, submitTestResult } from '@/lib/polkadotProvider/command/geneticTesting'

export default {
  name: 'ProcessOrderHistory',
  data: () => ({
    comment: "",
    reportLink: "",
    resultLink: "",
    isProcessSuccess: true,
    customerEthAddress: "",
    sellerEthAddress: "",
    createdAt: "",
    specimenNumber: "",
    confirmSpecimenNumber: "",
    confirmSpecimenNumberRule: (password) => (val) =>
        (!!password && password == val) || "Specimen number must match.",
  }),
  mounted(){
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
  },
  method:{
    async processDnaSample() {
      await processDnaSample(
        this.api,
        this.pair,
        this.specimenNumber,
      )
      // Wait for transaction to finish before refreshing Vuex store
      await this.$store.dispatch('substrate/getLabAccount')
      this.$router.push('/lab/services')
    },
    async receiveDnaSample() {
      await receiveDnaSample(
        this.api,
        this.pair,
        this.specimenNumber,
      )
      // Wait for transaction to finish before refreshing Vuex store
      await this.$store.dispatch('substrate/getLabAccount')
      this.$router.push('/lab/services')
    },
    async rejectDnaSample() {
      await rejectDnaSample(
        this.api,
        this.pair,
        this.specimenNumber,
      )
      // Wait for transaction to finish before refreshing Vuex store
      await this.$store.dispatch('substrate/getLabAccount')
      this.$router.push('/lab/services')
    },
    async submitTestResult() {
      await submitTestResult(
        this.api,
        this.pair,
        this.specimenNumber,
        this.isProcessSuccess,
        {
          comment: this.comment,
          report_link: this.reportLink,
          result_link: this.resultLink
        }
      )
      // Wait for transaction to finish before refreshing Vuex store
      await this.$store.dispatch('substrate/getLabAccount')
      this.$router.push('/lab/services')
    },
  },
}
</script>