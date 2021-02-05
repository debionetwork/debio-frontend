<template>
  <div class="py-4">
    <v-row>
      <v-col cols="12" md="6">
        <v-btn
          depressed
          large
          color="green"
          width="100%"
          @click="onClickSend"
          :disabled="isLoading || !canSend"
          style="color: white;"
        >
          Send
        </v-btn>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn
          depressed
          large
          color="yellow"
          width="100%"
          @click="onClickReject"
          :disabled="isLoading"
          style="color: white;"
        >
          Reject
        </v-btn>
      </v-col>
    </v-row>
    <SendDialog
      :loading="loading.send"
      :specimen="specimen"
      :show="sendDialog"
      @send="onSend"
      @cancel="sendDialog = false"
    />
    <RejectDialog
      ref="rejectDialog"
      :loading="loading.reject"
      :specimen="specimen"
      :show="rejectDialog"
      :error-message="error.reject"
      @reject="setSpecimenReject"
      @cancel="rejectDialog = false"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import sendTransaction from '../../../../../lib/send-transaction'
import SendDialog from './SendDialog'
import RejectDialog from './RejectDialog'

export default {
  name: 'Finalize',
  components: {
    SendDialog,
    RejectDialog,
  },
  props: {
    wallet: Object,
    specimen: Object,
    canSend: Boolean,
    isFileManagerLoading: Boolean,
  },
  computed: {
    isLoading() {
      return this.loading.send || this.loading.reject || this.isFileManagerLoading
    },
    ...mapState({
      degenicsContract: state => state.ethereum.contracts.contractDegenics
    })
  },
  data: () => ({
    loading: {
      send: false,
      reject: false
    },
    rejectDialog: false,
    sendDialog: false,
    error: {
      send: '',
      reject: '',
    }
  }),
  methods: {
    onClickSend() {
      this.sendDialog = true
    },
    onSend() {
      // this will trigger parent component's (Process.vue) onSend()
      // It will then trigger this.setSpecimenSuccess(filesParam)
      this.$emit('send')
    },
    onClickReject() {
      this.rejectDialog = true
    },
    async onReject(remark) {
      await this.setSpecimenReject(this.specimen.number, remark)
    },
    /**
     * setSpecimenSuccess
     * 
     * This method is triggered by the parent component
     * files are received from parent component
     */
    async setSpecimenSuccess(filesParam) {
      try {
        this.loading.send = true
        let files = []
        for (const [_, _files] of Object.entries(filesParam)) {
          _
          files = files.concat(_files)
        }
        console.log('in setSpecimenSuccess', filesParam)

        const abiData = this.degenicsContract.methods
          .analysisSucces(this.specimen.number, JSON.stringify(files), "Sucess")
          .encodeABI()
        let tx = await sendTransaction(
          this.degenicsContract._address, this.wallet, abiData
        )
        this.loading.send = false
        this.sendDialog = false

        return tx

      } catch (err) {
        this.loading.send = false
        this.error.send = err.message
        throw new Error('Error on set specimen success: ', err.message)
      }
    },
    /**
     * setSpecimenReject
     */
    async setSpecimenReject(remark) {
      try {
        this.loading.reject = true
        this.error.reject = ''

        console.log('sending specimen reject')
        const abiData = this.degenicsContract.methods
          .rejectSpecimen(this.specimen.number,  remark)
          .encodeABI()
        let tx = await sendTransaction(
          this.degenicsContract._address, this.wallet, abiData
        )

        this.loading.reject = false
        this.$refs.rejectDialog.clearRemark()
        this.rejectDialog = false

        this.$emit('reject')

        return tx

      } catch (err) {
        this.loading.reject = false
        this.error.reject = err.message
        console.log('Error on set specimen reject: ', err.message)
        // throw new Error('Error on set specimen reject: ', err.message)
      }
    }
  }
}
</script>

<style>

</style>
