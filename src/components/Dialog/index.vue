<template>
  <v-dialog
    :value="show"
    :width="width == null ? '500' : width"
    persistent
  >
    <v-card>
      <v-app-bar flat dense color="white">
        <v-toolbar-title class="title d-flex justify-space-between align-center" style="width: 100%;">
          <slot name="title"></slot>
          <v-btn v-if="$listeners && $listeners.close" icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-card-text class="mt-4 pb-0 text-subtitle-1">
        <slot name="body"></slot>
      </v-card-text>
      <v-card-actions class="pb-4 pt-2">
        <slot name="actions"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    show: Boolean,
    width: Number,
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    }
  }
}
</script>

<style>

</style>
