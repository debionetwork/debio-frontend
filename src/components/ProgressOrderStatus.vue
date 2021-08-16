<template>
  <v-card class="dg-card" elevation="0" outlined>
    <v-card-title class="px-8">
      <div class="text-h6">Your Result are expected by {{expectedDate}}</div>
    </v-card-title>
    <v-card-text class="px-8">
      <div>Keep in mind processing times may vary and it may take up to {{lateExpectedDate}} to receive your result</div>
    </v-card-text>
    <div class="px-6">
      <v-row>
        <v-col>
          <Stepper
              :stepper-items="stepperItems"
          />
        </v-col>
      </v-row>
    </div>
    <div class="mb-5 ml-8 mr-8 mt-8">
      <Button
        dark
        @click="goToResult"
        :disabled="!resultIsReady"
        elevation="2"
        :color="btnColor"
      >
      View Result</Button>
    </div>
  </v-card>
</template>

<script>
import Button from '@/components/Button'
import Stepper from '@/components/Stepper'
import { mapGetters } from 'vuex'
import { getOrdersDetail } from '@/lib/polkadotProvider/query/orders'

export default {
  name: "ProgressOrderStatus",
  props: {
    orderId: String
  },
  components: {
    Button,
    Stepper,
  },
  data: () => ({
    specimenStatus: '',
    resultIsReady: false,
    btnColor: "grey",
    expectedDate: 'july 5th, 2020',
    lateExpectedDate: 'july 26th, 2020',
    order: null,
    stepperItems: [
        { name: 'Registered', selected: false},
        { name: 'Received', selected: false},
        { name: 'QC (DNA prep and extraction)', selected: false},
        { name: 'Genotyping/Sequencing', selected: false},
        { name: 'Review', selected: false},
        { name: 'Compute', selected: false},
        { name: 'Results Ready', selected: false},
    ],
    isProcessCompleted: false,
  }),
  async mounted() {
    try {
      this.order = await getOrdersDetail(this.api, this.orderId)
      this.specimenStatus = this.order.dna_sample_status
      this.setCheckBoxByDnaStatus()
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    goToResult() {
      this.$router.push({
        name: "result-test",
        params: { number: this.order.dna_sample_tracking_id },
      });
    },
    async setCheckBoxByDnaStatus() {
      if (this.specimenStatus == 'Registered') {
        this.setStepperSelected(['Registered'], true)
      }
      if (this.specimenStatus == 'Arrived') {
        this.onSpecimenRecieved()
      }

      if (this.specimenStatus == 'QualityControlled') {
        this.onQcCompleted()
      }

      if (this.specimenStatus == 'GenotypedSequenced') {
        this.onGenotypeFinished()
      }
      
      if (this.specimenStatus == 'Reviewed') {
        this.onSpecimenRecieved()
      }

      if (this.specimenStatus == 'Computed') {
        this.onSpecimentComputed()
      }

      if (this.specimenStatus == 'ResultReady') {
        this.onResultReady()
        this.resultIsReady = true
        this.btnColor = "#52ffb6"
      }
    },
    setStepperSelected(names, selected) {
      this.stepperItems = this.stepperItems.map(item => {
        if (names.includes(item.name)) {
          return { ...item, selected }
        }
        return { ...item }
      })
    },
    onSpecimenRegistered() {
      this.setStepperSelected(['Registered'], true)
    },
    onSpecimenRecieved() {
      this.setStepperSelected([
        'Registered',
        'Received',
      ], true)
    },
    onQcCompleted() {
      this.setStepperSelected([
        'Registered',
        'Received',
        'QC (DNA prep and extraction)',
      ], true)
    },
    onGenotypeFinished() {
      this.setStepperSelected([
        'Registered',
        'Received',
        'QC (DNA prep and extraction)',
        'Genotyping/Sequencing',
      ], true)
    },
    onSpecimenReeviewed() {
      this.setStepperSelected([
        'Registered',
        'Received',
        'QC (DNA prep and extraction)',
        'Genotyping/Sequencing',
        'Review',
      ], true)
    },
    onSpecimentComputed() {
      this.setStepperSelected([
        'Registered',
        'Received',
        'QC (DNA prep and extraction)',
        'Genotyping/Sequencing',
        'Review',
        'Compute'
      ], true)
    },
    onResultReady() {
      this.setStepperSelected([
        'Registered',
        'Received',
        'QC (DNA prep and extraction)',
        'Genotyping/Sequencing',
        'Review',
        'Compute',
        'Results Ready'
      ], true)
    },
  },
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),
  }
}
</script>

<style>

</style>