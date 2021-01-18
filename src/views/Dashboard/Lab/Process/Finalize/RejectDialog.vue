<template>
  <v-dialog
    :value="show"
    width="500"
    persistent
  >
    <v-card>
      <v-app-bar flat dense color="white">
        <v-toolbar-title class="title">
          Confirm Reject Specimen
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-card-text class="mt-4 pb-0 text-subtitle-1">
        <div>
          Are you sure you want to reject specimen <b>{{ specimen.number | specimenNumber }}</b>?
        </div>
        <div class="mt-2">
          <v-textarea
            outlined
            auto-grow
            label="Why is this specimen rejected?"
            :disabled="loading"
            v-model="remark"
            :error-messages="_errorMessages"
          ></v-textarea>
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
              color="grey"
              width="100%"
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
              color="yellow"
              width="100%"
              @click="onClickReject"
              :disabled="loading"
              :loading="loading"
              style="color: white;"
            >
              Reject
              <template v-slot:loader>
                Rejecting specimen
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
  name: 'RejectDialog',
  props: {
    specimen: Object,
    loading: Boolean,
    show: Boolean,
    errorMessage: String,
  },
  data: () => ({
    remark: ''
  }),
  computed: {
    _errorMessages() {
      if (this.errorMessage) {
        return [this.errorMessage]
      }
      return []
    }
  },
  methods: {
    onClickReject() {
      this.$emit('reject', this.remark)
    },
    clearRemark() {
      this.remark = ''
    },
    onClickCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style>

</style>