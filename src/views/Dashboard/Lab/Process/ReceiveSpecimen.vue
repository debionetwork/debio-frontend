<template>
  <v-card class="px-4 dg-card">
    <v-row class="mt-4">
      <v-col cols="12" md="8" style="padding-top: 14px;">
        <v-text-field
          class="confirm-specimen-number-text-field"
          hide-details="auto"
          label="Confirm specimen number"
          outlined
          dense
          color="primary"
          :disabled="isLoading"
          :value="confirmSpecimenNumberWithDashes"
          @input="onSpecimenNumberInput"
          :error-messages="errorMessages"
          @keyup.enter="receiveSpecimen"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn
          depressed
          color="blue"
          large
          width="100%"
          @click="receiveSpecimen"
          :disabled="!confirmSpecimenNumber || isLoading"
          :loading="isLoading"
          style="color: white;"
        >
          Receive Specimen
           <template v-slot:loader>
            <v-progress-linear indeterminate color="white"></v-progress-linear>
          </template>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import sendTransaction from '@/lib/send-transaction'

export default {
  name: 'ReceiveSpecimen',
  props: {
    specimen: Object,
    wallet: Object,
  },
  data: () => ({
    confirmSpecimenNumber: '',
    confirmSpecimenNumberDisplay: '',
    errorMessages: [],
    isLoading: false,
  }),
  computed: {
    ...mapState({
      contractDegenics: state => state.ethereum.contracts.contractDegenics
    }),
    ...mapGetters({
      getRole: 'auth/getRole'
    }),
    /**
     * show specimen number with dashes
     */
    confirmSpecimenNumberWithDashes() {
      const textArr = this.confirmSpecimenNumberDisplay.split('')
      if (textArr[textArr.length-1] == '-') {
        return textArr.slice(0, textArr.length - 1).join('')
      }
      if (textArr.length == 4) {
        textArr.push('-')
        return textArr.join('')
      }
      if (textArr.length == 5) {
        textArr.splice(4, 0, '-')
        return textArr.join('')
      }
      if (textArr.length == 9) {
        textArr.push('-')
        return textArr.join('')
      }
      if (textArr.length == 10) {
        textArr.splice(9, 0, '-')
        return textArr.join('')
      }
      return textArr.join('')
    }
  },
  methods: {
    ...mapActions({
      fetchRole: 'auth/getRole'
    }),
    onSpecimenNumberInput(val) {
      if (this.errorMessages.length > 0) {
        this.errorMessages = []
      }
      this.confirmSpecimenNumberDisplay = val
      this.confirmSpecimenNumber = val.replace(/-/g, '')
    },
    async receiveSpecimen() {
      // Reset error message
      this.errorMessages = []

      if (this.confirmSpecimenNumber != this.specimen.number) {
        this.errorMessages = ['Wrong specimen number']
        return
      }
      
      try {
        this.isLoading = true

        const degenicsContract = this.contractDegenics._address;
        const abiData = this.contractDegenics.methods
          .receiveSpecimen(this.confirmSpecimenNumber, this.wallet.publicKey)
          .encodeABI()
        let tx = await sendTransaction(degenicsContract, this.wallet, abiData)

        this.isLoading = false
        this.$emit('specimenReceived', tx)

      } catch (err) {
        this.errorMessages = [err.message]
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="scss">
.confirm-specimen-number-text-field {
  // background-color: #e5e5e5;
  fieldset {
    border: 2px solid #b1b1b1;
  }
}
</style>