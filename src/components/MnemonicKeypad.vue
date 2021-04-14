<template>
    <v-container>
        <v-container :key="i" v-for="(mnemonics, i) in chunkedMnemonic">
            <v-btn
                elevation="2"
                small
                width="100"
                class="mx-2"
                v-for="(mnemonic, y) in mnemonics"
                :key="y"
                @click="emitClick(mnemonic)"
            >{{ mnemonic }}</v-btn>
        </v-container>
    </v-container>
</template>

<script>
import { chunk } from '../lib/arrays'
export default {
  name: 'MnemonicKeypad',
  props: {
    mnemonicCollection: Array,
  },
  computed: {
    chunkedMnemonic() {
      return chunk(this.mnemonicCollection, 4)
    }
  },
  methods: {
    emitClick(mnemonic) {
      this.$emit('mnemonic-keypad-click', { mnemonic: mnemonic })
    }
  }
}
</script>

<style>

</style>
