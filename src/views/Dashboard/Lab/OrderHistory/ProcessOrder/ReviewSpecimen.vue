<template>
    <div class="mt-5">
        <v-btn
            color="primary"
            block
            @click="reviewDialog = true"
        >Complete Review</v-btn>

        <Dialog :show="reviewDialog" @close="reviewDialog = false">
            <template v-slot:title>
                <div></div>
            </template>
            <template v-slot:body>
                <div class="d-flex justify-center pb-5 pt-5">
                    <v-img v-bind:src="require('@/assets/debio-logo.png')" max-width="50" />
                </div>
                <div align="center" class="pb-5">Are you sure you want to complete the review process</div>
            </template>
            <template v-slot:actions>
                <v-col col="12" md="6">
                  <Button @click="processDnaSample" :loading="isProcessing" elevation="2" dark>Yes</Button>
                </v-col>
                <v-col col="12" md="6">
                  <Button @click="reviewDialog = false" :disabled="isProcessing" elevation="2" color="purple" dark>No</Button>
                </v-col>
            </template>
        </Dialog>

        <DialogAlert
            :show="reviewAlertDialog"
            btnText="Continue"
            textAlert="Completed Review"
            imgPath="success.png"
            imgWidth="50"
            @toggle="reviewAlertDialog = $event"
            @close="closeReviewAlertDialog"
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
  name: "ReviewSpecimen",
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
    reviewDialog: false,
    reviewAlertDialog: false,
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
        "Reviewed",
        () => {
          this.isProcessing = false
          this.reviewDialog = false
          this.reviewAlertDialog = true
        }
      )
    },
    closeReviewAlertDialog () {
      this.$emit("reviewedSpecimen")
    }
  },
}
</script>

<style>

</style>