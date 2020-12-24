<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols=12 md="3">
          <SquareCardBtn @click="onGenerateAccount">
            <v-icon size="64">mdi-key-chain</v-icon>
            <div>Generate Account</div>
          </SquareCardBtn>
        </v-col>
      </v-row>
    </v-container>
    <GenerateAccountDialog
      :show="generateAccountDialog"
      @toggle="generateAccountDialog = $event"
    ></GenerateAccountDialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import SquareCardBtn from '../../../components/SquareCardBtn'
import GenerateAccountDialog from './GenerateAccountDialog'

export default {
  name: 'Home',
  components: {
    SquareCardBtn,
    GenerateAccountDialog,
  },
  data: () => ({
    generateAccountDialog: false,
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
  }
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
