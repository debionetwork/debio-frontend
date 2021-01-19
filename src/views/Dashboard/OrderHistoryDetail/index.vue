<template>
  <div>
    <v-container>
      <v-row v-if="isLoading">
        <v-progress-linear
          v-if="isLoading"
          class="mt-2"
          indeterminate
          color="primary"
        ></v-progress-linear>
      </v-row>
      <v-row v-if="!isLoading && dataLoaded">
        <v-col cols="12" lg="6" md="6" xl="5">
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-text class="px-8">
              <div class="d-flex justify-space-between">
                <div class="text-h5">
                  Lab Details
                </div>
                <StatusChip :status="specimen.status" />
              </div>
              <div v-if="lab">
                <div class="text-subtitle-1">
                  <b>{{ lab.name }}</b>
                </div>
                <div class="text-body-2">
                  {{ lab.address }}
                </div>
                <div class="text-body-2">
                  {{ lab.city }}, {{ lab.country }}
                </div>
                <div v-if="lab.phone" class="text-body-2">
                  Phone: {{ lab.phone }}
                </div>
              </div>
              <div class="my-8">
              </div>
              <div class="text-h5">
                Product Details
              </div>

              <template>
                <div class="d-flex align-center fill-height mb-2">
                  <div class="my-3 ml-0">
                    <v-icon
                      v-if="isValidIcon(product.icon)"
                      color="#BA8DBB"
                      :size="48"
                    >
                    {{ product.icon }}
                    </v-icon>
                    <v-avatar v-else>
                      <img src="../../../assets/degenics-logo.webp" />
                    </v-avatar>
                  </div>
                  <div class="ml-5">
                    <div class="text-h6">
                      <b>{{ product.name }}</b>
                    </div>
                    <div class="text-caption grey--text text--darken-1">
                      {{ product.description }}
                    </div>
                  </div>
                  <v-spacer></v-spacer>
                  <div class="align-self-end pb-2">
                    <span class="text-h6">
                      {{ product.price }}
                    </span>
                    <span class="primary--text text-caption">
                      DGNX
                    </span>
                  </div>
                </div>
                <div>
                  <div><b>Specimen Number:</b></div>
                  <div class="grey--text text--darken-1">
                    {{ specimen.number | specimenNumber }}
                  </div>
                </div>
              </template>
            </v-card-text>
          </v-card>
          <!-- If order Success -->
          <div v-if="specimen.status == 'Succes'" class="mt-2">
            <Button color="green" @click="goToResult" dark>
              View Result
            </Button>
          </div>
        </v-col>

        <!-- If order is sending -->
        <v-col
          cols="12" lg="6" md="6" xl="5"
          v-if="specimen.status == 'Sending'"
        >
          <DNASampleSendingInstructions
            :specimenNumber="specimen.number"
            :lab="lab"
          >
          </DNASampleSendingInstructions>
        </v-col>

        <!-- If order is received -->
        <v-col
          cols="12" lg="6" md="6" xl="5"
          v-if="specimen.status == 'Received'"
        >
          <Refund :specimen="specimen" />
        </v-col>

        <!-- If order is rejected -->
        <v-col
          cols="12" lg="6" md="6" xl="5"
          v-if="specimen.status == 'Reject'"
        >
          <v-card class="dg-card">
            <v-card-title class="px-8">
              <div class="text-h6">
                Rejection Reason
              </div>
            </v-card-title>
            <v-card-text class="px-8">
              TODO: Rejection Reason
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import keystore from '../../../lib/keystore'
import DNASampleSendingInstructions from '../../../components/DNASampleSendingInstructions'
import StatusChip from '../../../components/StatusChip'
import Button from '../../../components/Button'
import Refund from './Refund'

export default {
  name: 'RequestTestSuccess',
  components: {
    DNASampleSendingInstructions,
    StatusChip,
    Button,
    Refund,
  },
  data: () => ({
    isLoading: false,
    lab: null,
    product: null,
    specimen: null,
  }),
  computed: {
    ...mapState({
      degenicsContract: state => state.ethereum.contracts.contractDegenics
    }),
    // If we don't check if data exists, vue will complain 😦 
    dataLoaded() {
      return this.lab && this.product && this.specimen
    }
  },
  async mounted() {
    this.isLoading = true
    await this.fetchOrderDetails()
    this.isLoading = false
  },
  methods: {
    isValidIcon(icon) {
      return icon && (icon.startsWith('mdi') || icon.startsWith('$'))
    },
    goToHome() {
      this.$router.push('/')
    },
    goToResult() {
      this.$router.push({ name: 'result-test', params: { number: this.specimen.number }})
    },
    async fetchOrderDetails() {
      const specimen = await this.getSpecimen()
      const lab = await this.getLabBySpecimen(specimen)
      const product = await this.getProduct(lab, specimen)
      this.product = product
      this.lab = lab
      this.specimen = specimen
    },
    async getSpecimen() {
      const ks = keystore.get()
      const specimenNumber = this.$route.params.number
      const specimen = await this.degenicsContract.methods
        .specimenByNumber(specimenNumber).call({ from: ks.address })

      return specimen
    },
    async getLabBySpecimen(specimen) {
      const ks = keystore.get()
      const lab = await this.degenicsContract.methods
        .labByAccount(specimen.labAccount).call({ from: ks.address })

      return lab
    },
    async getProduct(lab, specimen) {
      console.log(specimen)
      const ks = keystore.get()
      const services = await this.degenicsContract.methods
        .serviceCount(lab.labAccount).call({ from: ks.address })
        .then(async count => {
          const servicePromises = []
          for (let i = 1; i <= count; i++) {
            const promise = this.degenicsContract.methods
              .serviceByIndex(lab.labAccount, i).call({ from: ks.address })
            servicePromises.push(promise)
          }
          const _services = await Promise.all(servicePromises)
          return _services
        })
      const product = services.find(s => s.code == specimen.serviceCode)

      // Parse product additionalData
      try {
        const additionalData = JSON.parse(product.additionalData)
        if (additionalData.icon) {
          product.icon = additionalData.icon
        }
      } catch (err) {
        product.additionalData = {}
      }

      return product
    },
    async getLogs(specimen) {
      console.log(specimen)
      // TODO: Get specimen logs to get status information
    }
  }
}
</script>

<style>

</style>
