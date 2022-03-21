<template>
  <v-dialog :value="show" width="310" persistent>
    <v-card color="white" class="d-flex flex-column align-center py-4 px-6">
      <v-img
        max-height="100"
        max-width="100"
        src="@/assets/error-cable.svg"
        class="mt-8 mb-4"
      />
      <v-card-title>
        Aw, snap!
      </v-card-title>
      <div align="center" class="grey--text mb-6">
        An Internal error occured during your request! try again later!
      </div>
      <v-btn color="secondary" @click="onClick">
        Back To Dashboard
      </v-btn>
    </v-card>
  </v-dialog>
</template>
<script>

export default {
  name: "DialogErrorConnection",

  components: {},

  props: {
    show: Boolean
  },

  methods: {
    onClick() {
      this.$emit("action");
    },
  },
}
</script>

<style></style>
