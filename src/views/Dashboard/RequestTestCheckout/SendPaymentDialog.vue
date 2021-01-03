<template>
  <v-dialog
    :value="_show"
    width="500"
    persistent
  >
    <v-card>
      <v-app-bar flat dense color="white">
        <v-toolbar-title class="title">
          Send Payment
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card-text class="mt-4 pb-0 text-subtitle-1">
        <!-- Lab Recipient Details -->
        <div>
          <div class="text-h5">
            Payment Recipient
          </div>
          <div class="text-body-1 mt-4">
            <b>{{ lab.name }}</b>
          </div>
          <div v-if="lab.labAddress" class="text-body-2">
            {{ lab.labAddress }}
          </div>
          <div class="text-body-2">
            {{ lab.city }}, {{ lab.country }}
          </div>
        </div>

        <!-- Payment Details -->
        <div class="mt-6">
          <div class="text-h5">
            Payment Details
          </div>
          <div class="d-flex align-center justify-space-between mt-4">
            <div class="text-body-1">
              <b>Total Price</b>
            </div>
            <div>
              <span class="text-h6">
                {{ totalPrice }}
              </span>
              <span class="primary--text text-caption">
                DGNX
              </span>
            </div>
          </div>
          <div class="d-flex align-center justify-space-between">
            <div class="text-body-1">
              <b>Transaction Fee</b>
            </div>
            <div>
              <span class="text-h6">
                {{ transactionFee }}
              </span>
              <span class="text-caption">
                Gwei
              </span>
            </div>
          </div>
        </div>

        <!-- Prompt password to sign transaction -->
        <v-text-field
          class="mt-4"
          outlined
          auto-grow
          type="password"
          @keyup.enter="onSubmit"
          v-model="password"
          label="Input your password"
          :disabled="isLoading"
        >
        </v-text-field>
        <v-progress-linear
          v-if="isLoading"
          indeterminate
          color="primary"
        ></v-progress-linear>
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-btn
          depressed
          color="primary"
          large
          width="100%"
          @click="onSubmit"
          :disabled="!password || isLoading"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Wallet from 'ethereumjs-wallet'
import { mapState } from 'vuex'
import sendTransaction from '../../../lib/send-transaction'
import localStorage from '../../../lib/local-storage'

export default {
  name: 'SendPaymentDialog',
  props: {
    show: Boolean,
    lab: Object,
    totalPrice: [String, Number],
    products: Array,
  },
  data: () => ({
    password: '',
    isLoading: false,
    transactionFee: 'TODO',
  }),
  computed: {
    _show: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('toggle', val)
      }
    },
    ...mapState({
      web3: state => state.ethereum.web3,
      degenicsContract: state => state.ethereum.contracts.contractDegenics,
    }),
  },
  methods: {
    async onSubmit() {
      this.isLoading = true

      // registerSpecimen params
      const labAccount = this.lab.labAccount
      const specimensToProcess = this.products.map(p => ({
        labAccount,
        serviceCode: p.code,
        price: p.price,
        productDetail: p,
      }))

      // Retrieve wallet
      console.log('decrypting Keystore...')
      const keystore = localStorage.getKeystore()
      const wallet = await Wallet.fromV3(keystore, this.password)
      
      const receipts = []
      for (let specimen of specimensToProcess) {
        const { labAccount, serviceCode, price, productDetail } = specimen

        const specimenNumber = await this.registerSpecimen(labAccount, serviceCode, wallet)
        const txReceipt = await this.paySpecimen(specimenNumber, price, wallet)

        // FIXME: set specimen status to Sending here, for current prototype 
        await this.sendSpecimen(specimenNumber, wallet)
        
        receipts.push({ txReceipt, specimenNumber, productDetail })
      } 

      this.isLoading = false
      this.$emit('payment-sent', receipts)
      this.password = ''
    },
    closeDialog() {
      this._show = false
      this.password = ''
    },
    /**
    * registerSpecimen
    *
    * @param    {String} labAccount
    * @param    {String} serviceCode
    * @returns  {Number} specimenNumber
    */
    async registerSpecimen(labAccount, serviceCode, userWallet) {
      try {
        const abiData = this.degenicsContract.methods
          .registerSpecimen(labAccount, serviceCode)
          .encodeABI()
        await sendTransaction(this.degenicsContract._address, userWallet, abiData)
        
        const specimenNumber = await this.degenicsContract.methods
          .getLastNumber()
          .call({ from: userWallet.getAddressString() })

        return specimenNumber

      } catch (error) {
        console.log(error)
        return 'Error on registering specimen'
      }
    },
    /**
    * paySpecimen
    *
    * @param {String} specimenNumber
    * @param {String} price
    * @param {Wallet} userWallet
    * @returns {String} txHash
    */
    async paySpecimen(specimenNumber, price, userWallet) {
      console.log('Paying for specimen')
      try {
        // Get escrow address
        const escrowAddress = await this.degenicsContract.methods
          .getEscrow(specimenNumber)
          .call({ from: userWallet.getAddressString() })

        const txReceipt = await sendTransaction(escrowAddress, userWallet, null, price)

        return txReceipt

      } catch (err) {
        console.log(err)
        return 'Error on paying for specimen'
      }
    },
    /**
    * sendSpecimen
    * 
    * set specimen status to "Sending"
    * 
    * @param {String} specimenNumber
    * @param {Wallet} userWallet
    */
    async sendSpecimen(specimenNumber, userWallet) {
      try {
        const remark = ''
        const abiData = this.degenicsContract.methods
          .sendSpecimen(specimenNumber, remark)
          .encodeABI()
        const res = await sendTransaction(this.degenicsContract._address, userWallet, abiData)

        console.log(res)
      } catch (err) {
        console.log(err)
        return 'Error on sendSpecimen'
      }
    }
  }
}
</script>

<style>

</style>



