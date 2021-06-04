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
                @click="receiveDnaSample"
                >RECEIVE SPECIMEN</v-btn>
        </v-form>
    </v-card>
</template>


<script>
import { mapGetters } from 'vuex'
import { receiveDnaSample } from '@/lib/polkadotProvider/command/geneticTesting'

export default {
  name: 'ReceiveSpecimen',
  props: {
    specimenNumber: String,
  },
  data: () => ({
    valid: false,
    confirmSpecimenNumber: "",
    confirmSpecimenNumberRule: (password) => (val) =>
        (!!password && password == val) || "Specimen number must match.",
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
            await receiveDnaSample(
              this.api,
              this.pair,
              this.specimenNumber,
            )
            this.$emit('specimenReceived')
        }
    },
  },
}
</script>