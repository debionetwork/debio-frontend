<template>
    <v-container class="mnemonic-textbox mt-2 mb-2">
        <v-container :key="i" v-for="(mnemonics, i) in chunkedMnemonic">
            <v-btn
                elevation="2"
                small
                width="100"
                :class="mnemonic == ' ' ? 'mx-2 transparent' : 'mx-2'"
                v-for="(mnemonic, y) in mnemonics"
                :key="y"
                @click="emitClick(y + (i * 4))"
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
      let collection = this.mnemonicCollection
      if(collection.length < 12){
        let diff = 12 - collection.length
        for(let i = 0; i < diff; i++){
          collection.push(" ")
        }
      }
      return chunk(collection, 4)
    }
  },
  methods: {
    emitClick(idx) {
      this.$emit('mnemonic-index-remove', { idx: idx })
    }
  }
}
</script>

<style>
.mnemonic-textbox{
  background-color: lightgray;
}
.transparent{
  opacity: 0;
  cursor: default;
}
</style>
