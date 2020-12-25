<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="text-h4">
            Dashboard
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// import { mapActions } from 'vuex'
// import SquareCardBtn from '../../../components/SquareCardBtn'
// import GenerateAccountDialog from './GenerateAccountDialog'
// import AccessAccountMnemonicDialog from './AccessAccountMnemonicDialog'

export default {
  name: 'Home',
  components: {
    // SquareCardBtn,
    // GenerateAccountDialog,
    // AccessAccountMnemonicDialog,
  },
  data: () => ({
    // generateAccountDialog: false,
    // accessAccountMnemonicDialog: false,
  }),
  methods: {
    // ...mapActions({
      // generateMnemonic: 'ethereum/generateMnemonic'
    // }),
    // onGenerateAccount() {
      // // Mnemonic will be shown in <GenerateAccountDialog />
      // this.generateMnemonic()
      // this.generateAccountDialog = true
    // },
    // onUseMnemonic() {
      // this.accessAccountMnemonicDialog = true
    // }
  }
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
