<template>
    <div class="mt-5">
        <DialogErrorBalance
          :show="isShowError"
          @close="closeDialog"
        />
        <v-btn 
            color="primary"
            block
            @click="wetWorkDialog = true"
        >Complete Analysis Process</v-btn>

        <Dialog :show="wetWorkDialog" @close="wetWorkDialog = false">
            <template v-slot:title>
                <div></div>
            </template>
            <template v-slot:body>
                <div class="d-flex justify-center pb-5 pt-5">
                    <v-img v-bind:src="require('@/assets/debio-logo.png')" max-width="50" />
                </div>
                <div align="center" class="pb-5">Are you sure you want to complete the Analysis process?</div>
                <div class="ml-5 mr-5 pb-1 d-flex justify-space-between mt-5">
                  <div>
                    <span style="font-size: 12px"> Estimated Transaction Weight </span>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="primary"
                          size="12"
                          v-bind="attrs"
                          v-on="on"
                        > mdi-alert-circle-outline
                        </v-icon>
                      </template>
                      <span style="font-size: 10px;">Total fee paid in DBIO to execute this transaction.</span>
                    </v-tooltip>
                  </div>
                  <div>
                    <span style="font-size: 12px;">
                      {{ Number(fee).toFixed(4) }} DBIO
                    </span>
                  </div>
                </div>
            </template>
            <template v-slot:actions>
                <v-col col="12" md="6">
                  <Button @click="processDnaSample" :loading="isProcessing" elevation="2" dark>Yes</Button>
                </v-col>
                <v-col col="12" md="6">
                  <Button @click="wetWorkDialog = false" :disabled="isProcessing" elevation="2" color="purple" dark>No</Button>
                </v-col>
            </template>
        </Dialog>

        <DialogAlert
            :show="wetWorkAlertDialog"
            btnText="Continue"
            textAlert="Analysis process has been completed."
            imgPath="success.png"
            imgWidth="50"
            @toggle="wetWorkAlertDialog = $event"
            @close="closeWetWorkAlertDialog"
        ></DialogAlert>

    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import Dialog from "@/components/Dialog"
import DialogAlert from "@/components/Dialog/DialogAlert"
import Button from "@/components/Button"
import { processDnaSample, processDnaSampleFee } from "@/lib/polkadotProvider/command/geneticTesting"
import DialogErrorBalance from "@/components/Dialog/DialogErrorBalance"

export default {
  name: "WetWork",
  components: {
    Dialog,
    DialogAlert,
    DialogErrorBalance,
    Button
  },

  props: {
    specimenNumber: String
  },
  
  data: () => ({
    isProcessing: false,
    isShowError: false,
    wetWorkDialog: false,
    wetWorkAlertDialog: false,
    nextStatus: "WetWork",
    fee: 0
  }),

  computed: {
    ...mapGetters({
      api: "substrate/getAPI",
      pair: "substrate/wallet"
    }),

    ...mapState({
      web3: (state) => state.metamask.web3
    })
  },

  async mounted() {
    await this.getProcessDnaSampleFee()
  },

  methods:{
    async processDnaSample() {
      try {
        this.isProcessing = true
        await processDnaSample(
          this.api,
          this.pair,
          this.specimenNumber,
          this.nextStatus,
          () => {
            this.isProcessing = false
            this.wetWorkDialog = false
            this.wetWorkAlertDialog = true
          }
        )
      } catch (err) {
        if (err.message === "1010: Invalid Transaction: Inability to pay some fees , e.g. account balance too low") {
          this.isShowError = true
        }
      }
    },

    closeDialog() {
      this.isShowError = false
    },

    closeWetWorkAlertDialog () {
      this.$emit("wetWorkCompleted")
    },

    async getProcessDnaSampleFee() {
      const fee = await processDnaSampleFee(this.api, this.pair, this.specimenNumber, this.nextStatus)
      this.fee = this.web3.utils.fromWei(String(fee.partialFee), "ether")
    }
  }
}
</script>
