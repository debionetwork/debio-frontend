<template>
  <v-card class="dg-card px-3 py-2 mb-2">
    <div class="d-flex align-center">
      <div>{{ file.fileName }}</div>
      <v-spacer />
      <div class="d-flex">
        <a :href="getFileIpfsUrl(file)" target="_blank" style="text-decoration: none;">
          <v-btn icon text>
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </a>
        <v-btn v-if="!hideDelete" @click="onDeleteClick" icon text>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    file: Object,
    hideDelete: Boolean
  },
  methods: {
    onDeleteClick() {
      this.$emit('delete', this.file)
    },
    /**
     * @returns {String} The first ipfs path (a file has multiple ipfs path, because a file may be chunked)
     */
    getFileIpfsPath(file) {
      return file.ipfsPath[0].data.path
    },
    getFileIpfsUrl(file) {
      const path = this.getFileIpfsPath(file)
      return `https://ipfs.io/ipfs/${path}`
    }
  }
}
</script>

<style>

</style>