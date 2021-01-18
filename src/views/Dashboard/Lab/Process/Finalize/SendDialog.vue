<template>
  <v-dialog
    :value="show"
    width="500"
    persistent
  >
    <v-card>
      <v-app-bar flat dense color="white">
        <v-toolbar-title class="title">
          Confirm Send Specimen
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-card-text class="mt-4 pb-0 text-subtitle-1">
        <div>
          Are you sure you want to send specimen <b>{{ specimen.number | specimenNumber }}</b>?
        </div>
        <v-progress-linear
          v-if="loading"
          class="mt-2"
          indeterminate color="primary"
        />
      </v-card-text>
      <v-card-actions class="pb-4 pt-2">
        <div class="d-flex justify-space-between" style="width: 100%;">
          <div class="pr-1" style="flex: 1">
            <v-btn
              depressed
              large
              width="100%"
              color="grey"
              @click="onClickCancel"
              :disabled="loading"
              style="color: white;"
            >
              Cancel
            </v-btn>
          </div>
          <div class="pl-1" style="flex: 1">
            <v-btn
              depressed
              large
              width="100%"
              color="green"
              @click="onClickSend"
              :disabled="loading"
              :loading="loading"
              style="color: white;"
            >
              Send
              <template v-slot:loader>
                Sending specimen
              </template>
            </v-btn>
          </div>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SendDialog',
  props: {
    specimen: Object,
    loading: Boolean,
    show: Boolean,
  },
  methods: {
    onClickSend() {
      this.$emit('send')
    },
    onClickCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style>

</style>