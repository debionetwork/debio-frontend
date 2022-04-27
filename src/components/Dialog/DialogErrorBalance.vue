<template>
  <v-dialog :value="show" persistent width="420">
    <v-card color="white" class="d-flex flex-column align-center px-10 py-7">
      <v-card-title class="mt-5">
        Insufficient Balance
      </v-card-title>
      <v-img
        size="10"
        src="@/assets/alert-triangle.png"
        class="mt-8 mb-4"
      />
      <div align="center" class="grey--text mt-10 mb-10">
        Your transaction cannot succeed due to insufficient balance, check your account balance
      </div>
      <v-btn color="primary" @click="closeDialog" class="mb-8">
        Dismiss
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: "DialogErrorBalance",

  props: {
    show: Boolean
  },

  methods: {
    closeDialog() {
      this.$emit("close")
    }
  }
}
</script>
