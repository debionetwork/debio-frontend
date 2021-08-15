<template>
    <div class="mt-5">
        <v-btn 
            color="primary"
            block
            @click="genotypeDialog = true"
        >Complete Genotyping/Sequencing process</v-btn>

        <Dialog :show="genotypeDialog" @close="genotypeDialog = false">
            <template v-slot:title>
                <div></div>
            </template>
            <template v-slot:body>
                <div class="d-flex justify-center pb-5 pt-5">
                    <v-img v-bind:src="require('@/assets/debio-logo.png')" max-width="50" />
                </div>
                <div align="center" class="pb-5">Are you sure you want to complete the Genotyping/Sequencing process?</div>
            </template>
            <template v-slot:actions>
                <v-col col="12" md="6">
                  <Button @click="processDnaSample" :loading="isProcessing" elevation="2" dark>Yes</Button>
                </v-col>
                <v-col col="12" md="6">
                  <Button @click="genotypeDialog = false" :disabled="isProcessing" elevation="2" color="purple" dark>No</Button>
                </v-col>
            </template>
        </Dialog>

        <DialogAlert
            :show="genotypeAlertDialog"
            btnText="Continue"
            textAlert="Genotyping/Sequencing has been completed."
            imgPath="success.png"
            imgWidth="50"
            @toggle="genotypeAlertDialog = $event"
            @close="closeGenotypeAlertDialog"
        ></DialogAlert>

    </div>
</template>

<script>
import { mapGetters } from "vuex"
import Dialog from "@/components/Dialog"
import DialogAlert from "@/components/Dialog/DialogAlert"
import Button from '@/components/Button'
import { processDnaSample } from "@/lib/polkadotProvider/command/geneticTesting"

export default {
  name: "GenotypeSpecimen",
  components: {
    Dialog,
    DialogAlert,
    Button,
  },
  props: {
    specimenNumber: String,
  },
  data: () => ({
    isProcessing: false,
    genotypeDialog: false,
    genotypeAlertDialog: false,
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
        "GenotypedSequenced",
        () => {
          this.isProcessing = false
          this.genotypeDialog = false
          this.genotypeAlertDialog = true
        }
      )
    },
    closeGenotypeAlertDialog () {
      this.$emit("genotypeFinished")
    }
  },
}
</script>

<style>

</style>