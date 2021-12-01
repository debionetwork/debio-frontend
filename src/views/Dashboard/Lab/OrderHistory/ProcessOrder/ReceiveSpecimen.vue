<template>
    <v-card class="dg-card mt-5" elevation="0" outlined>
        <v-form v-model="valid" class="d-flex px-8 mt-5">
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
import { mapGetters } from 'vuex'
import { processDnaSample } from '@/lib/polkadotProvider/command/geneticTesting'
import DialogAlert from '@/components/Dialog/DialogAlert'

export default {
  name: 'ReceiveSpecimen',
  components: {
    DialogAlert,
  },
  props: {
    specimenNumber: String,
    isBiological: Boolean
  },
  data: () => ({
    isLoading: false,
    valid: false,
    confirmSpecimenNumber: "",
    confirmSpecimenNumberRule: (password) => (val) =>
        (!!password && password == val) || "Specimen number must match.",
    specimenAlertDialog: false,
  }),
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),
  },
  methods:{
    async receiveDnaSample() {
      if(this.valid){
        this.isLoading = true
        if (!this.isBiological) {
          await processDnaSample(
            this.api,
            this.pair,
            this.specimenNumber,
            "Arrived",
            () => {
              this.isLoading = false
              this.specimenAlertDialog = true
            }
          )
        } else {
          await processDnaSample(
            this.api,
            this.pair,
            this.specimenNumber,
            "QualityControlled",
            () => {
              this.isLoading = false
              this.specimenAlertDialog = true
            }
          )
        }
      }
    },
  },
}
</script>
