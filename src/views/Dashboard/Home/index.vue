<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="text-h4">
            Access My Account
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" md="3" sm="4">
          <SquareCardBtn @click="onGenerateAccount">
            <v-icon size="64">mdi-key-chain</v-icon>
            <div>Generate Account</div>
          </SquareCardBtn>
        </v-col>
        <v-col cols="6" md="3" sm="4">
          <SquareCardBtn @click="onUseMnemonic">
            <v-icon size="64">mdi-script-text</v-icon>
            <div>Use Mnemonic Phrase</div>
          </SquareCardBtn>
        </v-col>
      </v-row>
    </v-container>
    <GenerateAccountDialog
      :show="generateAccountDialog"
      @toggle="generateAccountDialog = $event"
    ></GenerateAccountDialog>
    <AccessAccountMnemonicDialog
      :show="accessAccountMnemonicDialog"
      @toggle="accessAccountMnemonicDialog = $event"
    ></AccessAccountMnemonicDialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import SquareCardBtn from '../../../components/SquareCardBtn'
import GenerateAccountDialog from './GenerateAccountDialog'
import AccessAccountMnemonicDialog from './AccessAccountMnemonicDialog'

export default {
  name: 'Home',
  components: {
    SquareCardBtn,
    GenerateAccountDialog,
    AccessAccountMnemonicDialog,
  },
  data: () => ({
    generateAccountDialog: false,
    accessAccountMnemonicDialog: false,
  }),
  methods: {
    ...mapActions({
      generateMnemonic: 'ethereum/generateMnemonic'
    }),
    onGenerateAccount() {
      // Mnemonic will be shown in <GenerateAccountDialog />
      this.generateMnemonic()
      this.generateAccountDialog = true
    },
    onUseMnemonic() {
      this.accessAccountMnemonicDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
