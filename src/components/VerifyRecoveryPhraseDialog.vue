<template>
  <v-dialog
    :value="_show"
    width="590"
    persistent
  >
    <v-card>
      <v-app-bar flat dense color="white">
        <v-container class="title mt-5 mb-5 text-center">
          Verify Recovery Phrase
        </v-container>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card-text class="pb-0 text-subtitle-1 text-center">      
        <b>Tap the words to put them next to each other in the correct order</b>
        <MnemonicTextbox
            :mnemonicCollection="mnemonicCollectionTextbox"
            @mnemonic-index-remove="({ idx }) => removeMnemonicCollectionTextbox(idx)"
        ></MnemonicTextbox>
        <MnemonicKeypad
            :mnemonicCollection="shuffledMnemonic"
            @mnemonic-keypad-click="({ mnemonic }) => addMnemonicCollectionTextbox(mnemonic)"
        ></MnemonicKeypad>
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-btn
          :disabled="shouldBeDisabled"
          depressed
          color="primary"
          large
          width="100%"
          @click="onMnemonicSaved"
        >
          Continue
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import MnemonicTextbox from './MnemonicTextbox.vue'
import MnemonicKeypad from './MnemonicKeypad.vue'
import { shuffle, removeArrayByIndex, isIdentical } from '../lib/arrays'

export default {
  components: { 
    MnemonicKeypad,
    MnemonicTextbox
  },
  name: 'VerifyRecoveryPhraseDialog',
  props: {
    show: Boolean,
    role: String,
    mnemonic: String,
  },
  data: () => ({
    mnemonicData: '',
    shuffledMnemonic: [],
    correctMnemonicCollection: [],
    mnemonicCollection: [],
    mnemonicCollectionTextbox: [],
    shouldBeDisabled: true
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
  },
  watch: {
    _show(isShow) {
      if (isShow) {
        this.mnemonicData = this.mnemonic
        this.correctMnemonicCollection = this.mnemonicData.split(" ")
        this.shuffledMnemonic = shuffle(this.mnemonicData.split(" "))
      }
    }
  },
  methods: {
    removeMnemonicCollectionTextbox(idx) {
      this.mnemonicCollection = removeArrayByIndex(this.mnemonicCollection, idx)
      this.mnemonicCollectionTextbox = []
      for(let i = 0; i < this.mnemonicCollection.length; i++){
        this.mnemonicCollectionTextbox.push(this.mnemonicCollection[i])
      }
    },
    addMnemonicCollectionTextbox(mnemonic) {
      if(this.mnemonicCollection.length < 12){
        this.mnemonicCollection.push(mnemonic)

        this.mnemonicCollectionTextbox = []
        for(let i = 0; i < this.mnemonicCollection.length; i++){
          this.mnemonicCollectionTextbox.push(this.mnemonicCollection[i])
        }

        this.shouldBeDisabled = !isIdentical(this.mnemonicCollection, this.correctMnemonicCollection)
      }
    },
    onMnemonicSaved() {
      this._show = false
      this.$emit('mnemonic-and-role', { mnemonic: this.mnemonicData, role: this.role })
      this.mnemonicData = ''
      this.shuffledMnemonic = []
      this.mnemonicCollection = []
      this.mnemonicCollectionTextbox = []
      this.correctMnemonicCollection = []
    },
    closeDialog() {
      this._show = false
      this.mnemonicData = ''
      this.shuffledMnemonic = []
      this.mnemonicCollection = []
      this.mnemonicCollectionTextbox = []
      this.correctMnemonicCollection = []
    }
  }
}
</script>

<style>

</style>
