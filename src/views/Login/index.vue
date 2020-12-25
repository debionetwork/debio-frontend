<template>
  <v-app>
    <v-app-bar app flat color="white" dense>
      <v-spacer></v-spacer>
      <DevMenu />
    </v-app-bar>
    <v-main>
      <v-container>
        <div class="d-flex justify-center">
          <v-img
            src="@/assets/degenics-logo.webp"
            max-width="150px"
          />
        </div>
        <v-row class="mt-4">
          <v-col cols="12">
            <div class="text-h4 text-center grey--text text--darken-2">
              <b>Access Account</b>
            </div>
          </v-col>
        </v-row>
        <v-row justify="center" class="my-2">
          <v-col cols="6" md="3" sm="4" :class="$vuetify.breakpoint.mobile ? 'px-2 py-2' : ''">
            <SquareCardBtn @click="onGenerateAccount">
              <v-icon :size="$vuetify.breakpoint.mobile ? 48 : 64">mdi-key-chain</v-icon>
              <div>Generate Account</div>
            </SquareCardBtn>
          </v-col>
          <v-col cols="6" md="3" sm="4" :class="$vuetify.breakpoint.mobile ? 'px-2 py-2' : ''">
            <SquareCardBtn @click="onUseMnemonic">
              <v-icon :size="$vuetify.breakpoint.mobile ? 48 : 64">mdi-script-text</v-icon>
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
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
import DevMenu from '../../components/DevMenu'
import SquareCardBtn from '../../components/SquareCardBtn'
import GenerateAccountDialog from './GenerateAccountDialog'
import AccessAccountMnemonicDialog from './AccessAccountMnemonicDialog'

export default {
  name: 'Home',
  components: {
    DevMenu,
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
