<template>
  <div>
    <v-container>
      <v-row>
        <v-progress-linear
          v-if="isLoading"
          class="mt-2"
          indeterminate
          color="primary"
        ></v-progress-linear>
        <template v-if="!isLoading && specimen">
          <v-col cols="12" md="3">
            <Checklist :specimen="specimen" :actions="actions" :done-actions="doneActions" />
          </v-col>
          <v-col cols="12" md="9">
            <OrderDetail
              :product="product"
              :specimen="specimen"
              :escrowAddress="escrowAddress"
            />
            <ReceiveSpecimen
              v-if="specimen && doneActions.length == 0 && !isProcessed"
              :specimen="specimen"
              :wallet="wallet"
              @specimenReceived="onSpecimenReceived"
            />
            <CheckWetWorkDone
              v-if="specimen && doneActions.includes('Received') && !isProcessed"
              :is-checked="doneActions.includes('Wetwork')"
              :disabled="specimen.status == SUCCESS"
              @check="onWetWorkDoneChecked"
            />
            <FileManager
              ref="fileManager"
              v-if="specimen && doneActions.includes('Received') && specimen.status != REJECTED"
              :wallet="wallet"
              :specimen="specimen"
              :enabled="doneActions.includes('Wetwork')"
              @actionDone="onActionDone"
              @actionUnDone="onActionUnDone"
            />
            <Finalize
              ref="finalize"
              v-if="specimen && doneActions.includes('Received') && !isProcessed"
              :wallet="wallet"
              :specimen="specimen"
              :can-send="canSend"
              @send="onSend"
              @reject="onReject"
            />
            <!-- Show if specimen is already processed (Succes / Reject) -->
            <template v-if="isProcessed">
              <div class="my-4">
                <RejectAlert
                  v-if="specimen && specimen.status == REJECTED"
                  :specimen="specimen"
                />
                <SuccessAlert v-if="specimen && specimen.status == SUCCESS" />
              </div>
            </template>
          </v-col>
        </template>
      </v-row>
    </v-container>
    <UnlockWalletDialog :show="unlockWalletDialog" @walletUnlocked="onWalletUnlocked" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import keystore from '../../../../lib/keystore'
import Checklist from './Checklist'
import OrderDetail from './OrderDetail'
import ReceiveSpecimen from './ReceiveSpecimen'
import UnlockWalletDialog from './UnlockWalletDialog'
import CheckWetWorkDone from './CheckWetWorkDone'
import FileManager from './FileManager'
import Finalize from './Finalize'
import RejectAlert from './RejectAlert'
import SuccessAlert from './SuccessAlert'
import { SENDING, RECEIVED, SUCCESS, REJECTED } from '@/constants/specimen-status'

export default {
  name: 'Process',
  components: {
    UnlockWalletDialog,
    Checklist,
    OrderDetail,
    ReceiveSpecimen,
    CheckWetWorkDone,
    FileManager,
    Finalize,
    RejectAlert,
    SuccessAlert,
  },
  data: () => ({
    SENDING, RECEIVED, SUCCESS, REJECTED,
    unlockWalletDialog: false,
    wallet: null,
    isLoading: false,
    lab: null,
    product: null,
    specimen: null,
    escrowAddress: null,
    confirmSpecimenNumber: '',
    actions: ['Received', 'Wetwork', 'Genome', 'Report', 'Sent'],
    doneActions: [],
  }),
  computed: {
    ...mapState({
      degenicsContract: state => state.ethereum.contracts.contractDegenics
    }),
    canSend() {
      // Can send processed specimen to blockchain if every required actions are done
      // required actions == all actions except 'Sent'
      const requiredActions = this.actions.filter(action => action != 'Sent')
      return requiredActions.every(action => this.doneActions.includes(action))
    },
    isProcessed() {
      return this.specimen.status == SUCCESS || this.specimen.status == REJECTED
    }
  },
  async mounted() {
    this.isLoading = true
    this.unlockWalletDialog = true
  },
  methods: {
    async onWalletUnlocked(wallet) {
      this.wallet = wallet
      this.unlockWalletDialog = false
      await this.loadData()
      this.setDoneActions()
    },
    async loadData() {
      const specimen = await this.getSpecimen()
      const lab = await this.getLabBySpecimen(specimen)
      const product = await this.getProduct(lab, specimen)
      const escrowAddress = await this.getEscrowAddress(specimen)
      this.product = product
      this.lab = lab
      this.specimen = specimen
      this.escrowAddress = escrowAddress

      this.isLoading = false
    },
    async getSpecimen() {
      const ks = keystore.get()
      const specimenNumber = this.$route.params.number
      const specimen = await this.degenicsContract.methods
        .specimenByNumber(specimenNumber).call({ from: ks.address })

      return specimen
    },
    async getLabBySpecimen(specimen) {
      const ks = keystore.get()
      const lab = await this.degenicsContract.methods
        .labByAccount(specimen.labAccount).call({ from: ks.address })

      return lab
    },
    async getProduct(lab, specimen) {
      console.log(specimen)
      const ks = keystore.get()
      const services = await this.degenicsContract.methods
        .serviceCount(lab.labAccount).call({ from: ks.address })
        .then(async count => {
          const servicePromises = []
          for (let i = 1; i <= count; i++) {
            const promise = this.degenicsContract.methods
              .serviceByIndex(lab.labAccount, i).call({ from: ks.address })
            servicePromises.push(promise)
          }
          const _services = await Promise.all(servicePromises)
          return _services
        })
      const product = services.find(s => s.code == specimen.serviceCode)

      // Parse product additionalData
      try {
        const additionalData = JSON.parse(product.additionalData)
        if (additionalData.icon) {
          product.icon = additionalData.icon
        }
      } catch (err) {
        product.additionalData = {}
      }

      return product
    },
    async getEscrowAddress(specimen) {
      const ks = keystore.get()
      const escrowAddress = await this.degenicsContract.methods
        .getEscrow(specimen.number)
        .call({ from: ks.address })
      
      return escrowAddress
    },
    setDoneActions() {
      if (this.specimen.status == SUCCESS) {
        this.doneActions = [...this.actions]
        return
      }
      if (this.specimen.status == REJECTED) {
        this.doneActions = ['Received']
        return
      }

      this.doneActions = this.actions.slice(
        0,
        this.actions.indexOf(this.specimen.status) + 1
      )
    },
    onSpecimenReceived(tx) {
      console.log(tx)
      this.doneActions.push('Received')
    },
    onWetWorkDoneChecked(val) {
      console.log('wet work done checked', val)
      if (val) {
        this.doneActions.push('Wetwork')
      }
      if (!val) {
        this.doneActions = this.doneActions.filter(action => action != 'Wetwork')
      }
    },
    onActionDone(action) {
      console.log('in action done', action)
      if (!this.doneActions.includes('Wetwork')) {
        this.doneActions.push('Wetwork')
      }
      this.doneActions.push(action)
    },
    onActionUnDone(action) {
      console.log('in action undone')
      this.doneActions = this.doneActions.filter(act => act != action)
    },
    async onSend() {
      try {
        // Grab the files from FileManager component
        // Pass it to Finalize component send method
        const files = this.$refs.fileManager.files
        const tx = await this.$refs.finalize.setSpecimenSuccess(files)
        console.log('Set Specimen Success TX: ', tx)

        this.specimen.status = SUCCESS
        this.setDoneActions()
        
      } catch (err) {
        console.log(err)
      }
    },
    onReject() {
      this.specimen.status = REJECTED
    }
  }
}
</script>

<style lang="scss">

</style>
