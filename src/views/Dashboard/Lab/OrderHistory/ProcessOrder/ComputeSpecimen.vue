<template>
    <div class="mt-5">
        <v-btn
            color="primary"
            block
            @click="computeDialog = true"
        >Complete Compute</v-btn>

        <Dialog :show="computeDialog" @close="computeDialog = false">
            <template v-slot:title>
                <div></div>
            </template>
            <template v-slot:body>
              <div class="d-flex justify-center pb-5 pt-5">
                <v-img v-bind:src="require('@/assets/debio-logo.png')" max-width="50" />
              </div>
              <div align="center" class="pb-5">Are you sure you want to complete computation process?</div>
            </template>
            <template v-slot:actions>
              <v-col col="12" md="6">
                <Button @click="processDnaSample" :loading="isProcessing" elevation="2" dark>Yes</Button>
              </v-col>
              <v-col col="12" md="6">
                <Button @click="computeDialog = false" :disabled="isProcessing" elevation="2" color="purple" dark>No</Button>
              </v-col>
            </template>
        </Dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex"
import Dialog from "@/components/Dialog"
import { processDnaSample } from "@/lib/polkadotProvider/command/geneticTesting"
import Button from '@/components/Button'

export default {
  name: "ComputeSpecimen",
  components: {
    Dialog,
    Button,
  },
  props: {
    specimenNumber: String,
  },
  data: () => ({
    isProcessing: false,
    computeDialog: false,
    computeAlertDialog: false,
  }),
  computed: {
    ...mapGetters({
      api: "substrate/getAPI",
      pair: "substrate/wallet",
    }),
  },
  methods:{
    async processDnaSample() {
      this.isProcessing = true
      await processDnaSample(
        this.api,
        this.pair,
        this.specimenNumber,
        "Computed",
        () => {
          this.isProcessing = false
          this.computeDialog = false
          this.$emit("computedSpecimen")
          this.computeAlertDialog = true
        }
      )
    },
  },
}
</script>

<style>

</style>