<template>
  <v-card class="dg-card mt-5" elevation="0" outlined>
    <DialogErrorBalance
      :show="isShowError"
      @close="closeDialog"
    />
    <div class="px-8 mt-5">
      <div class= "d-flex justify-space-between" >
        <div class="mb-5">
          <span
            style="font-size: 12px"
          > Estimated Transaction Weight </span>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  color="primary"
                  size="14"
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
    </div>

    <v-form v-model="valid" class="d-flex px-8">
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
        :disabled="!(specimenNumber == confirmSpecimenNumber)"
        :loading="isLoading"
        @click="receiveDnaSample"
        >RECEIVE SPECIMEN</v-btn>
    </v-form>

    <DialogAlert
      :show="specimenAlertDialog"
      btnText="Continue"
      textAlert="Specimen has been received"
      imgPath="success.png"
      imgWidth="50"
      @toggle="specimenAlertDialog = $event"
      @close="$emit('specimenReceived')"
    ></DialogAlert>
  </v-card>
</template>


<script>
import { mapGetters, mapState } from "vuex"
import { processDnaSample, processDnaSampleFee } from "@/lib/polkadotProvider/command/geneticTesting"
import DialogAlert from "@/components/Dialog/DialogAlert"
import DialogErrorBalance from "@/components/Dialog/DialogErrorBalance"

export default {
  name: "ReceiveSpecimen",
  components: {
    DialogAlert,
    DialogErrorBalance
  },

  props: {
    specimenNumber: String,
    isBiological: Boolean
  },

  data: () => ({
    isShowError: false,
    isLoading: false,
    valid: false,
    confirmSpecimenNumber: "",
    confirmSpecimenNumberRule: (password) => (val) =>
      (!!password && password == val) || "Specimen number must match.",
    specimenAlertDialog: false,
    fee: 0,
    nextStatus: ""
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
    this.getNextStatus()
    this.getProcessDnaSampleFee()
  },

  methods:{

    getNextStatus() {
      if (this.valid) {
        if (!this.isBiological) {
          this.nextStatus = "Arrived"
          return
        }
      }
      this.nextStatus = "QualityControlled"
    },

    async receiveDnaSample() {
      try {
        this.isLoading = true
        await processDnaSample(
          this.api,
          this.pair,
          this.specimenNumber,
          this.nextStatus,
          () => {
            this.isLoading = false
            this.specimenAlertDialog = true
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

    async getProcessDnaSampleFee() {
      const fee = await processDnaSampleFee(this.api, this.pair, this.specimenNumber, this.nextStatus)
      this.fee = this.web3.utils.fromWei(String(fee.partialFee), "ether")
    }
  }
}
</script>
